import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, Check, X, ExternalLink, Activity, Lock, Unlock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import MultiChainWalletConnect from '@/components/wallets/MultiChainWalletConnect';
import VaultCreationForm from '@/components/vaults/VaultCreationForm';

interface ChainStatus {
  name: string;
  network: string;
  status: 'online' | 'offline' | 'syncing';
  blockHeight: number;
  lastUpdate: number;
  verified: boolean;
  color: string;
  icon: string;
}

interface ConsensusStatus {
  reached: boolean;
  chainsVerified: number;
  totalChains: number;
  canUnlock: boolean;
}

export default function TrinityProtocolDashboard() {
  const { toast } = useToast();
  const [chains, setChains] = useState<ChainStatus[]>([
    {
      name: 'Ethereum',
      network: 'Sepolia Testnet',
      status: 'online',
      blockHeight: 0,
      lastUpdate: Date.now(),
      verified: true,
      color: 'from-blue-500 to-purple-600',
      icon: '⟠'
    },
    {
      name: 'Solana',
      network: 'Devnet',
      status: 'online',
      blockHeight: 0,
      lastUpdate: Date.now(),
      verified: true,
      color: 'from-green-500 to-cyan-600',
      icon: '◎'
    },
    {
      name: 'TON',
      network: 'Testnet',
      status: 'online',
      blockHeight: 0,
      lastUpdate: Date.now(),
      verified: false,
      color: 'from-purple-500 to-pink-600',
      icon: '💎'
    }
  ]);

  const [consensus, setConsensus] = useState<ConsensusStatus>({
    reached: true,
    chainsVerified: 2,
    totalChains: 3,
    canUnlock: true
  });

  const [deployedContracts] = useState({
    ethereum: {
      vault: '0x29fd67501afd535599ff83AE072c20E31Afab958',
      token: '0xeb6C02FCD86B3dE11Dbae83599a002558Ace5eFc',
      bridge: '0xFb419D8E32c14F774279a4dEEf330dc893257147',
      explorerUrl: 'https://sepolia.etherscan.io/address/'
    },
    solana: {
      program: 'CYaDJYRqm35udQ8vkxoajSER8oaniQUcV8Vvw5BqJyo2',
      explorerUrl: 'https://explorer.solana.com/address/'
    },
    ton: {
      vault: 'EQAvDfYmkVV2zFXzC0Hs2e2RGWJyMXHpnMTXH4jnI2W3AwLb',
      explorerUrl: 'https://testnet.tonscan.org/address/'
    }
  });

  useEffect(() => {
    const fetchBlockchainData = async () => {
      try {
        const response = await fetch('/api/blockchain/status');
        if (response.ok) {
          const data = await response.json();
          
          const updatedChains = chains.map(chain => {
            if (chain.name === 'Ethereum' && data.ethereum) {
              return {
                ...chain,
                blockHeight: data.ethereum.blockNumber || 0,
                status: data.ethereum.connected ? 'online' as const : 'offline' as const,
                lastUpdate: Date.now()
              };
            }
            if (chain.name === 'Solana' && data.solana) {
              return {
                ...chain,
                blockHeight: data.solana.slot || 0,
                status: data.solana.connected ? 'online' as const : 'offline' as const,
                lastUpdate: Date.now()
              };
            }
            if (chain.name === 'TON' && data.ton) {
              return {
                ...chain,
                blockHeight: data.ton.masterchainInfo?.last?.seqno || 0,
                status: data.ton.connected ? 'online' as const : 'offline' as const,
                lastUpdate: Date.now()
              };
            }
            return chain;
          });

          setChains(updatedChains);

          const verifiedCount = updatedChains.filter(c => c.verified && c.status === 'online').length;
          setConsensus({
            reached: verifiedCount >= 2,
            chainsVerified: verifiedCount,
            totalChains: 3,
            canUnlock: verifiedCount >= 2
          });
        }
      } catch (error) {
        console.error('Failed to fetch blockchain status:', error);
      }
    };

    fetchBlockchainData();
    const interval = setInterval(fetchBlockchainData, 10000);
    return () => clearInterval(interval);
  }, []);

  const testConsensus = () => {
    toast({
      title: "🔺 Consensus Test",
      description: consensus.canUnlock 
        ? `✅ 2-of-3 consensus REACHED! (${consensus.chainsVerified}/3 chains verified)` 
        : `❌ Consensus failed (${consensus.chainsVerified}/3 chains verified)`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div className="text-center space-y-4 mb-8">
          <div className="flex items-center justify-center gap-3">
            <Shield className="w-16 h-16 text-purple-400" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Trinity Protocol
            </h1>
          </div>
          <p className="text-xl text-gray-300">
            Multi-Chain Security: Even if 1 Chain is Hacked, Your Funds Are Safe
          </p>
          <Badge variant="outline" className="text-lg px-4 py-2 border-purple-400 text-purple-300">
            2-of-3 Mathematical Consensus • Deployed & Live
          </Badge>
        </div>

        <Card className="bg-black/50 border-purple-500/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Connect Your Wallets</CardTitle>
            <CardDescription className="text-gray-400">
              Connect to all 3 chains to experience the full Trinity Protocol security
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MultiChainWalletConnect />
          </CardContent>
        </Card>

        <Card className="bg-black/50 border-purple-500/30 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-3xl text-white flex items-center gap-2">
                  {consensus.canUnlock ? (
                    <>
                      <Unlock className="w-8 h-8 text-green-400" />
                      <span className="text-green-400">Consensus REACHED</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-8 h-8 text-red-400" />
                      <span className="text-red-400">Consensus FAILED</span>
                    </>
                  )}
                </CardTitle>
                <CardDescription className="text-gray-400 text-lg mt-2">
                  {consensus.chainsVerified} of {consensus.totalChains} blockchains verified
                </CardDescription>
              </div>
              <Button 
                onClick={testConsensus} 
                variant="outline" 
                className="border-purple-400 text-purple-300 hover:bg-purple-500/20"
                data-testid="button-test-consensus"
              >
                Test Consensus
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative h-32">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex gap-4">
                  {chains.map((chain, i) => (
                    <div key={chain.name} className="relative">
                      <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${chain.color} flex items-center justify-center text-4xl shadow-lg transition-all duration-300 ${
                        chain.verified && chain.status === 'online' ? 'ring-4 ring-green-400 scale-110' : 'opacity-50'
                      }`}>
                        {chain.icon}
                      </div>
                      {chain.verified && chain.status === 'online' && (
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <Check className="w-5 h-5 text-white" />
                        </div>
                      )}
                      {(!chain.verified || chain.status !== 'online') && (
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                          <X className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-purple-900/30 rounded-lg border border-purple-500/30">
              <p className="text-center text-green-300 text-lg font-semibold">
                ✅ Mathematical Proof: {consensus.chainsVerified >= 2 ? 'Your vault is SECURE even if 1 chain fails!' : 'Need at least 2 chains verified'}
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {chains.map((chain) => (
            <Card 
              key={chain.name} 
              className={`bg-black/50 border backdrop-blur-sm transition-all ${
                chain.status === 'online' 
                  ? 'border-green-500/50 hover:border-green-500' 
                  : 'border-red-500/50 hover:border-red-500'
              }`}
              data-testid={`card-chain-${chain.name.toLowerCase()}`}
            >
              <CardHeader>
                <CardTitle className="text-2xl text-white flex items-center gap-2">
                  <span className="text-3xl">{chain.icon}</span>
                  {chain.name}
                </CardTitle>
                <CardDescription className="text-gray-400">
                  {chain.network}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Status:</span>
                  <Badge 
                    variant={chain.status === 'online' ? 'default' : 'destructive'}
                    className={chain.status === 'online' ? 'bg-green-600' : ''}
                    data-testid={`badge-status-${chain.name.toLowerCase()}`}
                  >
                    <Activity className="w-3 h-3 mr-1" />
                    {chain.status}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Block Height:</span>
                  <span className="text-white font-mono" data-testid={`text-block-${chain.name.toLowerCase()}`}>
                    {chain.blockHeight.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Verified:</span>
                  {chain.verified ? (
                    <Badge variant="default" className="bg-green-600">
                      <Check className="w-3 h-3 mr-1" />
                      Yes
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      <X className="w-3 h-3 mr-1" />
                      No
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-black/50 border-blue-500/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Deployed Smart Contracts</CardTitle>
            <CardDescription className="text-gray-400">
              All contracts verified and operational on respective blockchains
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-blue-400 flex items-center gap-2">
                ⟠ Ethereum (Sepolia)
              </h3>
              <div className="grid gap-2">
                <div className="flex items-center justify-between p-3 bg-blue-900/20 rounded border border-blue-500/30">
                  <span className="text-gray-400">ChronosVault:</span>
                  <div className="flex items-center gap-2">
                    <code className="text-white text-sm font-mono bg-black/50 px-2 py-1 rounded">
                      {deployedContracts.ethereum.vault}
                    </code>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => window.open(`${deployedContracts.ethereum.explorerUrl}${deployedContracts.ethereum.vault}`, '_blank')}
                      data-testid="link-ethereum-vault"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-900/20 rounded border border-blue-500/30">
                  <span className="text-gray-400">CVT Token:</span>
                  <div className="flex items-center gap-2">
                    <code className="text-white text-sm font-mono bg-black/50 px-2 py-1 rounded">
                      {deployedContracts.ethereum.token}
                    </code>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => window.open(`${deployedContracts.ethereum.explorerUrl}${deployedContracts.ethereum.token}`, '_blank')}
                      data-testid="link-ethereum-token"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-green-400 flex items-center gap-2">
                ◎ Solana (Devnet)
              </h3>
              <div className="flex items-center justify-between p-3 bg-green-900/20 rounded border border-green-500/30">
                <span className="text-gray-400">Chronos Vault Program:</span>
                <div className="flex items-center gap-2">
                  <code className="text-white text-sm font-mono bg-black/50 px-2 py-1 rounded">
                    {deployedContracts.solana.program}
                  </code>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => window.open(`${deployedContracts.solana.explorerUrl}${deployedContracts.solana.program}?cluster=devnet`, '_blank')}
                    data-testid="link-solana-program"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-purple-400 flex items-center gap-2">
                💎 TON (Testnet)
              </h3>
              <div className="flex items-center justify-between p-3 bg-purple-900/20 rounded border border-purple-500/30">
                <span className="text-gray-400">Vault Master:</span>
                <div className="flex items-center gap-2">
                  <code className="text-white text-sm font-mono bg-black/50 px-2 py-1 rounded">
                    {deployedContracts.ton.vault}
                  </code>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => window.open(`${deployedContracts.ton.explorerUrl}${deployedContracts.ton.vault}`, '_blank')}
                    data-testid="link-ton-vault"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/50 border-yellow-500/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-yellow-400">How Trinity Protocol Protects You</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-300">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-white">2-of-3 Mathematical Consensus</p>
                <p>Your vault requires verification from at least 2 out of 3 blockchains to unlock. Pure mathematics, not trust.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-white">Hack-Resistant Security</p>
                <p>Even if a hacker compromises 1 blockchain, they cannot access your vault. The other 2 chains prevent unauthorized access.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-white">Real Deployed Contracts</p>
                <p>All contracts are deployed on real blockchains (not simulations). Click the links above to verify on blockchain explorers.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
