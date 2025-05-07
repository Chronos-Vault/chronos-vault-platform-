import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useDevMode } from './dev-mode-context';

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
  const { errors, clearError } = useBlockchainErrors();
  const { devModeEnabled } = useDevMode();

  if (errors.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md">
      {errors.map((error, index) => (
        <Alert
          key={`${error.chain}-${error.timestamp}-${index}`}
          variant={error.critical ? "destructive" : "default"}
          className={`shadow-lg ${error.critical ? 'border-red-500' : 'border-amber-500'}`}
        >
          <AlertCircle className={`h-4 w-4 ${error.critical ? 'text-red-500' : 'text-amber-500'}`} />
          <AlertTitle className="flex items-center justify-between">
            <span>{error.chain} Connection Issue</span>
            <Button variant="ghost" size="sm" onClick={() => clearError(index)}>
              <X className="h-4 w-4" />
            </Button>
          </AlertTitle>
          <AlertDescription>
            {error.message}
            {devModeEnabled && (
              <div className="mt-2 text-xs text-gray-500">
                This error is displayed because you're in development mode.
              </div>
            )}
          </AlertDescription>
        </Alert>
      ))}
    </div>
  );
};