/**
 * Centralized Provider Factory
 * 
 * Provides lazy-initialized, shared ethers providers to avoid
 * multiple simultaneous RPC connections during startup.
 * 
 * This prevents rate-limit errors from overwhelming RPC endpoints.
 */

import { ethers } from 'ethers';

// Singleton providers - created on first use
let arbitrumProvider: ethers.JsonRpcProvider | null = null;
let ethereumProvider: ethers.JsonRpcProvider | null = null;

/**
 * Get the Arbitrum Sepolia provider (lazy initialization)
 * Uses paid Alchemy API if available, falls back to public RPCs
 */
export function getArbitrumProvider(): ethers.JsonRpcProvider {
  if (!arbitrumProvider) {
    const alchemyKey = process.env.ALCHEMY_API_KEY;
    const rpcUrl = alchemyKey 
      ? `https://arb-sepolia.g.alchemy.com/v2/${alchemyKey}`
      : (process.env.ARBITRUM_RPC_URL || 'https://sepolia-rollup.arbitrum.io/rpc');
    
    console.log(`[Provider Factory] Creating Arbitrum provider: ${rpcUrl.substring(0, 50)}...`);
    arbitrumProvider = new ethers.JsonRpcProvider(rpcUrl);
  }
  return arbitrumProvider;
}

/**
 * Get the Ethereum Sepolia provider (lazy initialization)
 */
export function getEthereumProvider(): ethers.JsonRpcProvider {
  if (!ethereumProvider) {
    const alchemyKey = process.env.ALCHEMY_API_KEY;
    const rpcUrl = alchemyKey 
      ? `https://eth-sepolia.g.alchemy.com/v2/${alchemyKey}`
      : (process.env.ETHEREUM_RPC_URL || 'https://ethereum-sepolia-rpc.publicnode.com');
    
    console.log(`[Provider Factory] Creating Ethereum provider: ${rpcUrl.substring(0, 50)}...`);
    ethereumProvider = new ethers.JsonRpcProvider(rpcUrl);
  }
  return ethereumProvider;
}

/**
 * Check if blockchain connections are available without blocking
 * Returns a promise that resolves to connection status
 */
export async function checkProviderHealth(): Promise<{
  arbitrum: boolean;
  ethereum: boolean;
}> {
  const results = { arbitrum: false, ethereum: false };
  
  try {
    const arbProvider = getArbitrumProvider();
    await Promise.race([
      arbProvider.getNetwork(),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 5000))
    ]);
    results.arbitrum = true;
  } catch {
    console.warn('[Provider Factory] Arbitrum provider not responding');
  }

  try {
    const ethProvider = getEthereumProvider();
    await Promise.race([
      ethProvider.getNetwork(),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 5000))
    ]);
    results.ethereum = true;
  } catch {
    console.warn('[Provider Factory] Ethereum provider not responding');
  }

  return results;
}

/**
 * Reset providers (useful for testing or reconnection)
 */
export function resetProviders(): void {
  arbitrumProvider = null;
  ethereumProvider = null;
}
