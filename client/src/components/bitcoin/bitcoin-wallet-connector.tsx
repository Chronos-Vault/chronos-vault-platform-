import { useState } from 'react';
import { useBitcoinWallet } from '@/contexts/bitcoin-wallet-context';
import { Bitcoin, Wallet, RefreshCw, LogOut, ChevronDown, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useDevMode } from '@/contexts/dev-mode-context';

interface BitcoinWalletConnectorProps {
  className?: string;
}

export function BitcoinWalletConnector({ className }: BitcoinWalletConnectorProps = {}) {
  const { 
    walletInfo, 
    isConnecting, 
    isConnected, 
    connectWallet, 
    disconnectWallet, 
    refreshWalletInfo,
    availableProviders
  } = useBitcoinWallet();
  
  const { devModeEnabled } = useDevMode();
  const [isOpen, setIsOpen] = useState(false);
  
  // Check if it's a mobile context
  const isMobileContext = className?.includes('mobile-version');
  
  // Handle wallet connection
  const handleConnect = async (provider: string) => {
    await connectWallet(provider);
    setIsOpen(false);
  };
  
  // Format address for display
  const formatAddress = (address: string, truncateLength = 6) => {
    if (!address) return '';
    return `${address.substring(0, truncateLength)}...${address.substring(address.length - 4)}`;
  };
  
  // Format balance with proper number of decimals
  const formatBalance = (balance: string | number, decimals = 4) => {
    try {
      const numBalance = typeof balance === 'number' ? balance : Number(balance);
      return numBalance.toFixed(decimals);
    } catch (e) {
      return '0.0000';
    }
  };

  // If connected, show wallet info
  if (isConnected && walletInfo) {
    return (
      <div className="flex items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              className={`flex items-center gap-1 bg-gradient-to-r from-orange-50 to-amber-50 hover:from-orange-100 hover:to-amber-100 border-orange-200 text-orange-900 dark:from-orange-950/30 dark:to-amber-950/30 dark:hover:from-orange-950/40 dark:hover:to-amber-950/40 dark:border-orange-800 dark:text-orange-300 px-3 py-2 ${
                isMobileContext ? 'text-xs min-w-0 w-full' : ''
              }`}
            >
              <Bitcoin className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              {isMobileContext ? (
                <span className="font-mono text-xs">{formatAddress(walletInfo.address, 3)}</span>
              ) : (
                <span className="hidden md:inline">{formatAddress(walletInfo.address)}</span>
              )}
              <span className={`${isMobileContext ? '' : 'md:ml-2'} font-mono font-medium text-green-600 dark:text-green-400 ${isMobileContext ? 'text-xs' : ''}`}>
                {formatBalance(walletInfo.balance, isMobileContext ? 2 : 4)} BTC
              </span>
              <ChevronDown className="h-4 w-4 ml-1 text-orange-600 dark:text-orange-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Bitcoin Wallet</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {walletInfo.address}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center gap-2" onClick={() => refreshWalletInfo()}>
              <RefreshCw className="h-4 w-4" />
              <span>Refresh Balance</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center gap-2 text-red-600 dark:text-red-400" onClick={disconnectWallet}>
              <LogOut className="h-4 w-4" />
              <span>Disconnect Wallet</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  // If connecting, show loading state
  if (isConnecting) {
    return (
      <Button disabled className="h-10 flex items-center gap-2 bg-orange-100 dark:bg-orange-900/20 text-orange-900 dark:text-orange-300 border-orange-200 dark:border-orange-800">
        <Skeleton className="h-4 w-4 rounded-full bg-orange-200 dark:bg-orange-800" />
        <span>Connecting...</span>
      </Button>
    );
  }

  // If not connected, show connect button
  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button 
            size="sm"
            className={`flex items-center gap-1 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white ${
              isMobileContext ? 'h-8 px-2 text-xs min-w-0 w-full' : 'h-10'
            } ${className}`}
          >
            <Bitcoin className="h-3 w-3" />
            {!isMobileContext && <span>Connect Bitcoin</span>}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bitcoin className="h-5 w-5 text-orange-600" />
              Connect Bitcoin Wallet
            </DialogTitle>
            <DialogDescription>
              Connect your Bitcoin wallet to create and manage vaults.
            </DialogDescription>
          </DialogHeader>
          
          {devModeEnabled && (
            <Alert className="my-4 border-amber-500 dark:border-amber-600 bg-amber-50 dark:bg-amber-950/40">
              <AlertTitle className="text-amber-700 dark:text-amber-400">Development Mode Active</AlertTitle>
              <AlertDescription className="text-amber-600 dark:text-amber-500">
                You can connect to a simulated Bitcoin wallet in development mode.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="grid gap-4 py-4">
            {availableProviders.length > 0 ? (
              availableProviders.map((provider) => (
                <Card key={provider} className="cursor-pointer hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-colors border-orange-200 dark:border-orange-800" onClick={() => handleConnect(provider)}>
                  <CardHeader className="py-4">
                    <CardTitle className="text-base flex items-center">
                      <Bitcoin className="h-5 w-5 mr-2 text-orange-600 dark:text-orange-400" />
                      {provider}
                    </CardTitle>
                  </CardHeader>
                </Card>
              ))
            ) : (
              <>
                <p className="text-center text-gray-600 dark:text-gray-400 mb-2">No Bitcoin wallets detected</p>
                <p className="text-center text-sm text-gray-500 dark:text-gray-500">
                  Please install one of these supported wallets:
                </p>
                <div className="flex flex-wrap justify-center gap-2 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-orange-200 dark:border-orange-800"
                    onClick={() => window.open('https://unisat.io/download', '_blank')}
                  >
                    Unisat
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-orange-200 dark:border-orange-800"
                    onClick={() => window.open('https://www.xverse.app/download', '_blank')}
                  >
                    Xverse
                  </Button>
                </div>
                
                {devModeEnabled && (
                  <Button 
                    className="mt-4 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white"
                    onClick={() => handleConnect('Unisat')}
                  >
                    Use Simulated Wallet
                  </Button>
                )}
              </>
            )}
          </div>
          
          {/* Removed the extra DialogFooter with Close button that was causing duplicate close buttons */}
        </DialogContent>
      </Dialog>
    </>
  );
}