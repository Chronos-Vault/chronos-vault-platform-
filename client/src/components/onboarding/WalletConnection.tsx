import { useState } from 'react';
import { motion } from 'framer-motion';
import { useOnboarding } from '@/contexts/onboarding-context';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

/**
 * WalletConnection component allows users to select and connect a blockchain wallet
 * during the onboarding process. It supports TON, Ethereum and Solana.
 */
const WalletConnection = () => {
  const { completeCurrentStep, skipToEnd } = useOnboarding();
  const [_, navigate] = useLocation();
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  // Simulate wallet connection process
  const connectWallet = async (walletType: string) => {
    setSelectedWallet(walletType);
    setConnecting(true);
    
    // In a real implementation, this would use the wallet connection SDKs
    setTimeout(() => {
      setConnecting(false);
      // Successful connection would store wallet info in context
    }, 1500);
  };

  const wallets = [
    {
      id: 'ton',
      name: 'TON Connect',
      description: 'Connect with TON Wallet, Tonkeeper, etc.',
      icon: '💎'
    },
    {
      id: 'ethereum',
      name: 'Ethereum',
      description: 'Connect with MetaMask, WalletConnect, etc.',
      icon: '🔷'
    },
    {
      id: 'solana',
      name: 'Solana',
      description: 'Connect with Phantom, Solflare, etc.',
      icon: '🟣'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center p-3 sm:p-6 bg-background">
      <div className="max-w-3xl mx-auto w-full px-2 sm:px-0">
        <motion.div
          className="text-center mb-6 sm:mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary mb-4">
            Connect Your Wallet
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose your preferred blockchain wallet to access the Chronos Vault platform
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-10"
        >
          {wallets.map((wallet) => (
            <motion.div key={wallet.id} variants={itemVariants}>
              <Card 
                className={`cursor-pointer transition-all duration-200 h-full hover:shadow-md ${
                  selectedWallet === wallet.id ? 'border-primary ring-1 ring-primary/30' : 'border-border'
                }`}
                onClick={() => connectWallet(wallet.id)}
              >
                <CardHeader className="pb-2">
                  <div className="text-3xl mb-2">{wallet.icon}</div>
                  <CardTitle>{wallet.name}</CardTitle>
                  <CardDescription>{wallet.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedWallet === wallet.id && connecting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin h-5 w-5 rounded-full border-2 border-primary border-t-transparent"></div>
                      <span className="ml-2 text-sm">Connecting...</span>
                    </div>
                  ) : selectedWallet === wallet.id ? (
                    <div className="text-sm text-green-500">Ready to connect</div>
                  ) : null}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="flex flex-col items-center justify-center space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Button
            size="lg"
            className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
            onClick={() => {
              skipToEnd();
              navigate('/');
            }}
          >
            Continue <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          
          <Button
            variant="ghost"
            className="text-sm text-muted-foreground hover:text-foreground"
            onClick={() => {
              skipToEnd();
              navigate('/');
            }}
          >
            Skip for now (Developer Mode)
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default WalletConnection;