// Error handling utilities for blockchain connections

// Chain identifiers
export const CHAIN_TON = 'TON';
export const CHAIN_ETHEREUM = 'ETHEREUM';
export const CHAIN_SOLANA = 'SOLANA';
export const CHAIN_BITCOIN = 'BITCOIN';

// Error types
export interface ChainError {
  chain: string;
  message: string;
  critical: boolean;
  timestamp?: number;
  errorCode?: string;
}

// In-memory store for chain errors
const errorStore: Record<string, ChainError[]> = {
  [CHAIN_TON]: [],
  [CHAIN_ETHEREUM]: [],
  [CHAIN_SOLANA]: [],
  [CHAIN_BITCOIN]: [],
};

/**
 * Add an error to the chain-specific error store
 */
export function addError(error: ChainError): void {
  if (!error.chain || !errorStore[error.chain]) {
    console.error('Attempted to add error for unknown chain:', error);
    return;
  }
  
  errorStore[error.chain].push({
    ...error,
    timestamp: error.timestamp || Date.now(),
  });
  
  // Limit number of errors stored (keep most recent)
  const maxErrors = 10;
  if (errorStore[error.chain].length > maxErrors) {
    errorStore[error.chain] = errorStore[error.chain].slice(-maxErrors);
  }
  
  // Log critical errors to console
  if (error.critical) {
    console.error(`Critical ${error.chain} error:`, error.message);
  }
}

/**
 * Get all errors for a specific chain
 */
export function getChainErrors(chain: string): ChainError[] {
  if (!chain || !errorStore[chain]) {
    return [];
  }
  
  return [...errorStore[chain]];
}

/**
 * Get the most recent error for a specific chain
 */
export function getLatestChainError(chain: string): ChainError | null {
  const errors = getChainErrors(chain);
  if (errors.length === 0) {
    return null;
  }
  
  // Sort by timestamp desc and return the first
  return errors.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))[0];
}

/**
 * Clear all errors for a specific chain
 */
export function clearChainErrors(chain: string): void {
  if (!chain || !errorStore[chain]) {
    return;
  }
  
  errorStore[chain] = [];
}

/**
 * Check if a chain has any critical errors
 */
export function hasCriticalErrors(chain: string): boolean {
  if (!chain || !errorStore[chain]) {
    return false;
  }
  
  return errorStore[chain].some(error => error.critical);
}

/**
 * Get all critical errors across all chains
 */
export function getAllCriticalErrors(): ChainError[] {
  const allChains = Object.keys(errorStore);
  
  return allChains.flatMap(chain => 
    errorStore[chain].filter(error => error.critical)
  );
}