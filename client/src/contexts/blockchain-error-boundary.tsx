import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useDevMode } from './dev-mode-context';
import { useTon } from './ton-context';

export type BlockchainChain = 'Ethereum' | 'Solana' | 'TON' | 'Bitcoin';

export interface BlockchainError {
  chain: BlockchainChain;
  message: string;
  critical: boolean;
  timestamp?: number;
}

interface BlockchainErrorContextType {
  errors: BlockchainError[];
  addError: (error: BlockchainError) => void;
  clearError: (index: number) => void;
  clearChainErrors: (chain: BlockchainChain) => void;
  clearAllErrors: () => void;
}

const BlockchainErrorContext = createContext<BlockchainErrorContextType | undefined>(undefined);

export const useBlockchainErrors = () => {
  const context = useContext(BlockchainErrorContext);
  if (!context) {
    throw new Error('useBlockchainErrors must be used within a BlockchainErrorProvider');
  }
  return context;
};

export const BlockchainErrorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [errors, setErrors] = useState<BlockchainError[]>([]);
  const { devModeEnabled } = useDevMode();

  const addError = (error: BlockchainError) => {
    // Add timestamp if not provided
    if (!error.timestamp) {
      error.timestamp = Date.now();
    }
    
    // Don't add duplicate errors (same chain and message)
    const isDuplicate = errors.some(
      (existingError) => 
        existingError.chain === error.chain && 
        existingError.message === error.message
    );
    
    if (!isDuplicate) {
      setErrors((prev) => [...prev, error]);
      
      // Log error in development mode
      if (devModeEnabled) {
        console.warn(`Blockchain Error (${error.chain}): ${error.message}`);
      }
    }
  };

  const clearError = (index: number) => {
    setErrors((prev) => prev.filter((_, i) => i !== index));
  };

  const clearChainErrors = (chain: BlockchainChain) => {
    setErrors((prev) => prev.filter((error) => error.chain !== chain));
  };

  const clearAllErrors = () => {
    setErrors([]);
  };

  const contextValue: BlockchainErrorContextType = {
    errors,
    addError,
    clearError,
    clearChainErrors,
    clearAllErrors,
  };

  return (
    <BlockchainErrorContext.Provider value={contextValue}>
      {children}
    </BlockchainErrorContext.Provider>
  );
};

