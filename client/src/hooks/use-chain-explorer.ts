import { useMemo } from 'react';
import { BlockchainType } from '@/lib/cross-chain/types';

/**
 * Chain explorer configuration for Ethereum, Solana, and TON
 */
const chainExplorers: Record<BlockchainType, {
  name: string;
  logo: string;
  mainnet: {
    url: string;
    address: string;
    transaction: string;
    token: string;
    block: string;
  };
  testnet: {
    url: string;
    address: string;
    transaction: string;
    token: string;
    block: string;
  };
}> = {
  ETH: {
    name: 'Etherscan',
    logo: 'https://etherscan.io/assets/svg/logos/logo-etherscan.svg',
    mainnet: {
      url: 'https://etherscan.io',
      address: '/address/',
      transaction: '/tx/',
      token: '/token/',
      block: '/block/'
    },
    testnet: {
      url: 'https://sepolia.etherscan.io',
      address: '/address/',
      transaction: '/tx/',
      token: '/token/',
      block: '/block/'
    }
  },
  SOL: {
    name: 'Solscan',
    logo: 'https://solscan.io/static/media/solana-sol-logo.b612f140.svg',
    mainnet: {
      url: 'https://solscan.io',
      address: '/account/',
      transaction: '/tx/',
      token: '/token/',
      block: '/block/'
    },
    testnet: {
      url: 'https://solscan.io',
      address: '/account/',
      transaction: '/tx/',
      token: '/token/',
      block: '/block/'
    }
  },
  TON: {
    name: 'TON Explorer',
    logo: 'https://ton.org/images/toncoin_symbol.svg',
    mainnet: {
      url: 'https://tonscan.org',
      address: '/address/',
      transaction: '/tx/',
      token: '/jetton/',
      block: '/block/'
    },
    testnet: {
      url: 'https://testnet.tonscan.org',
      address: '/address/',
      transaction: '/tx/',
      token: '/jetton/',
      block: '/block/'
    }
  }
};

/**
 * Hook for interacting with blockchain explorers
 */
export const useChainExplorer = (blockchain: BlockchainType, useTestnet = true) => {
  const explorer = useMemo(() => {
    const network = useTestnet ? 'testnet' : 'mainnet';
    return {
      name: chainExplorers[blockchain].name,
      logo: chainExplorers[blockchain].logo,
      baseUrl: chainExplorers[blockchain][network].url,
      getAddressUrl: (address: string) => `${chainExplorers[blockchain][network].url}${chainExplorers[blockchain][network].address}${address}`,
      getTransactionUrl: (txHash: string) => `${chainExplorers[blockchain][network].url}${chainExplorers[blockchain][network].transaction}${txHash}`,
      getTokenUrl: (tokenAddress: string) => `${chainExplorers[blockchain][network].url}${chainExplorers[blockchain][network].token}${tokenAddress}`,
      getBlockUrl: (blockNumber: string | number) => `${chainExplorers[blockchain][network].url}${chainExplorers[blockchain][network].block}${blockNumber}`,
      formatAddress: (address: string) => {
        if (!address) return '';
        if (address.length <= 16) return address;
        return `${address.substring(0, 8)}...${address.substring(address.length - 8)}`;
      }
    };
  }, [blockchain, useTestnet]);

  return explorer;
};

export default useChainExplorer;