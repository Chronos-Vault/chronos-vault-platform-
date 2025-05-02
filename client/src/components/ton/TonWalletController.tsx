import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Power, RefreshCw, Wallet, AlertTriangle, Info, CheckCircle, RotateCw } from 'lucide-react';
import { useTon } from '@/contexts/ton-context';
import { TonConnectionStatus } from '@/lib/ton/ton-service';

const StateIndicator = ({ state, title, error = false, warning = false }: { state: string; title: string; error?: boolean; warning?: boolean }) => {
  return (
    <div className={`flex items-center gap-2 p-2 rounded-lg bg-[#1A1A1A] border ${error ? 'border-red-500/30' : warning ? 'border-amber-500/30' : 'border-[#333333]'}`}>
      <div className="text-xs font-medium text-gray-400">{title}:</div>
      <div className={`text-xs font-mono px-2 py-1 rounded ${error ? 'bg-red-950/40 text-red-200' : warning ? 'bg-amber-950/40 text-amber-200' : 'bg-[#121212] text-gray-200'}`}>{state}</div>
    </div>
  );
};

const TonWalletController: React.FC = () => {
  const { 
    isConnected, 
    isConnecting, 
    walletInfo, 
    connectionStatus, 
    metadata,
    transactionHistory,
    connect, 
    disconnect,
    saveSession,
    restoreSession,
    clearSession
  } = useTon();

  const [isProcessing, setIsProcessing] = useState(false);
  const [operationResult, setOperationResult] = useState<{ success: boolean; message: string } | null>(null);
  const [showSessionDetails, setShowSessionDetails] = useState(false);
  const [showDebugInfo, setShowDebugInfo] = useState(false);

  // Auto-restore session when component mounts
  useEffect(() => {
    console.log('TonWalletController mounted, checking connection status...');
    
    const attemptSessionRestoration = async () => {
      // Only attempt to restore if we're not already connected or connecting
      if (connectionStatus === TonConnectionStatus.DISCONNECTED && !isConnecting) {
        console.log('Not connected, attempting to restore wallet session');
        try {
          const restored = await restoreSession();
          console.log('Session restoration attempt result:', restored);
        } catch (error) {
          console.error('Error during automatic session restoration:', error);
        }
      } else {
        console.log('Already connected or connecting, skipping session restoration');
      }
    };
    
    attemptSessionRestoration();
  }, [connectionStatus, isConnecting, restoreSession]);

  // Clean previously saved states
  const handleClearSession = async () => {
    setIsProcessing(true);
    setOperationResult(null);

    try {
      await clearSession();
      setOperationResult({ success: true, message: 'Session cleared successfully' });
    } catch (error: any) {
      setOperationResult({ success: false, message: `Failed to clear session: ${error.message}` });
    } finally {
      setIsProcessing(false);
    }
  };

  // Force page reload to reset all TON Connect state
  const handleForceReload = () => {
    // First clear any localStorage items that might prevent clean reconnection
    try {
      const tonKeys = Object.keys(localStorage).filter(key => 
        key.toLowerCase().includes('ton') || 
        key.toLowerCase().includes('connect') ||
        key.toLowerCase().includes('wallet')
      );
      
      if (tonKeys.length > 0) {
        console.log(`Clearing ${tonKeys.length} TON-related localStorage items before reload`);
        tonKeys.forEach(key => localStorage.removeItem(key));
        setOperationResult({ 
          success: true, 
          message: `Cleared ${tonKeys.length} TON wallet items. Reloading page...`
        });
      } else {
        setOperationResult({ 
          success: true, 
          message: 'No TON wallet data found. Reloading page anyway...'
        });
      }
    } catch (e) {
      console.error('Error clearing localStorage before reload:', e);
    }
    
    // Delay reload slightly to show feedback message
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  // Connect to wallet
  const handleConnect = async () => {
    setIsProcessing(true);
    setOperationResult(null);

    try {
      const result = await connect();
      setOperationResult({ 
        success: result, 
        message: result ? 'Connected successfully' : 'Connection failed' 
      });
    } catch (error: any) {
      setOperationResult({ success: false, message: `Connection error: ${error.message}` });
    } finally {
      setIsProcessing(false);
    }
  };

  // Disconnect from wallet
  const handleDisconnect = async () => {
    setIsProcessing(true);
    setOperationResult(null);

    try {
      const result = await disconnect();
      setOperationResult({ 
        success: result, 
        message: result ? 'Disconnected successfully' : 'Disconnection failed' 
      });
    } catch (error: any) {
      setOperationResult({ success: false, message: `Disconnection error: ${error.message}` });
    } finally {
      setIsProcessing(false);
    }
  };

  // Save current session
  const handleSaveSession = async () => {
    setIsProcessing(true);
    setOperationResult(null);

    try {
      const result = await saveSession();
      setOperationResult({ 
        success: result, 
        message: result ? 'Session saved successfully' : 'Failed to save session' 
      });
    } catch (error: any) {
      setOperationResult({ success: false, message: `Save session error: ${error.message}` });
    } finally {
      setIsProcessing(false);
    }
  };

  // Restore previous session
  const handleRestoreSession = async () => {
    setIsProcessing(true);
    setOperationResult(null);

    try {
      const result = await restoreSession();
      setOperationResult({ 
        success: result, 
        message: result ? 'Session restored successfully' : 'No session to restore' 
      });
    } catch (error: any) {
      setOperationResult({ success: false, message: `Restore session error: ${error.message}` });
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

  // Get connection status as string
  const getConnectionStatusDisplay = (): string => {
    switch (connectionStatus) {
      case TonConnectionStatus.CONNECTED:
        return 'CONNECTED';
      case TonConnectionStatus.CONNECTING:
        return 'CONNECTING';
      case TonConnectionStatus.DISCONNECTED:
        return 'DISCONNECTED';
      default:
        return 'UNKNOWN';
    }
  };

  // Render session details if available
  const renderSessionDetails = () => {
    if (!showSessionDetails) {
      return null;
    }

    return (
      <div className="space-y-2 mt-4 p-3 border border-[#6B00D7]/20 rounded-md bg-[#121212]/40">
        <h4 className="text-sm font-medium text-white mb-2">Session Details</h4>
        
        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-start">
            <span className="text-gray-400">Last Connected:</span>
            <span className="text-gray-200 font-mono">
              {metadata?.lastConnected 
                ? new Date(metadata.lastConnected).toLocaleString()
                : 'Never'}
            </span>
          </div>
          
          <div className="flex justify-between items-start">
            <span className="text-gray-400">Connector Type:</span>
            <span className="text-gray-200 font-mono">{metadata?.connectorType || 'Unknown'}</span>
          </div>
          
          <div className="flex justify-between items-start">
            <span className="text-gray-400">Transaction History:</span>
            <span className="text-gray-200 font-mono">{transactionHistory?.length || 0} records</span>
          </div>
        </div>
      </div>
    );
  };

  // Render debug information
  const renderDebugInfo = () => {
    if (!showDebugInfo) {
      return null;
    }

    const localStorageKeys = Object.keys(localStorage).filter(key => 
      key.toLowerCase().includes('ton') || 
      key.toLowerCase().includes('connect') ||
      key.toLowerCase().includes('wallet')
    );

    // Format localStorage key data for better readability
    const formatLocalStorageData = (key: string) => {
      try {
        const value = localStorage.getItem(key);
        if (!value) return 'null';
        
        try {
          // Try to parse and pretty print JSON
          const parsed = JSON.parse(value);
          return JSON.stringify(parsed, null, 2);
        } catch {
          // If not JSON, return as is
          return value;
        }
      } catch (e) {
        return 'Error reading value';
      }
    };

    return (
      <div className="space-y-2 mt-4 p-3 border border-amber-700/20 rounded-md bg-amber-950/20">
        <div className="flex justify-between items-center">
          <h4 className="text-sm font-medium text-amber-200">Wallet Debug Information</h4>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 text-[10px] text-amber-300 hover:text-amber-200 hover:bg-amber-950/30"
            onClick={() => {
              try {
                localStorageKeys.forEach(key => localStorage.removeItem(key));
                setOperationResult({ 
                  success: true, 
                  message: `Cleared all ${localStorageKeys.length} TON-related items` 
                });
                // Force refresh the view
                setShowDebugInfo(false);
                setTimeout(() => setShowDebugInfo(true), 100);
              } catch (e: any) {
                setOperationResult({ 
                  success: false, 
                  message: `Failed to clear keys: ${e.message}` 
                });
              }
            }}
          >
            Clear All
          </Button>
        </div>
        
        {localStorageKeys.length === 0 ? (
          <div className="text-amber-300 text-xs italic p-2 bg-amber-950/30 rounded-md">
            No TON wallet data found in localStorage
          </div>
        ) : (
          <div className="space-y-2 text-xs mt-2">
            {/* Display current wallet state first */}
            <div className="p-2 bg-amber-950/30 rounded-md">
              <h5 className="font-medium text-amber-200 mb-1">Current Wallet State:</h5>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                <span className="text-amber-300">Connection Status:</span>
                <span className="text-amber-100 font-mono">{getConnectionStatusDisplay()}</span>
                
                <span className="text-amber-300">Is Connected:</span>
                <span className="text-amber-100 font-mono">{isConnected ? 'true' : 'false'}</span>
                
                <span className="text-amber-300">Is Connecting:</span>
                <span className="text-amber-100 font-mono">{isConnecting ? 'true' : 'false'}</span>
                
                <span className="text-amber-300">Wallet Address:</span>
                <span className="text-amber-100 font-mono break-all">
                  {walletInfo?.address || 'none'}
                </span>
                
                <span className="text-amber-300">Network:</span>
                <span className="text-amber-100 font-mono">{walletInfo?.network || 'unknown'}</span>
              </div>
            </div>
            
            {/* Then show localStorage items */}
            <h5 className="font-medium text-amber-200 mt-2">LocalStorage Data:</h5>
            <div className="space-y-2">
              {localStorageKeys.map(key => (
                <div key={key} className="flex flex-col gap-1 p-2 bg-amber-950/20 rounded border border-amber-900/30">
                  <div className="flex justify-between items-center">
                    <span className="text-amber-400 font-mono">{key}</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 text-[10px] text-amber-300 hover:text-amber-200 hover:bg-amber-950/30"
                      onClick={() => {
                        try {
                          localStorage.removeItem(key);
                          setOperationResult({ 
                            success: true, 
                            message: `LocalStorage key '${key}' removed` 
                          });
                          // Force refresh the view
                          setShowDebugInfo(false);
                          setTimeout(() => setShowDebugInfo(true), 100);
                        } catch (e: any) {
                          setOperationResult({ 
                            success: false, 
                            message: `Failed to remove key: ${e.message}` 
                          });
                        }
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                  <div className="bg-[#121212] p-2 rounded-sm overflow-x-auto max-h-32 whitespace-pre-wrap">
                    <code className="text-[10px] text-amber-100">
                      {formatLocalStorageData(key)}
                    </code>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="border border-[#6B00D7]/30 bg-gradient-to-br from-[#121212]/80 to-[#1A1A1A]/80 backdrop-blur-sm">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-white">TON Wallet Controller</CardTitle>
            <CardDescription className="text-gray-400">
              Advanced connection management and debugging
            </CardDescription>
          </div>
          {isConnected && isTestnet && (
            <div className="px-2 py-1 text-xs font-medium bg-amber-500/20 border border-amber-500/30 text-amber-300 rounded-full">
              Testnet
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Connection Status */}
        <div className="grid grid-cols-2 gap-2">
          <StateIndicator 
            state={getConnectionStatusDisplay()} 
            title="Status" 
            warning={connectionStatus === TonConnectionStatus.CONNECTING}
            error={connectionStatus !== TonConnectionStatus.CONNECTED && !isConnecting} 
          />
          <StateIndicator 
            state={isConnected ? 'TRUE' : 'FALSE'} 
            title="Connected" 
            error={!isConnected} 
          />
          <StateIndicator 
            state={isConnecting ? 'TRUE' : 'FALSE'} 
            title="Connecting" 
            warning={isConnecting} 
          />
          <StateIndicator 
            state={walletInfo ? formatAddress(walletInfo.address) : 'NONE'} 
            title="Address" 
            error={!walletInfo} 
          />
        </div>

        {/* Connection Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={handleConnect}
            disabled={isProcessing || connectionStatus === TonConnectionStatus.CONNECTING}
            className="bg-gradient-to-r from-[#6B00D7] to-[#8C00D7] hover:from-[#7B10E7] hover:to-[#9C10E7] text-white"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Wallet className="h-4 w-4 mr-2" />
                Connect Wallet
              </>
            )}
          </Button>

          <Button
            onClick={handleDisconnect}
            disabled={isProcessing || !isConnected}
            variant="destructive"
            className="bg-red-900/80 hover:bg-red-800 border-red-700/30"
          >
            <Power className="h-4 w-4 mr-2" />
            Disconnect
          </Button>
          
          <Button
            onClick={handleSaveSession}
            disabled={isProcessing || !isConnected}
            variant="outline"
            className="border-[#6B00D7]/30 text-white hover:bg-[#6B00D7]/10"
          >
            Save Session
          </Button>
          
          <Button
            onClick={handleRestoreSession}
            disabled={isProcessing}
            variant="outline"
            className="border-[#6B00D7]/30 text-white hover:bg-[#6B00D7]/10"
          >
            Restore Session
          </Button>
          
          <Button
            onClick={handleClearSession}
            disabled={isProcessing}
            variant="outline"
            className="border-red-500/30 text-red-400 hover:text-red-300 hover:bg-red-950/20 col-span-1"
          >
            Clear Session
          </Button>
          
          <Button
            onClick={handleForceReload}
            disabled={isProcessing}
            variant="outline"
            className="border-amber-500/30 text-amber-400 hover:text-amber-300 hover:bg-amber-950/20 col-span-1"
          >
            <RotateCw className="h-4 w-4 mr-2" />
            Force Reload
          </Button>
        </div>

        {/* Status & Error Messages */}
        {operationResult && (
          <Alert 
            variant={operationResult.success ? "default" : "destructive"}
            className={operationResult.success 
              ? "bg-green-950/30 border-green-700/50" 
              : "bg-red-950/30 border-red-700/50"}
          >
            {operationResult.success 
              ? <CheckCircle className="h-4 w-4" /> 
              : <AlertTriangle className="h-4 w-4" />}
            <AlertTitle>{operationResult.success ? "Success" : "Error"}</AlertTitle>
            <AlertDescription>{operationResult.message}</AlertDescription>
          </Alert>
        )}

        {/* Toggle buttons for additional information */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => setShowSessionDetails(!showSessionDetails)}
            variant="ghost"
            className="bg-[#1A1A1A] hover:bg-[#252525] border border-[#333333] text-gray-300"
            size="sm"
          >
            <Info className="h-4 w-4 mr-2" />
            {showSessionDetails ? 'Hide' : 'Show'} Session Details
          </Button>
          
          <Button
            onClick={() => setShowDebugInfo(!showDebugInfo)}
            variant="ghost"
            className="bg-[#1A1A1A] hover:bg-[#252525] border border-[#333333] text-gray-300"
            size="sm"
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            {showDebugInfo ? 'Hide' : 'Show'} Debug Info
          </Button>
        </div>

        {/* Expandable sections */}
        {renderSessionDetails()}
        {renderDebugInfo()}
      </CardContent>
      
      <CardFooter className="flex flex-col items-start text-xs text-gray-400 pt-2 border-t border-[#6B00D7]/10">
        <p>Advanced TON wallet controller for testing and debugging connection issues.</p>
      </CardFooter>
    </Card>
  );
};

export default TonWalletController;
