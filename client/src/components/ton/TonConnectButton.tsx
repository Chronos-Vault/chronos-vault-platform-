import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { tonService, TonConnectionStatus } from '@/lib/ton/ton-service';

interface TonConnectButtonProps {
  variant?: 'default' | 'outline' | 'subtle' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * TON Connect Button
 * 
 * A button component that allows users to connect to TON wallets.
 */
const TonConnectButton: React.FC<TonConnectButtonProps> = ({
  variant = 'default',
  size = 'md',
  className = ''
}) => {
  const [connectionStatus, setConnectionStatus] = useState<TonConnectionStatus>(TonConnectionStatus.DISCONNECTED);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Initialize TON service
  useEffect(() => {
    const initService = async () => {
      await tonService.initialize();
      setConnectionStatus(tonService.getConnectionStatus());
      const walletInfo = tonService.getWalletInfo();
      setWalletAddress(walletInfo?.address || null);
      setIsInitialized(true);
    };
    
    initService();
    
    // Poll for status changes
    const interval = setInterval(() => {
      setConnectionStatus(tonService.getConnectionStatus());
      const walletInfo = tonService.getWalletInfo();
      setWalletAddress(walletInfo?.address || null);
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleConnect = async () => {
    if (connectionStatus === TonConnectionStatus.CONNECTED) {
      await tonService.disconnect();
    } else {
      await tonService.connect();
    }
  };
  
  // Truncate address for display
  const displayAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };
  
  // Button text based on connection status
  const getButtonText = () => {
    switch (connectionStatus) {
      case TonConnectionStatus.CONNECTED:
        return walletAddress ? displayAddress(walletAddress) : 'Connected';
      case TonConnectionStatus.CONNECTING:
        return 'Connecting...';
      case TonConnectionStatus.DISCONNECTED:
      default:
        return 'Connect TON';
    }
  };
  
  // Custom styles based on connection status
  const getButtonStyle = () => {
    if (connectionStatus === TonConnectionStatus.CONNECTED) {
      return "bg-[#0088CC] hover:bg-[#0099DD] text-white";
    }
    return "";
  };
  
  if (!isInitialized) {
    return <Button variant="outline" size="sm" disabled>Initializing...</Button>;
  }
  
  return (
    <Button 
      onClick={handleConnect}
      variant={variant}
      size={size}
      className={`${className} ${getButtonStyle()}`}
    >
      <div className="flex items-center gap-2">
        {connectionStatus === TonConnectionStatus.CONNECTING && (
          <span className="animate-spin">⟳</span>
        )}
        {connectionStatus === TonConnectionStatus.CONNECTED && (
          <span className="h-2 w-2 rounded-full bg-green-500"></span>
        )}
        {getButtonText()}
      </div>
    </Button>
  );
};

export default TonConnectButton;