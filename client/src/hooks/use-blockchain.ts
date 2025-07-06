/**
 * useBlockchain Hook
 * 
 * This hook provides a unified interface for connecting to and interacting with
 * different blockchain wallets (Ethereum, Solana, TON, and Bitcoin).
 * It acts as a compatibility layer to ensure old code works with the new wallet-context.
 */

import { useWallet, ChainType, ConnectedWallet } from '@/contexts/wallet-context';

// Re-export the ChainType for compatibility
export type { ChainType };

export function useBlockchain() {
  const wallet = useWallet();
  
  // Get the currently active wallet if one exists
  const activeWallet = wallet.activeChain ? wallet.connectedWallets[wallet.activeChain] : null;
  
  // Create the simplified API that the rest of the application expects
  return {
    // Current wallet state
    connectedWallet: activeWallet,
    activeChain: wallet.activeChain,
    
    // Connection status helpers
    isConnecting: wallet.activeChain ? wallet.status[wallet.activeChain] === 'connecting' : false,
    isConnected: wallet.activeChain ? wallet.status[wallet.activeChain] === 'connected' : false,
    
    // Simplified connection methods (automatically use active chain if none specified)
    connect: async (chain?: ChainType) => wallet.connect(chain || 'ton'),
    disconnect: async () => {
      if (wallet.activeChain) {
        return wallet.disconnect(wallet.activeChain);
      }
    },
    
    // Pass through all the other methods
    sendTransaction: wallet.sendTransaction,
    signMessage: wallet.signMessage,
    createVault: wallet.createVault,
    depositToVault: wallet.depositToVault,
    withdrawFromVault: wallet.withdrawFromVault,
    verifyCrossChain: wallet.verifyCrossChain,
    isDevelopmentMode: wallet.isDevelopmentMode,
    toggleDevelopmentMode: wallet.toggleDevelopmentMode,
    recentTransactions: wallet.recentTransactions
  };
}