// Display component for blockchain errors
export const BlockchainErrorDisplay: React.FC = () => {
  const { errors, clearError, clearChainErrors } = useBlockchainErrors();
  const { devModeEnabled } = useDevMode();
  const [retrying, setRetrying] = useState<Record<string, boolean>>({});

  // Get the TON context hooks 
  const { retryTonConnection, manualRetryInProgress } = useTon();

  if (errors.length === 0) {
    return null;
  }
  
  // Handle retry for a specific blockchain
  const handleRetry = async (chain: BlockchainChain, index: number) => {
    // If already retrying (from context state), don't trigger another retry
    if (retrying[chain]) return;
    
    // Set retrying state for this chain
    setRetrying(prev => ({ ...prev, [chain]: true }));
    
    // Log retry attempt
    console.log(`Attempting to reconnect to ${chain}...`);
    
    try {
      // Call the appropriate retry function based on the blockchain
      let success = false;
      
      if (chain === 'TON') {
        // Use the TON context's retry functionality
        success = await retryTonConnection();
      } else if (chain === 'Ethereum') {
        // Ethereum retry logic would go here
        // For now we'll just simulate a retry
        await new Promise(resolve => setTimeout(resolve, 1500));
        clearChainErrors(chain);
        success = true;
      } else if (chain === 'Solana') {
        // Solana retry logic would go here
        // For now we'll just simulate a retry
        await new Promise(resolve => setTimeout(resolve, 1500));
        clearChainErrors(chain);
        success = true;
      } else if (chain === 'Bitcoin') {
        // Bitcoin retry logic would go here
        // For now we'll just simulate a retry
        await new Promise(resolve => setTimeout(resolve, 1500));
        clearChainErrors(chain);
        success = true;
      }
      
      console.log(`${chain} reconnection attempt ${success ? 'succeeded' : 'failed'}`);
      
      // If not successful, we'll leave the error in place to allow for another retry
      if (success) {
        clearChainErrors(chain);
      }
    } catch (error) {
      console.error(`Error during ${chain} retry:`, error);
    } finally {
      // Always reset our local retrying state
      setRetrying(prev => ({ ...prev, [chain]: false }));
    }
  };
  
  // Group errors by blockchain
  const errorsByChain: Record<BlockchainChain, BlockchainError[]> = {} as any;
  errors.forEach(error => {
    if (!errorsByChain[error.chain]) {
      errorsByChain[error.chain] = [];
    }
    errorsByChain[error.chain].push(error);
  });

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 max-w-md">
      {Object.entries(errorsByChain).map(([chain, chainErrors]) => {
        const isCritical = chainErrors.some(err => err.critical);
        // Check both our local retrying state and the blockchain context's retry state
        const isRetrying = retrying[chain] || (chain === 'TON' && manualRetryInProgress);
        
        return (
          <Alert
            key={`${chain}-group`}
            variant={isCritical ? "destructive" : "default"}
            className={`shadow-lg backdrop-blur-md bg-opacity-95 
              ${isCritical 
                ? 'border-red-500 bg-red-900/20 dark:bg-red-950/30' 
                : 'border-amber-500 bg-amber-900/20 dark:bg-amber-950/30'
              } rounded-xl transition-all duration-200 transform hover:translate-y-[-2px]`}
          >
            <div className="flex items-start">
              <AlertCircle className={`h-5 w-5 mr-2 mt-0.5 ${isCritical ? 'text-red-400' : 'text-amber-400'}`} />
              
              <div className="flex-1">
                <AlertTitle className="flex items-center justify-between font-semibold mb-1">
                  <span className="flex items-center gap-2">
                    <span className={isCritical ? 'text-red-300' : 'text-amber-300'}>
                      {chain} {isCritical ? 'Critical Error' : 'Connection Issue'}
                    </span>
                    {isRetrying && (
                      <span className="inline-block animate-spin text-xs">⟳</span>
                    )}
                  </span>
                  
                  <Button variant="ghost" size="sm" onClick={() => clearChainErrors(chain as BlockchainChain)}
                    className="h-6 w-6 p-0 rounded-full hover:bg-muted/40">
                    <X className="h-4 w-4" />
                  </Button>
                </AlertTitle>
                
                <AlertDescription className="text-sm">
                  <div className="mb-2">
                    {chainErrors.length > 1 
                      ? `${chainErrors.length} issues with ${chain} connection.` 
                      : chainErrors[0].message}
                  </div>
                  
                  <div className="flex gap-2 mt-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className={`text-xs ${isRetrying ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onClick={() => !isRetrying && handleRetry(chain as BlockchainChain, 0)}
                      disabled={isRetrying}
                    >
                      {isRetrying ? 'Reconnecting...' : 'Retry Connection'}
                    </Button>
                    <Button 
                      variant="link" 
                      size="sm"
                      className="text-xs px-0"
                      onClick={() => clearChainErrors(chain as BlockchainChain)}
                    >
                      Continue without {chain}
                    </Button>
                  </div>
                  
                  {devModeEnabled && (
                    <div className="mt-2 text-xs text-gray-500/70 italic">
                      {chainErrors.length > 1 && (
                        <details className="mt-1">
                          <summary className="cursor-pointer">Show all errors</summary>
                          <ul className="pl-4 mt-1 list-disc">
                            {chainErrors.map((err, i) => (
                              <li key={i} className="mt-1">{err.message}</li>
                            ))}
                          </ul>
                        </details>
                      )}
                      <div className="mt-1">In development mode - API requests may be simulated</div>
                    </div>
                  )}
                </AlertDescription>
              </div>
            </div>
          </Alert>
        );
      })}
    </div>
  );
};