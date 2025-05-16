/**
 * Chain Explorer Hook
 * 
 * Provides blockchain explorer utilities for different chains
 */
import { useCallback } from 'react';
import { BlockchainType } from '@shared/schema';

export type ChainExplorer = {
  name: string;
  logo: string;
  baseUrl: string;
  getAddressUrl: (address: string) => string;
  getTransactionUrl: (txHash: string) => string;
  getTokenUrl: (tokenAddress: string) => string;
  getBlockUrl: (blockNumber: string | number) => string;
  formatAddress: (address: string) => string;
};

/**
 * Chain explorer configuration for Ethereum, Solana, and TON
 */
const explorers: Record<BlockchainType, ChainExplorer> = {
  ETH: {
    name: 'Etherscan',
    logo: '/blockchain/etherscan.svg',
    baseUrl: 'https://sepolia.etherscan.io',
    getAddressUrl: (address) => `https://sepolia.etherscan.io/address/${address}`,
    getTransactionUrl: (txHash) => `https://sepolia.etherscan.io/tx/${txHash}`,
    getTokenUrl: (tokenAddress) => `https://sepolia.etherscan.io/token/${tokenAddress}`,
    getBlockUrl: (blockNumber) => `https://sepolia.etherscan.io/block/${blockNumber}`,
    formatAddress: (address) => {
      if (!address) return '';
      if (address.length <= 13) return address;
      return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }
  },
  SOL: {
    name: 'Solana Explorer',
    logo: '/blockchain/solana-explorer.svg',
    baseUrl: 'https://explorer.solana.com',
    getAddressUrl: (address) => `https://explorer.solana.com/address/${address}?cluster=devnet`,
    getTransactionUrl: (txHash) => `https://explorer.solana.com/tx/${txHash}?cluster=devnet`,
    getTokenUrl: (tokenAddress) => `https://explorer.solana.com/address/${tokenAddress}?cluster=devnet`,
    getBlockUrl: (blockNumber) => `https://explorer.solana.com/block/${blockNumber}?cluster=devnet`,
    formatAddress: (address) => {
      if (!address) return '';
      if (address.length <= 13) return address;
      return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }
  },
  TON: {
    name: 'TONscan',
    logo: '/blockchain/tonscan.svg',
    baseUrl: 'https://testnet.tonscan.org',
    getAddressUrl: (address) => `https://testnet.tonscan.org/address/${address}`,
    getTransactionUrl: (txHash) => `https://testnet.tonscan.org/tx/${txHash}`,
    getTokenUrl: (tokenAddress) => `https://testnet.tonscan.org/jetton/${tokenAddress}`,
    getBlockUrl: (blockNumber) => `https://testnet.tonscan.org/block/${blockNumber}`,
    formatAddress: (address) => {
      if (!address) return '';
      if (address.length <= 13) return address;
      return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }
  }
};

/**
 * Hook to get explorer utilities for a specific blockchain
 */
export const useChainExplorer = (blockchain: BlockchainType, useProdUrls = false): ChainExplorer => {
  // Generate production URLs if requested
  const getProductionExplorer = useCallback((chain: BlockchainType): ChainExplorer => {
    const explorer = { ...explorers[chain] };
    
    switch (chain) {
      case 'ETH':
        explorer.baseUrl = 'https://etherscan.io';
        explorer.getAddressUrl = (address) => `https://etherscan.io/address/${address}`;
        explorer.getTransactionUrl = (txHash) => `https://etherscan.io/tx/${txHash}`;
        explorer.getTokenUrl = (tokenAddress) => `https://etherscan.io/token/${tokenAddress}`;
        explorer.getBlockUrl = (blockNumber) => `https://etherscan.io/block/${blockNumber}`;
        break;
      case 'SOL':
        explorer.baseUrl = 'https://explorer.solana.com';
        explorer.getAddressUrl = (address) => `https://explorer.solana.com/address/${address}`;
        explorer.getTransactionUrl = (txHash) => `https://explorer.solana.com/tx/${txHash}`;
        explorer.getTokenUrl = (tokenAddress) => `https://explorer.solana.com/address/${tokenAddress}`;
        explorer.getBlockUrl = (blockNumber) => `https://explorer.solana.com/block/${blockNumber}`;
        break;
      case 'TON':
        explorer.baseUrl = 'https://tonscan.org';
        explorer.getAddressUrl = (address) => `https://tonscan.org/address/${address}`;
        explorer.getTransactionUrl = (txHash) => `https://tonscan.org/tx/${txHash}`;
        explorer.getTokenUrl = (tokenAddress) => `https://tonscan.org/jetton/${tokenAddress}`;
        explorer.getBlockUrl = (blockNumber) => `https://tonscan.org/block/${blockNumber}`;
        break;
    }
    
    return explorer;
  }, []);
  
  // Return either the test or production explorer based on the flag
  return useProdUrls ? getProductionExplorer(blockchain) : explorers[blockchain];
};

/**
 * Utility to get explorer URL for a specific blockchain entity
 */
export const getExplorerUrl = (
  blockchain: BlockchainType,
  type: 'address' | 'transaction' | 'token' | 'block',
  value: string | number
): string => {
  const explorer = explorers[blockchain];
  
  switch (type) {
    case 'address':
      return explorer.getAddressUrl(value.toString());
    case 'transaction':
      return explorer.getTransactionUrl(value.toString());
    case 'token':
      return explorer.getTokenUrl(value.toString());
    case 'block':
      return explorer.getBlockUrl(value);
    default:
      return explorer.baseUrl;
  }
};

export default useChainExplorer;