import React, { useState, useEffect } from 'react';
import { biometricAuthService } from '@/services/biometric-auth-service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Fingerprint, Shield, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface BiometricAuthProps {
  userId?: string;
  username?: string;
  onAuthSuccess?: (userId: string) => void;
  onAuthFailure?: (error: string) => void;
  onRegisterSuccess?: (credential: any) => void;
  mode?: 'register' | 'authenticate';
}

export function BiometricAuth({
  userId = '',
  username = '',
  onAuthSuccess,
  onAuthFailure,
  onRegisterSuccess,
  mode = 'authenticate'
}: BiometricAuthProps) {
  const [isSupported, setIsSupported] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  
  // Check if biometric authentication is supported on this device
  useEffect(() => {
    const checkSupport = async () => {
      try {
        const supported = await biometricAuthService.isBiometricSupported();
        setIsSupported(supported);
      } catch (err) {
        console.error('Error checking biometric support:', err);
        setIsSupported(false);
      }
    };
    
    checkSupport();
  }, []);
  
  // Function to handle biometric registration
  const handleRegister = async () => {
    if (!userId || !username) {
      setError('User ID and username are required for registration');
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(false);
    setProgress(10);
    
    try {
      // Simulate progress for a better user experience
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 300);
      
      const credential = await biometricAuthService.registerBiometric(userId, username);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      if (credential) {
        setSuccess(true);
        if (onRegisterSuccess) {
          onRegisterSuccess(credential);
        }
      } else {
        setError('Failed to register biometric credential');
        if (onAuthFailure) {
          onAuthFailure('Registration failed');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to register biometric credential');
      if (onAuthFailure) {
        onAuthFailure(err.message || 'Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Function to handle biometric authentication
  const handleAuthenticate = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    setProgress(10);
    
    try {
      // Simulate progress for a better user experience
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 15, 90));
      }, 200);
      
      const authResult = await biometricAuthService.authenticate(userId);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      if (authResult) {
        setSuccess(true);
        if (onAuthSuccess) {
          onAuthSuccess(userId);
        }
      } else {
        setError('Authentication failed');
        if (onAuthFailure) {
          onAuthFailure('Authentication failed');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
      if (onAuthFailure) {
        onAuthFailure(err.message || 'Authentication failed');
      }
    } finally {
      setLoading(false);
    }
  };
  
  // If we don't know yet if biometric auth is supported, show a loading state
  if (isSupported === null) {
    return (
      <Card className="max-w-md w-full mx-auto bg-black/40 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Fingerprint className="w-5 h-5 mr-2 text-[#3F51FF]" />
            Biometric Authentication
          </CardTitle>
          <CardDescription>Checking device compatibility...</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center p-8">
          <div className="animate-spin w-10 h-10 border-2 border-[#3F51FF] border-t-transparent rounded-full"></div>
        </CardContent>
      </Card>
    );
  }
  
  // If biometric authentication is not supported on this device
  if (isSupported === false) {
    return (
      <Card className="max-w-md w-full mx-auto bg-black/40 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center text-red-400">
            <AlertCircle className="w-5 h-5 mr-2" />
            Not Supported
          </CardTitle>
          <CardDescription>Biometric authentication is not supported on this device.</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="bg-red-900/20 border-red-800">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Device Incompatible</AlertTitle>
            <AlertDescription>
              Your device or browser does not support WebAuthn or does not have biometric capabilities.
              Try using a different device or updating your browser.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }
  
  // Render the biometric authentication UI
  return (
    <Card className="max-w-md w-full mx-auto bg-black/40 border-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Fingerprint className="w-5 h-5 mr-2 text-[#3F51FF]" />
          Biometric Authentication
        </CardTitle>
        <CardDescription>
          {mode === 'register' 
            ? 'Register a new biometric credential for secure access' 
            : 'Sign in using your fingerprint or face ID'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Error message */}
        {error && (
          <Alert className="bg-red-900/20 border-red-800">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Authentication Failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {/* Success message */}
        {success && (
          <Alert className="bg-green-900/20 border-green-800">
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>
              {mode === 'register' ? 'Registration Successful' : 'Authentication Successful'}
            </AlertTitle>
            <AlertDescription>
              {mode === 'register' 
                ? 'Your biometric credential has been successfully registered.'
                : 'You have been successfully authenticated.'}
            </AlertDescription>
          </Alert>
        )}
        
        {/* Progress indicator during auth process */}
        {loading && (
          <div className="space-y-2">
            <Progress value={progress} className="h-2 bg-gray-800" />
            <p className="text-sm text-gray-400 text-center">
              {mode === 'register' 
                ? 'Registering your biometric credential...' 
                : 'Authenticating...'}
            </p>
          </div>
        )}
        
        {/* Icon and instructions */}
        <div className="flex flex-col items-center justify-center py-6">
          <div className="bg-[#3F51FF]/20 p-6 rounded-full mb-4">
            <Fingerprint 
              className={`h-16 w-16 ${loading ? 'text-[#3F51FF] animate-pulse' : 'text-[#3F51FF]'}`} 
            />
          </div>
          <p className="text-center text-gray-400 max-w-xs">
            {mode === 'register'
              ? 'Register your biometric data (fingerprint, face ID) for quick and secure vault access.'
              : 'Use your fingerprint, face ID or other biometric method to securely authenticate.'}
          </p>
        </div>
        
        {/* Security benefits */}
        <div className="bg-black/30 p-4 rounded-lg border border-gray-800">
          <h4 className="text-sm font-medium mb-2 flex items-center">
            <Shield className="h-4 w-4 mr-2 text-[#3F51FF]" />
            Enhanced Security
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
              Biometric data never leaves your device
            </li>
          </ul>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full bg-gradient-to-r from-[#3F51FF] to-[#8B5CF6] hover:from-[#3647E3] hover:to-[#7B50DE]"
          onClick={mode === 'register' ? handleRegister : handleAuthenticate}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="animate-spin mr-2">⟳</span>
              {mode === 'register' ? 'Registering...' : 'Authenticating...'}
            </>
          ) : (
            mode === 'register' ? 'Register Biometric' : 'Authenticate with Biometric'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}