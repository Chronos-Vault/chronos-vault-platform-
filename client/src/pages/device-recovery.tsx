import React from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'wouter';
import { Shield, Lock, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DeviceRecoveryFlow from '@/components/auth/DeviceRecoveryFlow';

const DeviceRecoveryPage: React.FC = () => {
  const [, setLocation] = useLocation();
  
  return (
    <>
      <Helmet>
        <title>Device Recovery | Chronos Vault</title>
        <meta name="description" content="Recover your Chronos Vault access on this device" />
      </Helmet>
      
      <div className="container py-6">
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mr-2"
            onClick={() => setLocation('/')}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Home
          </Button>
          
          <div className="ml-auto flex items-center">
            <Shield className="h-5 w-5 mr-2 text-purple-400" />
            <h1 className="text-lg font-medium">Device Recovery</h1>
          </div>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 backdrop-blur-sm rounded-lg p-6 mb-8 border border-purple-800/20">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-full bg-purple-600/20 flex items-center justify-center mr-4">
                <Lock className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Secure Access Recovery</h2>
                <p className="text-sm text-gray-400">
                  Restore access to your vaults on this device
                </p>
              </div>
            </div>
            
            <div className="text-sm space-y-4 mb-6">
              <p>
                Our multi-signature recovery system provides bank-grade security while ensuring you can
                always regain access to your vaults, even if you lose your primary device.
              </p>
              <div className="grid md:grid-cols-3 gap-4 text-center text-xs">
                <div className="bg-black/30 rounded-lg p-3">
                  <div className="font-medium mb-1">Multi-Signature Verification</div>
                  <div className="text-gray-400">Secure recovery with approval from trusted co-signers</div>
                </div>
                <div className="bg-black/30 rounded-lg p-3">
                  <div className="font-medium mb-1">Recovery Key</div>
                  <div className="text-gray-400">Use your backup recovery key to quickly restore access</div>
                </div>
                <div className="bg-black/30 rounded-lg p-3">
                  <div className="font-medium mb-1">QR Code Pairing</div>
                  <div className="text-gray-400">Instantly pair with your existing authenticated device</div>
                </div>
              </div>
            </div>
          </div>
          
          <DeviceRecoveryFlow />
          
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>If you're unable to recover access using these methods, please contact our support team.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeviceRecoveryPage;