import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useMultiChain, BlockchainType } from '@/contexts/multi-chain-context';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoIcon, WalletIcon, PlusIcon, PowerIcon } from 'lucide-react';
import { SiEthereum, SiSolana, SiTelegram } from 'react-icons/si';
import { useToast } from '@/hooks/use-toast';

export function UnifiedWalletConnector() {
  const { chainStatus, currentChain, setCurrentChain, connectChain, disconnectChain } = useMultiChain();
  const [connecting, setConnecting] = useState(false);
  const { toast } = useToast();

  const handleConnect = async (chain: BlockchainType) => {
    setConnecting(true);
    
    try {
      // Set the current chain and then connect
      setCurrentChain(chain);
      const success = await connectChain(chain);
      
      if (success) {
        toast({
          title: 'Connected',
          description: `Successfully connected to your ${chain.toUpperCase()} wallet`,
        });
      } else {
        toast({
          title: 'Connection Failed',
          description: `Failed to connect to your ${chain.toUpperCase()} wallet`,
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast({
        title: 'Connection Error',
        description: 'An unexpected error occurred while connecting your wallet',
        variant: 'destructive',
      });
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = async (chain: BlockchainType) => {
    try {
      await disconnectChain(chain);
      toast({
        title: 'Disconnected',
        description: `Successfully disconnected from your ${chain.toUpperCase()} wallet`,
      });
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      toast({
        title: 'Disconnection Error',
        description: 'An unexpected error occurred while disconnecting your wallet',
        variant: 'destructive',
      });
    }
  };

  const getChainIcon = (chain: BlockchainType) => {
    switch (chain) {
      case BlockchainType.ETHEREUM:
        return <SiEthereum className="h-6 w-6 text-blue-400" />;
      case BlockchainType.SOLANA:
        return <SiSolana className="h-6 w-6 text-purple-400" />;
      case BlockchainType.TON:
        return <SiTelegram className="h-6 w-6 text-cyan-400" />;
      default:
        return null;
    }
  };

  const formatBalance = (chain: BlockchainType, balance: string | null) => {
    if (!balance) return '0.00';
    
    // Simple formatting, would be enhanced for production
    const numBalance = parseFloat(balance);
    return numBalance.toFixed(4);
  };
  
  const formatCurrency = (chain: BlockchainType) => {
    switch (chain) {
      case BlockchainType.ETHEREUM:
        return 'ETH';
      case BlockchainType.SOLANA:
        return 'SOL';
      case BlockchainType.TON:
        return 'TON';
      default:
        return '';
    }
  };

  return (
    <Card className="bg-white/5 backdrop-blur-sm border-purple-500/10">
      <CardHeader>
        <CardTitle>Cross-Chain Wallets</CardTitle>
        <CardDescription>
          Connect and manage wallets across multiple blockchains
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={currentChain} onValueChange={(value) => setCurrentChain(value as BlockchainType)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value={BlockchainType.ETHEREUM}>Ethereum</TabsTrigger>
            <TabsTrigger value={BlockchainType.SOLANA}>Solana</TabsTrigger>
            <TabsTrigger value={BlockchainType.TON}>TON</TabsTrigger>
          </TabsList>
          
          {Object.values(BlockchainType).filter(chain => 
            chain !== BlockchainType.BITCOIN // Filter out chains we're not implementing yet
          ).map((chain) => (
            <TabsContent key={chain} value={chain} className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getChainIcon(chain as BlockchainType)}
                  <h3 className="text-lg font-medium">{chain.toUpperCase()}</h3>
                </div>
                
                {chainStatus[chain as BlockchainType].isConnected ? (
                  <Button
                    variant="outline"
                    className="border-red-500/30 hover:bg-red-500/10 hover:text-red-400 text-red-500"
                    onClick={() => handleDisconnect(chain as BlockchainType)}
                  >
                    <PowerIcon className="h-4 w-4 mr-2" />
                    Disconnect
                  </Button>
                ) : (
                  <Button
                    className="bg-gradient-to-r from-[#6B00D7] to-[#C570FF] hover:from-[#5A00B8] hover:to-[#B14DFF]"
                    onClick={() => handleConnect(chain as BlockchainType)}
                    disabled={connecting}
                  >
                    <WalletIcon className="h-4 w-4 mr-2" />
                    {connecting && currentChain === chain ? 'Connecting...' : 'Connect'}
                  </Button>
                )}
              </div>
              
              {chainStatus[chain as BlockchainType].isConnected ? (
                <div className="rounded-md border border-violet-500/20 p-4 bg-violet-950/10">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Address</span>
                      <span className="text-sm font-medium">{chainStatus[chain as BlockchainType].address}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Balance</span>
                      <span className="text-sm font-medium">
                        {formatBalance(chain as BlockchainType, chainStatus[chain as BlockchainType].balance)}{' '}
                        {formatCurrency(chain as BlockchainType)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Network</span>
                      <span className="text-sm font-medium">
                        {chainStatus[chain as BlockchainType].network || 'Unknown'}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <Alert className="bg-violet-950/20 border border-violet-500/20">
                  <InfoIcon className="h-4 w-4 text-violet-400" />
                  <AlertDescription className="text-violet-200">
                    Connect your {chain.toUpperCase()} wallet to create and manage vaults.
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}