import { useState } from 'react';
import { motion } from 'framer-motion';
import { useOnboarding } from '@/contexts/onboarding-context';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowRight, Diamond, Hexagon, Circle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { TonkeeperIcon, TonhubIcon, OpenMaskIcon, MyTonWalletIcon } from '@/components/wallet/ton-wallet-icons';
import TonWalletConnector, { TonWalletInfo } from '@/components/wallet/TonWalletConnector';
import { useToast } from '@/hooks/use-toast';

/**
 * WalletConnection component allows users to select and connect a blockchain wallet
 * during the onboarding process. It supports TON, Ethereum and Solana.
 */
const WalletConnection = () => {
  const { completeCurrentStep, skipToEnd } = useOnboarding();
  const [_, navigate] = useLocation();
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [showTonWalletSelector, setShowTonWalletSelector] = useState(false);
  const [connectedWallets, setConnectedWallets] = useState<Record<string, any>>({});
  const { toast } = useToast();

  // Handle wallet connection
  const connectWallet = async (walletType: string) => {
    if (walletType === 'ton') {
      // Open TON wallet selector instead of directly connecting
      setSelectedWallet(walletType);
      setShowTonWalletSelector(true);
      return;
    }
    
    // Standard connection flow for other wallet types
    setSelectedWallet(walletType);
    setConnecting(true);
    
    // In a real implementation, this would use the wallet connection SDKs
    setTimeout(() => {
      setConnecting(false);
      
      // Successfully connected
      setConnectedWallets({
        ...connectedWallets,
        [walletType]: {
          address: walletType === 'ethereum' 
            ? '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
            : walletType === 'solana'
            ? '9kcaMKQZTeELZvhiGPJYLTCrNyQrbbrV6ys8BqhWB2XK'
            : '',
          balance: walletType === 'ethereum' 
            ? '2.5 ETH' 
            : walletType === 'solana'
            ? '15.2 SOL'
            : ''
        }
      });
      
      toast({
        title: 'Wallet Connected',
        description: `Successfully connected your ${walletType.charAt(0).toUpperCase() + walletType.slice(1)} wallet`,
      });
    }, 1500);
  };

  // Handle TON wallet connection result
  const handleTonWalletConnected = (walletInfo: TonWalletInfo) => {
    setConnectedWallets({
      ...connectedWallets,
      ton: walletInfo
    });
  };

  const wallets = [
    {
      id: 'ton',
      name: 'TON Wallet',
      description: 'Connect with Tonkeeper, TON Hub, OpenMask, etc.',
      icon: <Diamond className="h-12 w-12 text-[#0088CC]" />,
      customIcon: <div className="flex space-x-1 mt-2">
        <TonkeeperIcon />
        <TonhubIcon />
        <OpenMaskIcon />
      </div>
    },
    {
      id: 'ethereum',
      name: 'Ethereum',
      description: 'Connect with MetaMask, WalletConnect, etc.',
      icon: <Hexagon className="h-12 w-12 text-[#627EEA]" />
    },
    {
      id: 'solana',
      name: 'Solana',
      description: 'Connect with Phantom, Solflare, etc.',
      icon: <Circle className="h-12 w-12 text-[#9945FF]" />
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
                  connectedWallets[wallet.id] ? 'border-green-500 ring-1 ring-green-500/30' :
                  selectedWallet === wallet.id ? 'border-primary ring-1 ring-primary/30' : 'border-border'
                }`}
                onClick={() => !connectedWallets[wallet.id] && !connecting && connectWallet(wallet.id)}
              >
                <CardHeader className="pb-2">
                  <div className="mb-2 flex justify-center">{wallet.icon}</div>
                  <CardTitle>{wallet.name}</CardTitle>
                  <CardDescription>{wallet.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {wallet.customIcon && (
                    <div className="flex justify-center mb-3">
                      {wallet.customIcon}
                    </div>
                  )}
                  
                  {selectedWallet === wallet.id && connecting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin h-5 w-5 rounded-full border-2 border-primary border-t-transparent"></div>
                      <span className="ml-2 text-sm">Connecting...</span>
                    </div>
                  ) : connectedWallets[wallet.id] ? (
                    <div className="text-sm text-green-500 flex flex-col items-center">
                      <span>Connected</span>
                      <span className="text-xs text-muted-foreground mt-1">
                        {wallet.id === 'ton' 
                          ? connectedWallets[wallet.id].address.slice(0, 6) + '...' + connectedWallets[wallet.id].address.slice(-4)
                          : connectedWallets[wallet.id].address.slice(0, 6) + '...' + connectedWallets[wallet.id].address.slice(-4)
                        }
                      </span>
                    </div>
                  ) : selectedWallet === wallet.id ? (
                    <div className="text-sm text-primary">Ready to connect</div>
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

      {/* TON Wallet Connector Dialog */}
      <TonWalletConnector
        isOpen={showTonWalletSelector}
        onClose={() => {
          setShowTonWalletSelector(false);
          if (!connectedWallets['ton']) {
            setSelectedWallet(null);
          }
        }}
        onWalletConnected={handleTonWalletConnected}
      />
    </div>
  );
};

export default WalletConnection;