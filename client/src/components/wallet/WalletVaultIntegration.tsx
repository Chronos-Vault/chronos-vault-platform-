import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Wallet, Shield, ArrowRight } from 'lucide-react';

interface ConnectedWallet {
  type: string;
  address: string;
  chain: string;
  balance?: string;
}

interface WalletVaultIntegrationProps {
  connectedWallets: ConnectedWallet[];
  onCreateVault: (walletAddress: string, chain: string) => void;
}

export function WalletVaultIntegration({ connectedWallets, onCreateVault }: WalletVaultIntegrationProps) {
  const { toast } = useToast();
  const [selectedWallet, setSelectedWallet] = useState<ConnectedWallet | null>(null);

  const handleAddToVault = async (wallet: ConnectedWallet) => {
    try {
      // Add wallet tokens to Chronos Vault system
      const response = await fetch('/api/vault/add-wallet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: wallet.address,
          chain: wallet.chain,
          walletType: wallet.type
        }),
      });

      if (response.ok) {
        toast({
          title: "Wallet Added to Vault",
          description: `${wallet.chain} wallet successfully integrated with Chronos Vault`,
        });
        setSelectedWallet(wallet);
      } else {
        throw new Error('Failed to add wallet to vault');
      }
    } catch (error) {
      toast({
        title: "Integration Failed",
        description: "Unable to add wallet to vault system",
        variant: "destructive",
      });
    }
  };

  const getChainColor = (chain: string) => {
    switch (chain.toLowerCase()) {
      case 'ethereum': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'solana': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'ton': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  if (connectedWallets.length === 0) {
    return (
      <Card className="bg-gray-900/50 border-gray-700">
        <CardHeader className="text-center">
          <Wallet className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <CardTitle className="text-white">No Wallets Connected</CardTitle>
          <CardDescription>
            Connect your wallets to add tokens to Chronos Vault
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-white mb-2">Connected Wallets</h3>
        <p className="text-gray-400">Add your wallet tokens to Chronos Vault to start creating secure vaults</p>
      </div>

      <div className="grid gap-4">
        {connectedWallets.map((wallet, index) => (
          <Card key={index} className="bg-gray-900/50 border-gray-700 hover:border-purple-500/50 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-white capitalize">{wallet.type}</p>
                      <Badge className={getChainColor(wallet.chain)}>
                        {wallet.chain}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-400">
                      {wallet.address.slice(0, 8)}...{wallet.address.slice(-6)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    onClick={() => handleAddToVault(wallet)}
                    className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add to Vault
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onCreateVault(wallet.address, wallet.chain)}
                    className="border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    <Shield className="w-4 h-4 mr-1" />
                    Create Vault
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedWallet && (
        <Card className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-purple-500/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Shield className="w-8 h-8 text-purple-400" />
                <div>
                  <p className="font-medium text-white">Wallet Integrated</p>
                  <p className="text-sm text-purple-300">
                    Ready to create secure vaults with {selectedWallet.chain} tokens
                  </p>
                </div>
              </div>
              <Button
                onClick={() => onCreateVault(selectedWallet.address, selectedWallet.chain)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                Create Vault Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}