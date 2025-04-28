import React, { useState } from 'react';
import { useEthereum } from '@/contexts/ethereum-context';
import { useSolana } from '@/contexts/solana-context';
import { useTon } from '@/contexts/ton-context';
import { useMultiChain, BlockchainType } from '@/contexts/multi-chain-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Check, ChevronRight, Wallet } from 'lucide-react';
import { SiEthereum, SiSolana, SiTon } from 'react-icons/si';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function UnifiedWalletConnector() {
  const [activeTab, setActiveTab] = useState<string>("ethereum");
  const { currentChain, setCurrentChain } = useMultiChain();
  const { isConnected: isEthConnected, connectionStatus: ethStatus, connect: connectEth, disconnect: disconnectEth, walletInfo: ethInfo } = useEthereum();
  const { isConnected: isSolConnected, connect: connectSol, disconnect: disconnectSol, walletInfo: solInfo } = useSolana();
  const { isConnected: isTonConnected, connect: connectTon, disconnect: disconnectTon, walletInfo: tonInfo } = useTon();

  const handleTabChange = (value: string) => {
    setActiveTab(value);

    // Update the current blockchain in the multi-chain context
    if (value === 'ethereum') {
      setCurrentChain(BlockchainType.ETHEREUM);
    } else if (value === 'solana') {
      setCurrentChain(BlockchainType.SOLANA);
    } else if (value === 'ton') {
      setCurrentChain(BlockchainType.TON);
    }
  };

  const handleConnect = async () => {
    if (activeTab === 'ethereum') {
      await connectEth();
    } else if (activeTab === 'solana') {
      await connectSol();
    } else if (activeTab === 'ton') {
      await connectTon();
    }
  };

  const handleDisconnect = async () => {
    if (activeTab === 'ethereum') {
      await disconnectEth();
    } else if (activeTab === 'solana') {
      await disconnectSol();
    } else if (activeTab === 'ton') {
      await disconnectTon();
    }
  };

  const isConnected = () => {
    if (activeTab === 'ethereum') return isEthConnected;
    if (activeTab === 'solana') return isSolConnected;
    if (activeTab === 'ton') return isTonConnected;
    return false;
  };

  const getWalletInfo = () => {
    if (activeTab === 'ethereum') return ethInfo;
    if (activeTab === 'solana') return solInfo;
    if (activeTab === 'ton') return tonInfo;
    return null;
  };

  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const getWalletIcon = () => {
    if (activeTab === 'ethereum') return <SiEthereum className="h-6 w-6 text-purple-500" />;
    if (activeTab === 'solana') return <SiSolana className="h-6 w-6 text-purple-500" />;
    if (activeTab === 'ton') return <SiTon className="h-6 w-6 text-purple-500" />;
    return <Wallet className="h-6 w-6 text-purple-500" />;
  };

  const walletInfo = getWalletInfo();

  return (
    <Card className="w-full bg-white/5 backdrop-blur-sm border-purple-500/10">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Wallet className="h-5 w-5" /> Cross-Chain Wallet
        </CardTitle>
        <CardDescription>
          Connect to your preferred blockchain wallet
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="ethereum" value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="grid grid-cols-3 w-full bg-white/5">
            <TabsTrigger value="ethereum" className="data-[state=active]:bg-purple-500/20">
              <div className="flex items-center gap-2">
                <SiEthereum />
                <span className="hidden sm:inline">Ethereum</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="solana" className="data-[state=active]:bg-purple-500/20">
              <div className="flex items-center gap-2">
                <SiSolana />
                <span className="hidden sm:inline">Solana</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="ton" className="data-[state=active]:bg-purple-500/20">
              <div className="flex items-center gap-2">
                <SiTon />
                <span className="hidden sm:inline">TON</span>
              </div>
            </TabsTrigger>
          </TabsList>

          <div className="mt-4">
            {isConnected() ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                  {getWalletIcon()}
                  <div className="flex-1">
                    <div className="font-medium flex items-center gap-2">
                      {formatAddress(walletInfo?.address || '')}
                      <Check size={16} className="text-green-500" />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Balance: {walletInfo?.balance || '0'} {activeTab === 'ethereum' ? 'ETH' : activeTab === 'solana' ? 'SOL' : 'TON'}
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={handleDisconnect}
                    className="border-purple-500/50 hover:bg-purple-500/20"
                  >
                    Disconnect
                  </Button>
                </div>

                {activeTab === 'ethereum' && ethInfo?.network && (
                  <div className="text-sm rounded-lg p-2 bg-white/5">
                    Network: {ethInfo.network}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {activeTab === 'ethereum' && ethStatus === 'error' && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Connection Error</AlertTitle>
                    <AlertDescription>
                      MetaMask not detected. Please install MetaMask to connect to Ethereum.
                    </AlertDescription>
                  </Alert>
                )}
                
                <Button 
                  onClick={handleConnect} 
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
                >
                  <div className="flex items-center gap-2">
                    {getWalletIcon()}
                    <span>Connect {activeTab === 'ethereum' ? 'MetaMask' : activeTab === 'solana' ? 'Phantom' : 'TON Wallet'}</span>
                    <ChevronRight size={16} />
                  </div>
                </Button>
              </div>
            )}
          </div>
        </Tabs>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        Your keys, your crypto. Chronos Vault never stores your private keys.
      </CardFooter>
    </Card>
  );
}