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

import { useAuthContext } from '@/contexts/auth-context';
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
  const { isAuthenticated, address, connectWallet } = useAuthContext();
  const { generateRecoveryProof, verifyRecoverySignature, generateQRPairingCode } = useSecurityService();
  
  const [recoveryMethod, setRecoveryMethod] = useState<'multi-sig' | 'recovery-key' | 'qr-pairing'>('multi-sig');
  const [recoveryKey, setRecoveryKey] = useState<string>('');
  const [recoveryEmail, setRecoveryEmail] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [verificationProgress, setVerificationProgress] = useState<number>(0);
  const [verificationComplete, setVerificationComplete] = useState<boolean>(false);
  const [verificationFailed, setVerificationFailed] = useState<boolean>(false);
  const [qrCodeData, setQrCodeData] = useState<string>('');
  const [recoveryStatus, setRecoveryStatus] = useState<string>('');
  const [authorizedSigners, setAuthorizedSigners] = useState<string[]>([]);
  const [signaturesReceived, setSignaturesReceived] = useState<{address: string, verified: boolean}[]>([]);
  
  // Simulate fetch of vault signers on component mount
  useEffect(() => {
    const fetchVaultSigners = async () => {
      try {
        // In a real implementation, this would call the blockchain to get authorized signers
        // For now, we'll simulate with dummy addresses
        const signers = [
          '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', // Primary (current user)
          '0x70997970C51812dc3A010C7d01b50e0d17dc79C8', // Secondary signer
          '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC'  // Tertiary signer
        ];
        setAuthorizedSigners(signers);
      } catch (error) {
        console.error('Error fetching vault signers:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch authorized signers for your vault',
          variant: 'destructive',
        });
      }
    };
    
    fetchVaultSigners();
    
    // Generate QR code for pairing if that method is selected
    if (recoveryMethod === 'qr-pairing') {
      generatePairingQRCode();
    }
  }, [recoveryMethod]);
  
  // Update verification progress based on signatures received
  useEffect(() => {
    if (authorizedSigners.length > 0) {
      const requiredSignatures = Math.ceil(authorizedSigners.length / 2); // Typically require majority
      const verifiedCount = signaturesReceived.filter(sig => sig.verified).length;
      
      const progressValue = Math.min(100, Math.floor((verifiedCount / requiredSignatures) * 100));
      setVerificationProgress(progressValue);
      
      if (verifiedCount >= requiredSignatures) {
        setVerificationComplete(true);
        setRecoveryStatus('Recovery verification complete! Redirecting to your vault...');
        
        // Simulate successful authentication after a short delay
        setTimeout(() => {
          setLocation('/dashboard');
        }, 2500);
      }
    }
  }, [signaturesReceived, authorizedSigners, setLocation]);
  
  // Generate QR code for device pairing
  const generatePairingQRCode = async () => {
    try {
      // In a real implementation, this would generate a secure, time-limited pairing code
      const pairingCode = await generateQRPairingCode(address || '');
      setQrCodeData(pairingCode);
      
      // Simulate checking for pairing
      let checkCount = 0;
      const pairingCheckInterval = setInterval(() => {
        checkCount++;
        setRecoveryStatus(`Waiting for device pairing... (${checkCount}s)`);
        
        // Simulate successful pairing after 10 seconds
        if (checkCount >= 10) {
          clearInterval(pairingCheckInterval);
          handlePairingSuccess();
        }
      }, 1000);
      
      return () => clearInterval(pairingCheckInterval);
    } catch (error) {
      console.error('Error generating pairing QR code:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate pairing QR code',
        variant: 'destructive',
      });
    }
  };
  
  // Handle recovery key verification
  const handleRecoveryKeyVerification = async () => {
    setIsProcessing(true);
    setRecoveryStatus('Verifying recovery key...');
    
    try {
      // In a real implementation, this would verify the recovery key against stored data
      setTimeout(() => {
        // Simulate successful verification
        setVerificationProgress(100);
        setVerificationComplete(true);
        setRecoveryStatus('Recovery key verification successful! Redirecting to your vault...');
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          setLocation('/dashboard');
        }, 2000);
      }, 3000);
    } catch (error) {
      console.error('Error verifying recovery key:', error);
      setVerificationFailed(true);
      setRecoveryStatus('Recovery key verification failed. Please try again or use another recovery method.');
      toast({
        title: 'Verification Failed',
        description: 'The recovery key could not be verified. Please check and try again.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Handle multi-signature verification
  const handleMultiSigVerification = async () => {
    setIsProcessing(true);
    setRecoveryStatus('Initiating multi-signature recovery process...');
    
    try {
      // In a real implementation, this would generate a recovery request on the blockchain
      // For simulation, we'll just add signatures after delays
      
      // Simulate receiving first signature almost immediately
      setTimeout(() => {
        setSignaturesReceived(prev => [
          ...prev, 
          { 
            address: authorizedSigners[0], 
            verified: true 
          }
        ]);
        setRecoveryStatus('Received signature from primary signer...');
      }, 1500);
      
      // Simulate receiving second signature after a delay
      setTimeout(() => {
        setSignaturesReceived(prev => [
          ...prev, 
          { 
            address: authorizedSigners[1], 
            verified: true 
          }
        ]);
        setRecoveryStatus('Received signature from secondary signer...');
      }, 4000);
      
    } catch (error) {
      console.error('Error in multi-signature recovery:', error);
      setVerificationFailed(true);
      setRecoveryStatus('Multi-signature recovery failed. Please try again later.');
      toast({
        title: 'Recovery Failed',
        description: 'Could not complete the multi-signature recovery process.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Handle successful device pairing
  const handlePairingSuccess = () => {
    setVerificationProgress(100);
    setVerificationComplete(true);
    setRecoveryStatus('Device successfully paired! Redirecting to your vault...');
    
    // Redirect to dashboard after a short delay
    setTimeout(() => {
      setLocation('/dashboard');
    }, 2000);
  };
  
  // Reset verification state when changing methods
  const handleMethodChange = (method: 'multi-sig' | 'recovery-key' | 'qr-pairing') => {
    setRecoveryMethod(method);
    setVerificationProgress(0);
    setVerificationComplete(false);
    setVerificationFailed(false);
    setSignaturesReceived([]);
    setRecoveryStatus('');
    
    if (method === 'qr-pairing') {
      generatePairingQRCode();
    }
  };
  
  return (
    <div className="container max-w-lg py-10">
      <Card className="border-purple-200 bg-gradient-to-br from-black/80 to-purple-900/40 backdrop-blur-sm">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-2">
            <div className="h-12 w-12 rounded-full bg-purple-900/30 flex items-center justify-center">
              <Shield className="h-6 w-6 text-purple-200" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center text-purple-50">Secure Device Recovery</CardTitle>
          <CardDescription className="text-center text-purple-200/80">
            Restore access to your Chronos Vault on this device
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs 
            defaultValue="multi-sig" 
            onValueChange={(value) => handleMethodChange(value as any)}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="multi-sig">Multi-Signature</TabsTrigger>
              <TabsTrigger value="recovery-key">Recovery Key</TabsTrigger>
              <TabsTrigger value="qr-pairing">QR Pairing</TabsTrigger>
            </TabsList>
            
            {/* Multi-Signature Recovery */}
            <TabsContent value="multi-sig" className="space-y-4 mt-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <KeyRound className="h-4 w-4" />
                  Multi-Signature Recovery
                </h3>
                <p className="text-sm text-muted-foreground">
                  Recover access using signatures from your trusted vault co-signers
                </p>
              </div>
              
              {verificationComplete ? (
                <Alert className="bg-green-900/20 border-green-500/40 text-green-200">
                  <Check className="h-4 w-4" />
                  <AlertTitle>Verification Complete</AlertTitle>
                  <AlertDescription>
                    {recoveryStatus}
                  </AlertDescription>
                </Alert>
              ) : verificationFailed ? (
                <Alert className="bg-red-900/20 border-red-500/40 text-red-200">
                  <X className="h-4 w-4" />
                  <AlertTitle>Verification Failed</AlertTitle>
                  <AlertDescription>
                    {recoveryStatus}
                  </AlertDescription>
                </Alert>
              ) : (
                <>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="text-xs font-medium text-muted-foreground">Required Signatures</h4>
                      <div className="space-y-2">
                        {authorizedSigners.map((signer, index) => {
                          const received = signaturesReceived.find(sig => sig.address === signer);
                          return (
                            <div key={index} className="flex items-center justify-between p-2 bg-black/20 rounded-md">
                              <span className="text-xs font-mono truncate w-64">{signer}</span>
                              {received ? (
                                <span className="flex items-center text-xs text-green-400">
                                  <Check className="h-3 w-3 mr-1" />
                                  Verified
                                </span>
                              ) : (
                                <span className="text-xs text-yellow-400">Pending</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-xs">Verification Progress</span>
                        <span className="text-xs">{verificationProgress}%</span>
                      </div>
                      <Progress value={verificationProgress} className="h-2" />
                    </div>
                    
                    {recoveryStatus && (
                      <div className="text-sm text-purple-200/80 italic">
                        {recoveryStatus}
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    onClick={handleMultiSigVerification}
                    disabled={isProcessing || verificationComplete}
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Initialize Recovery'
                    )}
                  </Button>
                </>
              )}
            </TabsContent>
            
            {/* Recovery Key */}
            <TabsContent value="recovery-key" className="space-y-4 mt-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <KeyRound className="h-4 w-4" />
                  Recovery Key Verification
                </h3>
                <p className="text-sm text-muted-foreground">
                  Use your backup recovery key to restore access
                </p>
              </div>
              
              {verificationComplete ? (
                <Alert className="bg-green-900/20 border-green-500/40 text-green-200">
                  <Check className="h-4 w-4" />
                  <AlertTitle>Verification Complete</AlertTitle>
                  <AlertDescription>
                    {recoveryStatus}
                  </AlertDescription>
                </Alert>
              ) : verificationFailed ? (
                <Alert className="bg-red-900/20 border-red-500/40 text-red-200">
                  <X className="h-4 w-4" />
                  <AlertTitle>Verification Failed</AlertTitle>
                  <AlertDescription>
                    {recoveryStatus}
                  </AlertDescription>
                </Alert>
              ) : (
                <>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Recovery Key</label>
                      <Input
                        placeholder="Enter your recovery key"
                        value={recoveryKey}
                        onChange={(e) => setRecoveryKey(e.target.value)}
                        className="bg-black/30 border-purple-500/30"
                      />
                      <p className="text-xs text-muted-foreground">
                        This is the 24-character recovery key you received when setting up your vault
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Recovery Email (Optional)</label>
                      <Input
                        type="email"
                        placeholder="Enter your recovery email"
                        value={recoveryEmail}
                        onChange={(e) => setRecoveryEmail(e.target.value)}
                        className="bg-black/30 border-purple-500/30"
                      />
                      <p className="text-xs text-muted-foreground">
                        We'll send a confirmation code to this email if needed
                      </p>
                    </div>
                    
                    {recoveryStatus && (
                      <div className="text-sm text-purple-200/80 italic">
                        {recoveryStatus}
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-xs">Verification Progress</span>
                        <span className="text-xs">{verificationProgress}%</span>
                      </div>
                      <Progress value={verificationProgress} className="h-2" />
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    onClick={handleRecoveryKeyVerification}
                    disabled={!recoveryKey || isProcessing || verificationComplete}
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      'Verify Recovery Key'
                    )}
                  </Button>
                </>
              )}
            </TabsContent>
            
            {/* QR Pairing */}
            <TabsContent value="qr-pairing" className="space-y-4 mt-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  Device Pairing
                </h3>
                <p className="text-sm text-muted-foreground">
                  Pair this device with your existing authenticated device
                </p>
              </div>
              
              {verificationComplete ? (
                <Alert className="bg-green-900/20 border-green-500/40 text-green-200">
                  <Check className="h-4 w-4" />
                  <AlertTitle>Pairing Complete</AlertTitle>
                  <AlertDescription>
                    {recoveryStatus}
                  </AlertDescription>
                </Alert>
              ) : (
                <>
                  <div className="space-y-4">
                    <div className="flex justify-center py-3">
                      <div className="w-48 h-48 bg-white p-3 rounded-lg relative">
                        {qrCodeData ? (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center relative">
                            <span className="absolute inset-0 flex items-center justify-center text-sm text-gray-800">
                              QR Code Simulation
                            </span>
                            <QrCode className="h-20 w-20 text-gray-800 opacity-25" />
                          </div>
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <RefreshCw className="h-6 w-6 text-gray-400 animate-spin" />
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-center">
                      <h4 className="text-sm font-medium">Scan With Your Authenticated Device</h4>
                      <p className="text-xs text-muted-foreground">
                        Open Chronos Vault on your authenticated device and select "Pair New Device" in settings
                      </p>
                    </div>
                    
                    {recoveryStatus && (
                      <div className="text-sm text-purple-200/80 italic text-center">
                        {recoveryStatus}
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-xs">Pairing Progress</span>
                        <span className="text-xs">{verificationProgress}%</span>
                      </div>
                      <Progress value={verificationProgress} className="h-2" />
                    </div>
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-2">
          <Separator className="mb-2 bg-purple-500/20" />
          <div className="text-xs text-purple-200/60 text-center">
            For additional recovery options, please contact our support team.
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DeviceRecoveryFlow;