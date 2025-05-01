import { createConfig, http } from 'wagmi';
import { mainnet, sepolia, goerli } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

// Define available chains with testnet focus for development
export const chains = [sepolia, goerli, mainnet];

// Get Ethereum RPC URL from environment
const getEthereumRpcUrl = (chainId: number) => {
  const rpcUrl = import.meta.env.VITE_ETHEREUM_RPC_URL;
  return rpcUrl ? http(rpcUrl) : http();
};

// Create wagmi config with testnet-first connectors
export const wagmiConfig = createConfig({
  chains: [sepolia, goerli, mainnet], // Prioritize testnets for development
  transports: {
    [sepolia.id]: getEthereumRpcUrl(sepolia.id),
    [goerli.id]: getEthereumRpcUrl(goerli.id),
    [mainnet.id]: getEthereumRpcUrl(mainnet.id),
  },
  connectors: [
    injected(),
  ],
});

// Chain IDs for reference
export const chainIds = {
  sepolia: sepolia.id,
  goerli: goerli.id,
  mainnet: mainnet.id
};
