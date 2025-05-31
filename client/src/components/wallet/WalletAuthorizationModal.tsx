import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Lock, Key, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WalletAuthorizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: {
    name: string;
    icon: string;
    provider: any;
    blockchain: string;
  } | null;
  onAuthorized: (walletType: string, address: string) => void;
}

export function WalletAuthorizationModal({ 
  isOpen, 
  onClose, 
  wallet, 
  onAuthorized 
}: WalletAuthorizationModalProps) {
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);
  const [step, setStep] = useState<'authorize' | 'connecting' | 'success'>('authorize');

  const handleAuthorize = async () => {
    if (!wallet) return;

    setIsConnecting(true);
    setStep('connecting');

    try {
      let address = '';
      let walletType = '';

      if (wallet.name === 'MetaMask' && wallet.provider) {
        const accounts = await wallet.provider.request({
          method: 'eth_requestAccounts'
        });
        address = accounts[0];
        walletType = 'metamask';

        const chainId = await wallet.provider.request({
          method: 'eth_chainId'
        });

        await fetch('/api/vault/authorize-wallet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            address,
            walletType,
            blockchain: 'ethereum',
            chainId
          })
        });

      } else if (wallet.name === 'Phantom' && wallet.provider) {
        const response = await wallet.provider.connect();
        address = response.publicKey.toString();
        walletType = 'phantom';

        await fetch('/api/vault/authorize-wallet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            address,
            walletType,
            blockchain: 'solana',
            publicKey: address
          })
        });

      } else if (wallet.name === 'TON Keeper' && wallet.provider) {
        if (typeof wallet.provider.send === 'function') {
          const result = await wallet.provider.send('ton_requestAccounts');
          address = result.accounts[0];
        } else {
          const tonConnect = wallet.provider;
          await tonConnect.connect();
          const walletInfo = tonConnect.wallet;
          address = walletInfo?.account?.address || '';
        }
        walletType = 'tonkeeper';

        await fetch('/api/vault/authorize-wallet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            address,
            walletType,
            blockchain: 'ton'
          })
        });
      }

      if (address) {
        setStep('success');
        setTimeout(() => {
          onAuthorized(walletType, address);
          onClose();
          toast({
            title: "Wallet Authorized",
            description: `${wallet.name} successfully connected to Chronos Vault`,
            variant: "default"
          });
        }, 1500);
      }

    } catch (error) {
      console.error('Authorization error:', error);
      toast({
        title: "Authorization Failed",
        description: `Failed to authorize ${wallet?.name}. Please try again.`,
        variant: "destructive"
      });
      setStep('authorize');
      setIsConnecting(false);
    }
  };

  const handleCancel = () => {
    setStep('authorize');
    setIsConnecting(false);
    onClose();
  };

  if (!wallet) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Authorize Wallet for Chronos Vault
          </DialogTitle>
          <DialogDescription>
            Connect your {wallet.name} wallet to access Chronos Vault's security features
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Wallet Info */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{wallet.icon}</span>
                <div>
                  <h3 className="font-semibold">{wallet.name}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {wallet.blockchain.toUpperCase()} Network
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Authorization Steps */}
          {step === 'authorize' && (
            <div className="space-y-4">
              <h4 className="font-medium">What you're authorizing:</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Key className="h-4 w-4 text-green-600 mt-0.5" />
                  <div className="text-sm">
                    <div className="font-medium">Wallet Connection</div>
                    <div className="text-gray-600">Access your wallet address for vault creation</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Lock className="h-4 w-4 text-green-600 mt-0.5" />
                  <div className="text-sm">
                    <div className="font-medium">Security Verification</div>
                    <div className="text-gray-600">Verify wallet ownership for enhanced security</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="h-4 w-4 text-green-600 mt-0.5" />
                  <div className="text-sm">
                    <div className="font-medium">Vault Management</div>
                    <div className="text-gray-600">Enable secure vault creation and management</div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-sm text-blue-800">
                  <strong>Privacy Notice:</strong> Chronos Vault only accesses your wallet address. 
                  We never access your private keys or funds.
                </div>
              </div>
            </div>
          )}

          {step === 'connecting' && (
            <div className="text-center py-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h4 className="font-medium">Connecting to {wallet.name}</h4>
              <p className="text-sm text-gray-600 mt-2">
                Please approve the connection request in your wallet
              </p>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-6">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h4 className="font-medium text-green-800">Authorization Successful!</h4>
              <p className="text-sm text-gray-600 mt-2">
                Your {wallet.name} wallet is now connected to Chronos Vault
              </p>
            </div>
          )}

          {/* Action Buttons */}
          {step === 'authorize' && (
            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={handleCancel}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleAuthorize}
                disabled={isConnecting}
                className="flex-1"
              >
                <Shield className="h-4 w-4 mr-2" />
                Authorize Wallet
              </Button>
            </div>
          )}

          {step === 'connecting' && (
            <div className="pt-4">
              <Button 
                variant="outline" 
                onClick={handleCancel}
                className="w-full"
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}