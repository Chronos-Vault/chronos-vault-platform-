import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Power, Wallet, RefreshCw, ExternalLink, CheckCircle, AlertTriangle } from 'lucide-react';
import { useTon } from '@/contexts/ton-context';
import { TonConnectionStatus } from '@/lib/ton/ton-service';

interface WalletStatus {
  connected: boolean;
  address: string;
  balance: string;
  network: string;
}

export default function TonWalletPanel() {
  const { isConnected, walletInfo, connectionStatus, connect, disconnect } = useTon();
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  
  // Handle wallet connection
  const handleConnect = async () => {
    try {
      setIsProcessing(true);
      setLastError(null);
      await connect();
    } catch (error: any) {
      console.error('Failed to connect TON wallet:', error);
      setLastError(error.message || 'Could not connect to wallet');
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Handle wallet disconnection
  const handleDisconnect = async () => {
    try {
      setIsProcessing(true);
      setLastError(null);
      console.log('Attempting to disconnect TON wallet from UI...');
      const result = await disconnect();
      console.log('Disconnect result:', result);
      // Force reload the page to clear any TON Connect state
      if (result) {
        // Wait a moment before triggering reload
        setTimeout(() => {
          console.log('Reloading page to fully reset TON Connect state...');
          window.location.reload();
        }, 500);
      }
    } catch (error: any) {
      console.error('Failed to disconnect TON wallet:', error);
      setLastError(error.message || 'Could not disconnect wallet');
      // Force reload if disconnect failed
      setTimeout(() => {
        console.log('Forcing page reload after failed disconnect attempt...');
        window.location.reload();
      }, 1000);
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Format wallet address for display
  const formatAddress = (address: string): string => {
    if (!address) return '';
    if (address.length <= 16) return address;
    return `${address.substring(0, 8)}...${address.substring(address.length - 8)}`;
  };
  
  // Check if wallet is on testnet
  const isTestnet = walletInfo?.network === 'testnet';

  return (
    <Card className="border border-[#6B00D7]/30 bg-gradient-to-br from-[#121212]/80 to-[#1A1A1A]/80 backdrop-blur-sm">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-white">TON Wallet</CardTitle>
            <CardDescription className="text-gray-400">Connect and manage your TON wallet</CardDescription>
          </div>
          {isConnected && isTestnet && (
            <div className="px-2 py-1 text-xs font-medium bg-amber-500/20 border border-amber-500/30 text-amber-300 rounded-full">
              Testnet
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {!isConnected ? (
          <div className="space-y-4">
            <Alert variant="destructive" className="mb-4 bg-red-950/30 border-red-700/50">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Wallet Not Connected</AlertTitle>
              <AlertDescription>
                You need to connect your TON wallet to interact with the blockchain.
              </AlertDescription>
            </Alert>
            
            <Button
              onClick={handleConnect}
              disabled={isProcessing || connectionStatus === TonConnectionStatus.CONNECTING}
              className="w-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#7B10E7] hover:to-[#FF6AF7] text-white"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Wallet className="h-4 w-4 mr-2" />
                  Connect TON Wallet
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-[#121212]/40 border border-[#6B00D7]/20">
              <div className="flex items-center mb-3">
                <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse mr-2"></div>
                <span className="text-sm font-medium text-green-300">Connected</span>
                
                <div className="ml-auto">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDisconnect}
                    disabled={isProcessing}
                    className="text-gray-400 hover:text-white hover:bg-red-900/30 h-8"
                  >
                    {isProcessing ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Power className="h-4 w-4 mr-1" />
                        Disconnect
                      </>
                    )}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Address:</span>
                  <span className="text-white font-mono">{formatAddress(walletInfo?.address || '')}</span>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Balance:</span>
                  <span className="text-white">{walletInfo?.balance || '0'} TON</span>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Network:</span>
                  <span className="text-white capitalize">{walletInfo?.network || 'unknown'}</span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center">
              <Button
                variant="outline"
                size="sm"
                className="text-xs border-[#6B00D7]/30 hover:bg-[#6B00D7]/10"
                onClick={() => window.open(`https://testnet.tonscan.org/address/${walletInfo?.address}`, '_blank')}
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                View on Explorer
              </Button>
            </div>
          </div>
        )}
        
        {lastError && (
          <Alert variant="destructive" className="mt-4 bg-red-950/30 border-red-700/50">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{lastError}</AlertDescription>
          </Alert>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col items-start text-xs text-gray-400 pt-2 border-t border-[#6B00D7]/10">
        <p>This application connects to TON testnet for development and testing.</p>
      </CardFooter>
    </Card>
  );
}
