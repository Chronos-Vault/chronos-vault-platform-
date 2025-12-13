import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useMultiChain, BlockchainType } from "@/contexts/multi-chain-context";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Clock, Lock, Unlock, ArrowRight, AlertTriangle, Loader2, CheckCircle2, Shield, ExternalLink, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

interface HTLCVault {
  id: string;
  name: string;
  description: string;
  blockchain: string;
  sourceChain: string;
  destinationChain: string;
  unlockTime: number;
  amount: string;
  destinationAmount: string;
  recipient: string;
  initiator: string;
  isLocked: boolean;
  isClaimed: boolean;
  securityLevel: string;
  createdAt: number;
  contractAddress: string;
  txHash: string;
  claimTxHash: string;
  type: string;
  status: string;
  hashlock: string;
  consensusValidations: number;
  consensusRequired: number;
  validatorSignatures: Record<string, boolean>;
  fees: string;
}

const MyVaults = () => {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const { isAnyWalletConnected, walletInfo, chainStatus } = useMultiChain();
  
  type ActiveBlockchainType = BlockchainType | 'all';
  const [activeBlockchain, setActiveBlockchain] = useState<ActiveBlockchainType>('all');

  const connectedAddress = walletInfo.ethereum?.address || walletInfo.solana?.address || walletInfo.ton?.address || '';

  interface VaultsApiResponse {
    success: boolean;
    data: {
      vaults: HTLCVault[];
      totalCount: number;
      contractAddress: string;
      trinityVerifier: string;
    };
  }

  const { data: vaultsData, isLoading, error, refetch } = useQuery<VaultsApiResponse>({
    queryKey: ['/api/htlc/my-vaults', connectedAddress],
    enabled: true,
  });

  const vaults: HTLCVault[] = vaultsData?.data?.vaults || [];

  const formatTimeRemaining = (unlockTime: number) => {
    const now = Date.now();
    const diff = unlockTime - now;
    
    if (diff <= 0) return "Unlocked";
    
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 365) {
      const years = (days / 365).toFixed(1);
      return `${years} years`;
    } else if (days > 30) {
      const months = Math.floor(days / 30);
      return `${months} months`;
    } else if (days > 0) {
      return `${days} days`;
    } else if (hours > 0) {
      return `${hours} hours`;
    } else {
      return `${minutes} minutes`;
    }
  };

  const formatBlockchainName = (chain: string): string => {
    const chainMap: Record<string, string> = {
      'arbitrum': 'Arbitrum',
      'ethereum': 'Ethereum',
      'solana': 'Solana',
      'ton': 'TON',
    };
    return chainMap[chain?.toLowerCase()] || chain || 'Unknown';
  };

  const formatAddress = (address: string): string => {
    if (!address) return "N/A";
    if (address.length <= 10) return address;
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const getChainSymbol = (chain: string): string => {
    const symbolMap: Record<string, string> = {
      'arbitrum': 'ETH',
      'ethereum': 'ETH',
      'solana': 'SOL',
      'ton': 'TON',
    };
    return symbolMap[chain?.toLowerCase()] || 'CRYPTO';
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'completed':
      case 'claimed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'locked':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'created':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'refunded':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'expired':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getExplorerUrl = (chain: string, txHash: string): string => {
    if (!txHash) return '#';
    switch (chain?.toLowerCase()) {
      case 'arbitrum':
        return `https://sepolia.arbiscan.io/tx/${txHash}`;
      case 'solana':
        return `https://explorer.solana.com/tx/${txHash}?cluster=devnet`;
      case 'ton':
        return `https://testnet.tonviewer.com/transaction/${txHash}`;
      default:
        return '#';
    }
  };

  const filteredVaults = activeBlockchain === 'all' 
    ? vaults 
    : vaults.filter(vault => 
        vault.sourceChain?.toLowerCase() === activeBlockchain.toLowerCase() ||
        vault.destinationChain?.toLowerCase() === activeBlockchain.toLowerCase() ||
        vault.blockchain?.toLowerCase() === activeBlockchain.toLowerCase()
      );

  const handleBlockchainChange = (value: string) => {
    setActiveBlockchain(value as BlockchainType | 'all');
  };

  const viewVaultDetails = (vaultId: string) => {
    setLocation(`/vault/${vaultId}`);
  };

  return (
    <section className="py-16 min-h-screen bg-gradient-to-b from-[#0A0A0A] to-[#121212]">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="font-poppins font-bold text-4xl mb-2 flex items-center gap-3">
                <Shield className="h-10 w-10 text-[#FF5AF7]" />
                My HTLC Vaults
              </h1>
              <p className="text-gray-400">
                Real cross-chain atomic swaps secured by Trinity Protocol™ 2-of-3 consensus
              </p>
            </div>
            <div className="flex gap-3 mt-4 md:mt-0">
              <Button
                variant="outline"
                size="sm"
                className="border-[#6B00D7] text-[#FF5AF7] hover:bg-[#6B00D7]/10"
                onClick={() => refetch()}
                data-testid="button-refresh-vaults"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button
                variant="outline"
                className="border-[#6B00D7] text-[#FF5AF7] hover:bg-[#6B00D7]/10"
                onClick={() => setLocation("/monitoring")}
                data-testid="button-trinity-scan"
              >
                Trinity Scan
              </Button>
              <Button
                className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#5500AB] hover:to-[#FF46E8] text-white"
                onClick={() => setLocation("/bridge")}
                data-testid="button-new-swap"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                New Swap
              </Button>
            </div>
          </div>

          <Card className="bg-[#1A1A1A]/80 border-[#6B00D7]/30 mb-6">
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{vaults.length}</div>
                    <div className="text-xs text-gray-400">Total Swaps</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">
                      {vaults.filter(v => v.status === 'claimed' || v.status === 'completed').length}
                    </div>
                    <div className="text-xs text-gray-400">Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">
                      {vaults.filter(v => v.status === 'locked').length}
                    </div>
                    <div className="text-xs text-gray-400">Locked</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">
                      {vaults.filter(v => v.status === 'created').length}
                    </div>
                    <div className="text-xs text-gray-400">Pending</div>
                  </div>
                </div>
                <div className="text-sm text-gray-400">
                  Contract: <span className="text-[#FF5AF7] font-mono">{formatAddress(vaultsData?.data?.contractAddress || '')}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Tabs defaultValue="all" onValueChange={handleBlockchainChange} className="mb-6">
            <TabsList className="bg-[#1A1A1A]">
              <TabsTrigger value="all" data-testid="tab-all-chains">All Chains</TabsTrigger>
              <TabsTrigger value="arbitrum" data-testid="tab-arbitrum">Arbitrum</TabsTrigger>
              <TabsTrigger value="solana" data-testid="tab-solana">Solana</TabsTrigger>
              <TabsTrigger value="ton" data-testid="tab-ton">TON</TabsTrigger>
            </TabsList>
          </Tabs>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-12 w-12 animate-spin text-[#6B00D7]" />
              <span className="ml-4 text-gray-400">Loading real HTLC swaps...</span>
            </div>
          ) : error ? (
            <Card className="bg-[#1A1A1A] border-red-500/30 mb-8">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <AlertTriangle className="h-10 w-10 text-red-400" />
                  <div>
                    <h3 className="text-xl font-semibold text-white">Error loading vaults</h3>
                    <p className="text-gray-400 mt-1">Could not fetch HTLC swaps from the blockchain</p>
                  </div>
                </div>
                <Button 
                  className="mt-4 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]"
                  onClick={() => refetch()}
                >
                  Retry
                </Button>
              </CardContent>
            </Card>
          ) : filteredVaults.length === 0 ? (
            <Card className="bg-[#1A1A1A] border-[#6B00D7]/30 mb-8">
              <CardContent className="p-10 text-center">
                <Shield className="h-16 w-16 mx-auto mb-4 text-[#6B00D7]/50" />
                <h3 className="text-xl font-semibold text-white mb-2">No HTLC swaps found</h3>
                <p className="text-gray-400 mb-6">
                  {activeBlockchain === 'all' 
                    ? 'Start your first cross-chain atomic swap with Trinity Protocol' 
                    : `No swaps involving ${formatBlockchainName(activeBlockchain)} yet`}
                </p>
                <Button 
                  className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]"
                  onClick={() => setLocation("/bridge")}
                  data-testid="button-create-first-swap"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create Your First Swap
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVaults.map((vault) => (
                <Card 
                  key={vault.id} 
                  className="bg-[#1A1A1A] border-[#6B00D7]/30 hover:border-[#FF5AF7]/50 transition-all overflow-hidden"
                  data-testid={`card-vault-${vault.id}`}
                >
                  <div className={`h-2 w-full ${
                    vault.status === 'claimed' || vault.status === 'completed' ? 'bg-green-500' :
                    vault.status === 'locked' ? 'bg-purple-500' :
                    vault.status === 'created' ? 'bg-blue-500' :
                    'bg-gray-500'
                  }`}></div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="font-poppins text-lg flex items-center gap-2">
                          <span className="text-sm">{formatBlockchainName(vault.sourceChain)}</span>
                          <ArrowRight className="h-4 w-4 text-[#FF5AF7]" />
                          <span className="text-sm">{formatBlockchainName(vault.destinationChain)}</span>
                        </CardTitle>
                        <CardDescription className="mt-1 text-xs">
                          {vault.description}
                        </CardDescription>
                      </div>
                      <Badge className={`${getStatusColor(vault.status)} border text-xs`}>
                        {vault.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-2">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-xs">Amount</span>
                        <span className="text-white text-sm font-medium">
                          {vault.amount} {getChainSymbol(vault.sourceChain)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-xs">Trinity Consensus</span>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3].map((i) => (
                            <div
                              key={i}
                              className={`w-3 h-3 rounded-full ${
                                i <= vault.consensusValidations 
                                  ? 'bg-green-500' 
                                  : 'bg-gray-600'
                              }`}
                            />
                          ))}
                          <span className="text-xs text-gray-400 ml-1">
                            {vault.consensusValidations}/3
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-xs">Timelock</span>
                        <span className="text-white text-xs font-medium flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTimeRemaining(vault.unlockTime)}
                        </span>
                      </div>
                      
                      {vault.txHash && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-xs">Source Tx</span>
                          <a 
                            href={getExplorerUrl(vault.sourceChain, vault.txHash)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#FF5AF7] text-xs font-mono hover:underline flex items-center gap-1"
                          >
                            {formatAddress(vault.txHash)}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-xs">Created</span>
                        <span className="text-white text-xs">
                          {new Date(vault.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex justify-between pt-2 gap-2">
                    {vault.txHash && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-[#FF5AF7] hover:bg-[#6B00D7]/10 text-xs"
                        onClick={() => window.open(getExplorerUrl(vault.sourceChain, vault.txHash), '_blank')}
                        data-testid={`button-view-explorer-${vault.id}`}
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Explorer
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-[#6B00D7] text-[#FF5AF7] hover:bg-[#6B00D7]/10 text-xs ml-auto"
                      onClick={() => viewVaultDetails(vault.id)}
                      data-testid={`button-details-${vault.id}`}
                    >
                      Details
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}

          <Card className="bg-[#1A1A1A]/50 border-[#6B00D7]/20 mt-8">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <Shield className="h-5 w-5 text-[#FF5AF7]" />
                <span>
                  All swaps are secured by <strong className="text-white">Trinity Protocol™</strong> 2-of-3 validator consensus 
                  across Arbitrum, Solana, and TON networks.
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default MyVaults;
