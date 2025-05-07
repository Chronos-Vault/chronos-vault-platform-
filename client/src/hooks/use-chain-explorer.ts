import { useCallback } from "react";
import { BlockchainType } from "@/lib/cross-chain/types";

// Define explorer URLs for different blockchain networks
const EXPLORER_URLS = {
  ETH: {
    mainnet: {
      address: "https://etherscan.io/address/",
      transaction: "https://etherscan.io/tx/",
      token: "https://etherscan.io/token/",
      block: "https://etherscan.io/block/",
    },
    testnet: {
      address: "https://sepolia.etherscan.io/address/",
      transaction: "https://sepolia.etherscan.io/tx/",
      token: "https://sepolia.etherscan.io/token/",
      block: "https://sepolia.etherscan.io/block/",
    },
  },
  SOL: {
    mainnet: {
      address: "https://explorer.solana.com/address/",
      transaction: "https://explorer.solana.com/tx/",
      token: "https://explorer.solana.com/token/",
      block: "https://explorer.solana.com/block/",
    },
    testnet: {
      address: "https://explorer.solana.com/address/?cluster=devnet",
      transaction: "https://explorer.solana.com/tx/?cluster=devnet",
      token: "https://explorer.solana.com/token/?cluster=devnet",
      block: "https://explorer.solana.com/block/?cluster=devnet",
    },
  },
  TON: {
    mainnet: {
      address: "https://tonscan.org/address/",
      transaction: "https://tonscan.org/tx/",
      token: "https://tonscan.org/jetton/",
      block: "https://tonscan.org/block/",
    },
    testnet: {
      address: "https://testnet.tonscan.org/address/",
      transaction: "https://testnet.tonscan.org/tx/",
      token: "https://testnet.tonscan.org/jetton/",
      block: "https://testnet.tonscan.org/block/",
    },
  },
  // Additional blockchain explorers can be added here
};

export function useChainExplorer() {
  const isTestnet = true; // In production, this would be determined by environment or config

  const getExplorerUrl = useCallback((
    blockchain: BlockchainType,
    type: "address" | "transaction" | "token" | "block",
    value: string
  ): string | null => {
    const network = isTestnet ? "testnet" : "mainnet";
    
    // Handle special case for Solana devnet explorer
    if (blockchain === "SOL" && isTestnet) {
      // For Solana, we need to append the value differently due to cluster parameter
      const baseUrl = EXPLORER_URLS[blockchain][network][type];
      if (baseUrl.includes("?cluster=")) {
        const [url, params] = baseUrl.split("?");
        return `${url}/${value}?${params}`;
      }
    }
    
    // Standard case for other blockchains
    if (EXPLORER_URLS[blockchain]?.[network]?.[type]) {
      return `${EXPLORER_URLS[blockchain][network][type]}${value}`;
    }
    
    return null;
  }, [isTestnet]);

  const formatAddress = useCallback((
    blockchain: BlockchainType, 
    address: string, 
    length: number = 8
  ): string => {
    if (!address) return "";
    
    if (address.length <= length * 2) return address;
    
    return `${address.slice(0, length)}...${address.slice(-length)}`;
  }, []);

  return {
    getExplorerUrl,
    formatAddress,
  };
}