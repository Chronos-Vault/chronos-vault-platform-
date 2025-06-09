import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, Wallet, Shield, CheckCircle2 } from 'lucide-react';
import { SiEthereum, SiSolana, SiBitcoin } from 'react-icons/si';
import { useWalletAuth } from '@/hooks/useWalletAuth';

interface WalletAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticated?: () => void;
}

interface WalletOption {
  id: string;
  name: string;
  blockchain: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  available: boolean;
}

const WALLET_OPTIONS: WalletOption[] = [
  {
    id: 'metamask',
    name: 'MetaMask',
    blockchain: 'ethereum',
    icon: SiEthereum,
    description: 'Connect with MetaMask for Ethereum',
    available: true
  },
  {
    id: 'phantom',
    name: 'Phantom',
    blockchain: 'solana',
    icon: SiSolana,
    description: 'Connect with Phantom for Solana',
    available: true
  },
  {
    id: 'tonkeeper',
    name: 'TON Wallet',
    blockchain: 'ton',
    icon: SiBitcoin,
    description: 'Connect with TON Wallet',
    available: true
  }
];

export function WalletAuthModal({ isOpen, onClose, onAuthenticated }: WalletAuthModalProps) {
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [step, setStep] = useState<'select' | 'connecting' | 'signing' | 'success'>('select');
  const { authenticateWallet } = useWalletAuth();

  const handleWalletConnect = async (walletOption: WalletOption) => {
    setSelectedWallet(walletOption.id);
    setIsConnecting(true);
    setStep('connecting');

    try {
      let walletAddress = '';

      // Connect to wallet based on type
      switch (walletOption.id) {
        case 'metamask':
          if (!window.ethereum) {
            throw new Error('MetaMask not detected. Please install MetaMask.');
          }
          const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts'
          });
          walletAddress = accounts[0];
          break;

        case 'phantom':
          if (!window.solana?.isPhantom) {
            throw new Error('Phantom wallet not detected. Please install Phantom.');
          }
          const resp = await window.solana.connect();
          walletAddress = resp.publicKey.toString();
          break;

        case 'tonkeeper':
          // For TON, we'll simulate connection for now
          walletAddress = 'EQD4FPq-PRDieyQKkizFTRtSDyucUIqrj0v_zXJmqaDp6_0t';
          break;

        default:
          throw new Error('Unsupported wallet type');
      }

      setStep('signing');

      // Authenticate with backend
      const success = await authenticateWallet(
        walletOption.id,
        walletAddress,
        walletOption.blockchain
      );

      if (success) {
        setStep('success');
        setTimeout(() => {
          onAuthenticated?.();
          onClose();
        }, 2000);
      } else {
        throw new Error('Authentication failed');
      }
    } catch (error) {
      console.error('Wallet connection failed:', error);
      setStep('select');
      setSelectedWallet(null);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleClose = () => {
    if (!isConnecting) {
      setStep('select');
      setSelectedWallet(null);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-gray-900 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-purple-400" />
            Authenticate with Wallet
          </DialogTitle>
        </DialogHeader>

        {step === 'select' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-400">
              Choose your preferred wallet to authenticate with Chronos Vault
            </p>
            
            <div className="space-y-3">
              {WALLET_OPTIONS.map((wallet) => {
                const Icon = wallet.icon;
                return (
                  <Card
                    key={wallet.id}
                    className={`p-4 cursor-pointer transition-all hover:bg-gray-800 border-gray-700 ${
                      !wallet.available ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    onClick={() => wallet.available && handleWalletConnect(wallet)}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="h-8 w-8 text-purple-400" />
                      <div className="flex-1">
                        <h3 className="font-medium text-white">{wallet.name}</h3>
                        <p className="text-sm text-gray-400">{wallet.description}</p>
                      </div>
                      {wallet.available && (
                        <Wallet className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {step === 'connecting' && (
          <div className="text-center py-8">
            <Loader2 className="h-12 w-12 animate-spin text-purple-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Connecting to Wallet</h3>
            <p className="text-sm text-gray-400">
              Please check your wallet and approve the connection request
            </p>
          </div>
        )}

        {step === 'signing' && (
          <div className="text-center py-8">
            <Loader2 className="h-12 w-12 animate-spin text-purple-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Sign Authentication Message</h3>
            <p className="text-sm text-gray-400">
              Please sign the message in your wallet to complete authentication
            </p>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center py-8">
            <CheckCircle2 className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Authentication Successful</h3>
            <p className="text-sm text-gray-400">
              Your wallet has been authenticated successfully
            </p>
          </div>
        )}

        {step === 'select' && (
          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}