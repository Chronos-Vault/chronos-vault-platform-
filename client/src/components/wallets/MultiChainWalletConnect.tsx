import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wallet, Check, ExternalLink, AlertCircle, Loader2 } from 'lucide-react';
import { useWallet } from '@/contexts/wallet-context';

interface WalletInfo {
  chain: 'ethereum' | 'solana' | 'ton';
  displayName: string;
  walletName: string;
  icon: string;
  installLink: string;
}

const WALLET_CONFIG: WalletInfo[] = [
  {
    chain: 'ethereum',
    displayName: 'Ethereum',
    walletName: 'MetaMask',
    icon: '⟠',
    installLink: 'https://metamask.io/download/'
  },
  {
    chain: 'solana',
    displayName: 'Solana',
    walletName: 'Phantom',
    icon: '◎',
    installLink: 'https://phantom.app/download'
  },
  {
    chain: 'ton',
    displayName: 'TON',
    walletName: 'TON Keeper',
    icon: '💎',
    installLink: 'https://tonkeeper.com/'
  }
];

export default function MultiChainWalletConnect() {
  const { status, connectedWallets, connect, disconnect } = useWallet();

  const handleConnect = async (chain: 'ethereum' | 'solana' | 'ton') => {
    await connect(chain);
  };

  const handleDisconnect = async (chain: 'ethereum' | 'solana' | 'ton') => {
    await disconnect(chain);
  };

  const connectedCount = WALLET_CONFIG.filter(w => status[w.chain] === 'connected').length;

  return (
    <Card className="bg-black/50 border-purple-500/30 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl text-white flex items-center gap-2">
              <Wallet className="w-6 h-6 text-purple-400" />
              Multi-Chain Wallet Connection
            </CardTitle>
            <CardDescription className="text-gray-400 mt-2">
              Connect your wallets to interact with Trinity Protocol across all 3 blockchains
            </CardDescription>
          </div>
          <Badge 
            variant={connectedCount === 3 ? "default" : "outline"} 
            className={connectedCount === 3 ? "bg-green-600" : "border-yellow-500 text-yellow-400"}
          >
            {connectedCount}/3 Connected
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {WALLET_CONFIG.map((walletInfo) => {
            const isConnected = status[walletInfo.chain] === 'connected';
            const isConnecting = status[walletInfo.chain] === 'connecting';
            const wallet = connectedWallets[walletInfo.chain];

            return (
              <div 
                key={walletInfo.chain} 
                className={`p-6 rounded-lg border-2 transition-all ${
                  isConnected 
                    ? 'border-green-500 bg-green-900/20' 
                    : 'border-gray-700 bg-gray-900/20 hover:border-purple-500/50'
                }`}
                data-testid={`card-wallet-${walletInfo.chain}`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">{walletInfo.icon}</span>
                  <div>
                    <h3 className="text-xl font-semibold text-white">{walletInfo.displayName}</h3>
                    <p className="text-sm text-gray-400">{walletInfo.walletName}</p>
                  </div>
                </div>

                {isConnected ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-green-400">
                      <Check className="w-4 h-4" />
                      <span className="text-sm font-semibold">Connected</span>
                    </div>
                    
                    {wallet?.address && (
                      <div className="p-2 bg-black/50 rounded">
                        <p className="text-xs text-gray-400">Address:</p>
                        <p className="text-xs text-white font-mono break-all">
                          {wallet.address.slice(0, 8)}...{wallet.address.slice(-6)}
                        </p>
                      </div>
                    )}

                    {wallet?.balance && (
                      <div className="p-2 bg-black/50 rounded">
                        <p className="text-xs text-gray-400">Balance:</p>
                        <p className="text-sm text-white font-semibold">
                          {wallet.balance.formatted} {wallet.balance.symbol}
                        </p>
                      </div>
                    )}

                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full border-red-500 text-red-400 hover:bg-red-500/20"
                      onClick={() => handleDisconnect(walletInfo.chain)}
                      data-testid={`button-disconnect-${walletInfo.chain}`}
                    >
                      Disconnect
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full border-purple-500 text-purple-300 hover:bg-purple-500/20"
                      onClick={() => handleConnect(walletInfo.chain)}
                      disabled={isConnecting}
                      data-testid={`button-connect-${walletInfo.chain}`}
                    >
                      {isConnecting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Connecting...
                        </>
                      ) : (
                        `Connect ${walletInfo.walletName}`
                      )}
                    </Button>

                    <a 
                      href={walletInfo.installLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 text-xs text-gray-400 hover:text-purple-400 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Install {walletInfo.walletName}
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {connectedCount > 0 && (
          <div className="mt-6 p-4 bg-purple-900/30 rounded-lg border border-purple-500/30">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-purple-200 font-semibold">Trinity Protocol Active</p>
                <p className="text-gray-300 text-sm mt-1">
                  You have {connectedCount} wallet{connectedCount > 1 ? 's' : ''} connected. 
                  Connect all 3 wallets to enable full Trinity Protocol protection with 2-of-3 consensus security.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
