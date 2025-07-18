import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, Wallet, LogOut } from 'lucide-react';

interface SimpleTonButtonProps {
  variant?: 'default' | 'outline' | 'secondary' | 'ghost';
  size?: 'sm' | 'lg' | 'icon' | 'default';
  className?: string;
  isConnected: boolean;
  isConnecting: boolean;
  address?: string;
  onConnect: () => void;
  onDisconnect: () => void;
}

/**
 * Simple TON Connect Button
 * 
 * A simplified button component that doesn't use TonConnect UI directly
 * but creates a placeholder in the DOM for the TonConnectUI to attach to
 */
export default function SimpleTonButton({
  variant = 'default',
  size = 'default',
  className = '',
  isConnected,
  isConnecting,
  address,
  onConnect,
  onDisconnect
}: SimpleTonButtonProps) {
  
  // Ensure the button container is ready in the DOM before TonConnect tries to use it
  useEffect(() => {
    // This ensures our button container exists for TonConnectUI to find
    const buttonContainer = document.getElementById('ton-connect-button');
    if (!buttonContainer) {
      console.error("TON Connect button container not found in DOM");
    }
  }, []);
  
  const handleClick = () => {
    if (isConnected) {
      onDisconnect();
    } else {
      onConnect();
    }
  };

  const shortenAddress = (address: string): string => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <>
      {/* Create a hidden div for TonConnectUI to find and attach to */}
      <div id="ton-connect-button" style={{ display: 'none' }}></div>
      
      {/* Our custom button to match our UI */}
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
            {address ? shortenAddress(address) : 'Disconnect'}
          </>
        ) : (
          <>
            <Wallet className="mr-2 h-4 w-4" />
            Connect TON Wallet
          </>
        )}
      </Button>
    </>
  );
}