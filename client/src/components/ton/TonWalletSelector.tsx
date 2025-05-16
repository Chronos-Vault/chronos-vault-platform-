import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ConnectionStatus, TonWalletType, WalletInfo, tonConnector } from '@/lib/ton/enhanced-ton-connector';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CheckCircle2, Wallet, XCircle, ExternalLink, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Wallet logos for major TON wallets
const WalletLogos: Record<TonWalletType, string> = {
  [TonWalletType.TONKEEPER]: '/assets/wallets/tonkeeper-logo.svg',
  [TonWalletType.TONHUB]: '/assets/wallets/tonhub-logo.svg',
  [TonWalletType.OPENMASK]: '/assets/wallets/openmask-logo.svg',
  [TonWalletType.MYTONWALLET]: '/assets/wallets/mytonwallet-logo.svg',
  [TonWalletType.TONWALLET]: '/assets/wallets/ton-wallet-logo.svg',
  [TonWalletType.EXTENSION]: '/assets/wallets/ton-extension-logo.svg',
  [TonWalletType.OTHER]: '/assets/wallets/ton-generic-logo.svg',
};

// Wallet installation links
const WalletInstallLinks: Record<TonWalletType, string> = {
  [TonWalletType.TONKEEPER]: 'https://tonkeeper.com',
  [TonWalletType.TONHUB]: 'https://ton.app',
  [TonWalletType.OPENMASK]: 'https://www.openmask.app',
  [TonWalletType.MYTONWALLET]: 'https://mytonwallet.io',
  [TonWalletType.TONWALLET]: 'https://chrome.google.com/webstore/detail/ton-wallet/nphplpgoakhhjchkkhmiggakijnkhfnd',
  [TonWalletType.EXTENSION]: 'https://chrome.google.com/webstore/category/extensions',
  [TonWalletType.OTHER]: 'https://ton.org/wallets',
};

interface TonWalletSelectorProps {
  onWalletConnected?: (wallet: WalletInfo) => void;
  onWalletDisconnected?: () => void;
  buttonLabel?: string;
  buttonVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  buttonSize?: 'default' | 'sm' | 'lg' | 'icon';
  showAddress?: boolean;
  showBalance?: boolean;
  className?: string;
}

