import React from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, Wallet, LogOut } from 'lucide-react';
import { useTon } from '@/contexts/ton-context';

interface TonConnectButtonProps {
  variant?: 'default' | 'outline' | 'secondary' | 'ghost';
  size?: 'sm' | 'lg' | 'icon' | 'default';
  className?: string;
}

/**
 * TON Connect Button
 * 
 * A button component that allows users to connect to TON wallets.
 */
export default function TonConnectButton({
  variant = 'default',
  size = 'default',
  className = ''
}: TonConnectButtonProps) {
  const { 
    isConnected, 
    isConnecting, 
    connect, 
    disconnect,
    walletInfo 
  } = useTon();

  const handleClick = async () => {
    if (isConnected) {
      await disconnect();
    } else {
      await connect();
    }
  };

  const shortenAddress = (address: string): string => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <div id="ton-connect-button">
      {/* Custom button to match our UI */}
      <Button
        variant={variant}
        size={size}
        onClick={handleClick}
        className={`${className} ${isConnected ? 'bg-[#0088CC] hover:bg-[#0099DD]' : 'bg-[#0088CC] hover:bg-[#0099DD]'}`}
        disabled={isConnecting}
      >
        {isConnecting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Connecting...
          </>
        ) : isConnected ? (
          <>
            <LogOut className="mr-2 h-4 w-4" />
            {walletInfo ? shortenAddress(walletInfo.address) : 'Disconnect'}
          </>
        ) : (
          <>
            <Wallet className="mr-2 h-4 w-4" />
            Connect TON Wallet
          </>
        )}
      </Button>
    </div>
  );
}