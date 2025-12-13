import { createConfig, http } from 'wagmi';
import { mainnet, sepolia, arbitrumSepolia } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';

export enum BlockchainType {
  ETHEREUM = "ethereum",
  SOLANA = "solana",
  TON = "ton",
  BITCOIN = "bitcoin"
}

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '3e8a6b60fc41c88a30e73ad3a2b03d92';

export const chains = [arbitrumSepolia, sepolia, mainnet] as const;

export const wagmiConfig = createConfig({
  chains: [arbitrumSepolia, sepolia, mainnet],
  transports: {
    [arbitrumSepolia.id]: http(),
    [sepolia.id]: http(),
    [mainnet.id]: http(),
  },
  connectors: [
    injected({ shimDisconnect: true }),
    walletConnect({ 
      projectId,
      showQrModal: true,
      metadata: {
        name: 'Chronos Vault - Trinity Protocol™',
        description: 'Enterprise-grade multi-chain vault system powered by Trinity Protocol™ v3.5.23. 2-of-3 consensus security across Arbitrum, Solana, and TON.',
        url: 'https://chronosvault.org',
        icons: ['https://chronosvault.org/logo.png']
      }
    }),
  ],
});

export const chainIds = {
  arbitrumSepolia: arbitrumSepolia.id,
  sepolia: sepolia.id,
  mainnet: mainnet.id
};
