import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { TonWalletSelector } from '@/components/ton/TonWalletSelector';
import { Button } from '@/components/ui/button';
import { ArrowRight, Lock, Shield, Timer, WalletCards } from 'lucide-react';
import { ConnectionStatus, WalletInfo, tonConnector } from '@/lib/ton/enhanced-ton-connector';

export default function ConnectTonPage() {
  const [location, setLocation] = useLocation();
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(
    tonConnector.getStatus()
  );
  const [returnUrl, setReturnUrl] = useState<string>('/dashboard');

  // Parse return URL from query parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const returnPath = params.get('returnUrl');
    if (returnPath) {
      setReturnUrl(returnPath);
    }
  }, []);

  // Listen for wallet connection status changes
  useEffect(() => {
    const handleStatusChange = (status: ConnectionStatus, wallet: WalletInfo | null) => {
      setConnectionStatus(status);
      setWalletInfo(wallet);
      
      // If connected, redirect after a short delay
      if (status === ConnectionStatus.CONNECTED && wallet) {
        setTimeout(() => {
          setLocation(returnUrl);
        }, 1500);
      }
    };
    
    tonConnector.addConnectionListener(handleStatusChange);
    
    return () => {
      tonConnector.removeConnectionListener(handleStatusChange);
    };
  }, [returnUrl, setLocation]);

  // Handle continue without connecting
  const handleSkip = () => {
    setLocation(returnUrl);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 container max-w-screen-xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left column: Connect wallet UI */}
          <motion.div 
            className="flex flex-col items-center lg:items-start space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center lg:text-left">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
                Connect Your <span className="text-gradient-primary">TON Wallet</span>
              </h1>
              <p className="text-muted-foreground text-lg max-w-xl">
                Securely connect your TON wallet to access all features of Chronos Vault and manage your time-locked digital assets.
              </p>
            </div>

            <div className="w-full max-w-md p-6 border rounded-xl bg-card shadow-sm">
              <h2 className="text-xl font-semibold mb-6">Select Your Wallet</h2>
              
              {connectionStatus === ConnectionStatus.CONNECTED && walletInfo ? (
                <div className="text-center py-6">
                  <div className="h-16 w-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <img 
                      src={`/assets/wallets/${walletInfo.type}-logo.svg`} 
                      alt={walletInfo.name} 
                      className="h-10 w-10"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/assets/wallets/ton-generic-logo.svg';
                      }}
                    />
                  </div>
                  <h3 className="text-xl font-semibold">{walletInfo.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {walletInfo.address}
                  </p>
                  <p className="text-sm text-green-500 font-medium mb-4">
                    Connected Successfully
                  </p>
                  <Button 
                    onClick={() => setLocation(returnUrl)}
                    className="w-full"
                  >
                    Continue to Chronos Vault
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    <TonWalletSelector 
                      buttonLabel="Connect with Tonkeeper"
                      buttonVariant="default"
                      buttonSize="lg"
                      className="w-full"
                      onWalletConnected={(wallet) => {
                        setWalletInfo(wallet);
                      }}
                    />
                    
                    <div className="relative flex items-center py-2">
                      <div className="flex-grow border-t border-border"></div>
                      <span className="flex-shrink mx-4 text-muted-foreground text-sm">or continue with</span>
                      <div className="flex-grow border-t border-border"></div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <Button 
                        variant="outline" 
                        size="lg"
                        className="flex items-center justify-center gap-2 py-6"
                        onClick={() => tonConnector.connect()}
                      >
                        <img 
                          src="/assets/wallets/tonhub-logo.svg" 
                          alt="TON Hub" 
                          className="h-5 w-5"
                        />
                        TON Hub
                      </Button>
                      <Button 
                        variant="outline" 
                        size="lg"
                        className="flex items-center justify-center gap-2 py-6"
                        onClick={() => tonConnector.connect()}
                      >
                        <img 
                          src="/assets/wallets/openmask-logo.svg" 
                          alt="OpenMask" 
                          className="h-5 w-5"
                        />
                        OpenMask
                      </Button>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <Button 
                      variant="ghost" 
                      onClick={handleSkip}
                    >
                      Continue without connecting
                    </Button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
          
          {/* Right column: Benefits/Info */}
          <motion.div 
            className="hidden lg:block"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-gradient-to-br from-[#6B00D7]/10 to-[#FF5AF7]/10 backdrop-blur-xl rounded-2xl p-8 border border-[#6B00D7]/20">
              <h2 className="text-2xl font-bold mb-6">Why Connect Your TON Wallet?</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-[#6B00D7]/20 flex items-center justify-center flex-shrink-0">
                    <Shield className="h-5 w-5 text-[#6B00D7]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-1">Enhanced Security</h3>
                    <p className="text-muted-foreground">
                      Access our Trinity Protocol: 2-of-3 Chain Security with fixed-role architecture. 
                      Ethereum (Primary Security via Layer 2), Solana (Rapid Validation), and TON (Recovery System) 
                      provide unparalleled protection for your digital assets.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-[#6B00D7]/20 flex items-center justify-center flex-shrink-0">
                    <Timer className="h-5 w-5 text-[#6B00D7]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-1">Time-Lock Features</h3>
                    <p className="text-muted-foreground">
                      Create sophisticated time-locked vaults with lower fees and faster transactions using TON's native capabilities.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-[#6B00D7]/20 flex items-center justify-center flex-shrink-0">
                    <WalletCards className="h-5 w-5 text-[#6B00D7]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-1">Expanded Access</h3>
                    <p className="text-muted-foreground">
                      Unlock premium features, stake CVT tokens, and participate in governance decisions that shape the future of Chronos Vault.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-[#6B00D7]/20 flex items-center justify-center flex-shrink-0">
                    <Lock className="h-5 w-5 text-[#6B00D7]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-1">Non-custodial</h3>
                    <p className="text-muted-foreground">
                      You remain in complete control of your assets at all times. Chronos Vault never takes custody of your funds or private keys.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}