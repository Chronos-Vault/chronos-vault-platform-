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
const explorers: Record<BlockchainType, Record<'mainnet' | 'testnet', ChainExplorer>> = {
  ETH: {
    mainnet: {
      name: 'Etherscan',
      logo: '/assets/logos/etherscan.svg',
      baseUrl: 'https://etherscan.io',
      getAddressUrl: (address: string) => `https://etherscan.io/address/${address}`,
      getTransactionUrl: (txHash: string) => `https://etherscan.io/tx/${txHash}`,
      getTokenUrl: (tokenAddress: string) => `https://etherscan.io/token/${tokenAddress}`,
      getBlockUrl: (blockNumber: string | number) => `https://etherscan.io/block/${blockNumber}`,
      formatAddress: (address: string) => address.length > 10 ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : address,
    },
    testnet: {
      name: 'Sepolia Etherscan',
      logo: '/assets/logos/etherscan.svg',
      baseUrl: 'https://sepolia.etherscan.io',
      getAddressUrl: (address: string) => `https://sepolia.etherscan.io/address/${address}`,
      getTransactionUrl: (txHash: string) => `https://sepolia.etherscan.io/tx/${txHash}`,
      getTokenUrl: (tokenAddress: string) => `https://sepolia.etherscan.io/token/${tokenAddress}`,
      getBlockUrl: (blockNumber: string | number) => `https://sepolia.etherscan.io/block/${blockNumber}`,
      formatAddress: (address: string) => address.length > 10 ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : address,
    }
  },
  SOL: {
    mainnet: {
      name: 'Solscan',
      logo: '/assets/logos/solscan.svg',
      baseUrl: 'https://solscan.io',
      getAddressUrl: (address: string) => `https://solscan.io/account/${address}`,
      getTransactionUrl: (txHash: string) => `https://solscan.io/tx/${txHash}`,
      getTokenUrl: (tokenAddress: string) => `https://solscan.io/token/${tokenAddress}`,
      getBlockUrl: (blockNumber: string | number) => `https://solscan.io/block/${blockNumber}`,
      formatAddress: (address: string) => address.length > 10 ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : address,
    },
    testnet: {
      name: 'Solscan (Devnet)',
      logo: '/assets/logos/solscan.svg',
      baseUrl: 'https://solscan.io',
      getAddressUrl: (address: string) => `https://solscan.io/account/${address}?cluster=devnet`,
      getTransactionUrl: (txHash: string) => `https://solscan.io/tx/${txHash}?cluster=devnet`,
      getTokenUrl: (tokenAddress: string) => `https://solscan.io/token/${tokenAddress}?cluster=devnet`,
      getBlockUrl: (blockNumber: string | number) => `https://solscan.io/block/${blockNumber}?cluster=devnet`,
      formatAddress: (address: string) => address.length > 10 ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : address,
    }
  },
  TON: {
    mainnet: {
      name: 'TON Explorer',
      logo: '/assets/logos/ton-explorer.svg',
      baseUrl: 'https://tonscan.org',
      getAddressUrl: (address: string) => `https://tonscan.org/address/${address}`,
      getTransactionUrl: (txHash: string) => `https://tonscan.org/tx/${txHash}`,
      getTokenUrl: (tokenAddress: string) => `https://tonscan.org/jetton/${tokenAddress}`,
      getBlockUrl: (blockNumber: string | number) => `https://tonscan.org/block/${blockNumber}`,
      formatAddress: (address: string) => address.length > 10 ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : address,
    },
    testnet: {
      name: 'TON Testnet Explorer',
      logo: '/assets/logos/ton-explorer.svg',
      baseUrl: 'https://testnet.tonscan.org',
      getAddressUrl: (address) => `https://testnet.tonscan.org/address/${address}`,
      getTransactionUrl: (txHash) => `https://testnet.tonscan.org/tx/${txHash}`,
      getTokenUrl: (tokenAddress) => `https://testnet.tonscan.org/jetton/${tokenAddress}`,
      getBlockUrl: (blockNumber) => `https://testnet.tonscan.org/block/${blockNumber}`,
      formatAddress: (address) => address.length > 10 ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : address,
    }
  }
};

/**
 * Hook for interacting with blockchain explorers
 */
export const useChainExplorer = (blockchain: BlockchainType, useTestnet = true) => {
  const network = useTestnet ? 'testnet' : 'mainnet';
  const explorer = explorers[blockchain][network];

  const getExplorerLink = useCallback((type: 'address' | 'transaction' | 'token' | 'block', value: string | number) => {
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
        return '';
    }
  }, [explorer]);

  const formatAddress = useCallback((address: string) => {
    return explorer.formatAddress(address);
  }, [explorer]);

  return {
    explorer,
    getExplorerLink,
    formatAddress
  };
};