export function TonWalletSelector({
  onWalletConnected,
  onWalletDisconnected,
  buttonLabel = 'Connect TON Wallet',
  buttonVariant = 'default',
  buttonSize = 'default',
  showAddress = true,
  showBalance = false,
  className = '',
}: TonWalletSelectorProps) {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(
    tonConnector.getStatus()
  );
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(
    tonConnector.getWalletInfo()
  );
  const [isOpen, setIsOpen] = useState(false);
  const [preferredWallets, setPreferredWallets] = useState<TonWalletType[]>([
    TonWalletType.TONKEEPER,
    TonWalletType.TONHUB,
    TonWalletType.OPENMASK,
    TonWalletType.MYTONWALLET,
  ]);
  const { toast } = useToast();

  // Update local state when connector status changes
  useEffect(() => {
    const handleStatusChange = (status: ConnectionStatus, wallet: WalletInfo | null) => {
      setConnectionStatus(status);
      setWalletInfo(wallet);
      
      if (status === ConnectionStatus.CONNECTED && wallet) {
        setIsOpen(false); // Close dialog when connected
        onWalletConnected?.(wallet);
      } else if (status === ConnectionStatus.DISCONNECTED) {
        onWalletDisconnected?.();
      }
    };
    
    tonConnector.addConnectionListener(handleStatusChange);
    
    return () => {
      tonConnector.removeConnectionListener(handleStatusChange);
    };
  }, [onWalletConnected, onWalletDisconnected]);

  // Function to connect wallet
  const handleConnect = async () => {
    if (connectionStatus === ConnectionStatus.CONNECTED) {
      // Open disconnect confirmation
      setIsOpen(true);
    } else {
      // Open wallet selector
      const connected = await tonConnector.connect();
      if (connected) {
        toast({
          title: 'Wallet Connected',
          description: `Successfully connected to ${connected.name}`,
          variant: 'default',
        });
      }
    }
  };

  // Function to disconnect wallet
  const handleDisconnect = async () => {
    await tonConnector.disconnect();
    setIsOpen(false);
    toast({
      title: 'Wallet Disconnected',
      description: 'Your TON wallet has been disconnected',
      variant: 'default',
    });
  };

  // Format wallet address for display
  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Render button based on connection status
  const renderButton = () => {
    // If connecting, show spinner
    if (connectionStatus === ConnectionStatus.CONNECTING) {
      return (
        <Button
          variant={buttonVariant}
          size={buttonSize}
          className={className}
          disabled
        >
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Connecting...
        </Button>
      );
    }
    
    // If connected, show wallet info
    if (connectionStatus === ConnectionStatus.CONNECTED && walletInfo) {
      return (
        <Button
          variant="outline"
          size={buttonSize}
          className={`${className} flex items-center gap-2`}
          onClick={handleConnect}
        >
          {walletInfo.type in WalletLogos ? (
            <img 
              src={WalletLogos[walletInfo.type]} 
              alt={walletInfo.name} 
              className="h-4 w-4 mr-2" 
            />
          ) : (
            <Wallet className="h-4 w-4 mr-2" />
          )}
          {showAddress && walletInfo.address ? formatAddress(walletInfo.address) : walletInfo.name}
        </Button>
      );
    }
    
    // Default: Not connected
    return (
      <Button
        variant={buttonVariant}
        size={buttonSize}
        className={className}
        onClick={handleConnect}
      >
        <Wallet className="mr-2 h-4 w-4" />
        {buttonLabel}
      </Button>
    );
  };

  // Render wallet options
  const renderWalletOptions = () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        {preferredWallets.map((wallet) => (
          <button
            key={wallet}
            className="flex items-center p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-accent transition-colors"
            onClick={() => {
              // Explicitly select this wallet if possible
              // For now, we just close the dialog and let the TonConnectUI handle wallet selection
              setIsOpen(false);
              setTimeout(() => tonConnector.connect(), 100);
            }}
          >
            <div className="mr-4 h-10 w-10 rounded-full flex items-center justify-center overflow-hidden">
              <img
                src={WalletLogos[wallet]}
                alt={wallet}
                className="h-8 w-8 object-contain"
              />
            </div>
            <div className="flex-1 text-left">
              <div className="font-medium">
                {wallet === TonWalletType.TONKEEPER && 'Tonkeeper'}
                {wallet === TonWalletType.TONHUB && 'TON Hub'}
                {wallet === TonWalletType.OPENMASK && 'OpenMask'}
                {wallet === TonWalletType.MYTONWALLET && 'MyTonWallet'}
              </div>
              <div className="text-muted-foreground text-sm">
                {wallet === TonWalletType.TONKEEPER && 'Popular mobile wallet'}
                {wallet === TonWalletType.TONHUB && 'Reliable & secure'}
                {wallet === TonWalletType.OPENMASK && 'Browser extension'}
                {wallet === TonWalletType.MYTONWALLET && 'Web & mobile wallet'}
              </div>
            </div>
          </button>
        ))}
      </div>
    );
  };

  // Render wallet installation links
  const renderWalletInstallLinks = () => {
    return (
      <div className="mt-6">
        <h3 className="text-sm font-medium mb-3">Don't have a TON wallet?</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[TonWalletType.TONKEEPER, TonWalletType.TONHUB, TonWalletType.OPENMASK, TonWalletType.MYTONWALLET].map((wallet) => (
            <a
              key={`install-${wallet}`}
              href={WalletInstallLinks[wallet]}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-accent transition-colors text-center"
            >
              <img
                src={WalletLogos[wallet]}
                alt={wallet}
                className="h-8 w-8 mb-2"
              />
              <span className="text-xs font-medium">
                {wallet === TonWalletType.TONKEEPER && 'Install Tonkeeper'}
                {wallet === TonWalletType.TONHUB && 'Install TON Hub'}
                {wallet === TonWalletType.OPENMASK && 'Install OpenMask'}
                {wallet === TonWalletType.MYTONWALLET && 'Install MyTonWallet'}
              </span>
              <ExternalLink className="h-3 w-3 mt-1 text-muted-foreground" />
            </a>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      {renderButton()}

      {/* Wallet Selection Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {connectionStatus === ConnectionStatus.CONNECTED
                ? 'Wallet Connected'
                : 'Connect TON Wallet'}
            </DialogTitle>
            <DialogDescription>
              {connectionStatus === ConnectionStatus.CONNECTED
                ? 'Your wallet is currently connected to this application.'
                : 'Select a wallet to connect to The Open Network (TON).'}
            </DialogDescription>
          </DialogHeader>

          {connectionStatus === ConnectionStatus.CONNECTED && walletInfo ? (
            <div className="p-6 flex flex-col items-center justify-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                {walletInfo.type in WalletLogos ? (
                  <img 
                    src={WalletLogos[walletInfo.type]} 
                    alt={walletInfo.name} 
                    className="h-10 w-10" 
                  />
                ) : (
                  <Wallet className="h-10 w-10 text-primary" />
                )}
              </div>
              <h3 className="text-lg font-semibold">{walletInfo.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {walletInfo.address}
              </p>
              <div className="flex gap-2 mt-2">
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Close
                </Button>
                <Button variant="destructive" onClick={handleDisconnect}>
                  Disconnect
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-4">
              {renderWalletOptions()}
              {renderWalletInstallLinks()}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}