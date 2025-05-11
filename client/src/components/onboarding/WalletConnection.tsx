import { useState } from 'react';
import { useOnboarding } from '@/contexts/onboarding-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowRight, Check, Wallet } from 'lucide-react';
import { useDevMode } from '@/contexts/dev-mode-context';

/**
 * The wallet connection step of the onboarding flow
 */
const WalletConnection = () => {
  const { completeCurrentStep } = useOnboarding();
  const { toast } = useToast();
  const { isDevMode } = useDevMode();
  const [connecting, setConnecting] = useState(false);
  
  // Simulate wallet connection or use dev mode to bypass
  const handleConnectWallet = async () => {
    setConnecting(true);
    
    try {
      // In dev mode, we can bypass actual wallet connection
      if (isDevMode) {
        // Simulate connection delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        toast({
          title: "Development mode active",
          description: "Wallet connection has been simulated",
          variant: "default",
        });
        
        completeCurrentStep();
        return;
      }
      
      // For production, would integrate with actual wallet connection logic here
      // This would connect to TON, Ethereum, or other blockchains
      
      // For now, we'll just simulate success after a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Wallet connected",
        description: "Your wallet has been successfully connected",
        variant: "default",
      });
      
      completeCurrentStep();
    } catch (error) {
      toast({
        title: "Connection failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setConnecting(false);
    }
  };
  
  const handleSkip = () => {
    toast({
      title: "Wallet connection skipped",
      description: "You can connect your wallet later from the profile menu",
      variant: "default",
    });
    
    completeCurrentStep();
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-background to-background/80">
      <Card className="w-full max-w-md border border-primary/20 bg-background/80 backdrop-blur-sm shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-foreground">Connect Your Wallet</CardTitle>
          <CardDescription className="text-muted-foreground">
            Connect a blockchain wallet to access the full features of Chronos Vault
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3 p-4 rounded-lg border border-purple-500/20 bg-gradient-to-r from-purple-950/10 to-transparent">
              <div className="bg-purple-500/10 p-2 rounded-full">
                <Wallet className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <h3 className="font-medium">Secure Wallet Connection</h3>
                <p className="text-sm text-muted-foreground">Your private keys never leave your device</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 rounded-lg border border-pink-500/20 bg-gradient-to-r from-pink-950/10 to-transparent">
              <div className="bg-pink-500/10 p-2 rounded-full">
                <Check className="h-6 w-6 text-pink-500" />
              </div>
              <div>
                <h3 className="font-medium">Multi-Chain Support</h3>
                <p className="text-sm text-muted-foreground">Connect to TON, Ethereum, or Solana wallets</p>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="default"
            className="w-full sm:w-auto bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700"
            onClick={handleConnectWallet}
            disabled={connecting}
          >
            {connecting ? "Connecting..." : "Connect Wallet"}
            {!connecting && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
          
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={handleSkip}
            disabled={connecting}
          >
            Connect Later
          </Button>
        </CardFooter>
      </Card>
      
      {isDevMode && (
        <div className="mt-4 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded text-xs text-amber-500">
          Development mode: Wallet connection will be simulated
        </div>
      )}
    </div>
  );
};

export default WalletConnection;