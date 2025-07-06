import React from 'react';
import { useTon } from '@/contexts/ton-context';
import { TonConnectionStatus } from '@/lib/ton/ton-service';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Wallet, CheckCircle, AlertTriangle } from 'lucide-react';

/**
 * A simple component to show TON wallet connection status
 * This can be included on any page to verify connection persistence
 */
export default function TonWalletStateIndicator() {
  const { isConnected, walletInfo, connectionStatus } = useTon();
  
  if (connectionStatus === TonConnectionStatus.CONNECTING) {
    return (
      <Alert className="bg-amber-900/20 border-amber-700/50 text-amber-300">
        <AlertTriangle className="h-4 w-4 mr-2" />
        <AlertDescription>
          Connecting to TON wallet...
        </AlertDescription>
      </Alert>
    );
  }
  
  if (!isConnected) {
    return (
      <Alert variant="destructive" className="bg-red-950/30 border-red-700/50">
        <AlertTriangle className="h-4 w-4 mr-2" />
        <AlertDescription>
          TON wallet is not connected
        </AlertDescription>
      </Alert>
    );
  }
  
  // Format wallet address for display
  const formatAddress = (address: string): string => {
    if (!address) return '';
    if (address.length <= 16) return address;
    return `${address.substring(0, 8)}...${address.substring(address.length - 8)}`;
  };
  
  return (
    <Alert className="bg-green-900/20 border-green-700/30 text-green-300">
      <CheckCircle className="h-4 w-4 mr-2" />
      <AlertDescription className="flex items-center gap-2">
        <span>Connected to TON wallet</span>
        <span className="font-mono text-xs bg-black/20 px-2 py-1 rounded">
          {formatAddress(walletInfo?.address || '')}
        </span>
        <span className="text-xs bg-black/20 px-2 py-1 rounded">
          {walletInfo?.balance || '0'} TON
        </span>
      </AlertDescription>
    </Alert>
  );
}
