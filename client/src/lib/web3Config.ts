import { createConfig, configureChains, mainnet, sepolia } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';

// Configure chains for the app
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, sepolia], // Include testnets for development
  [publicProvider()]
);

// WalletConnect requires a project ID
const projectId = 'YOUR_WALLET_CONNECT_PROJECT_ID'; // We'll replace this with an env variable later

// Set up connectors for different wallet providers
export const connectors = [
  new MetaMaskConnector({ chains }),
  new WalletConnectConnector({
    chains,
    options: {
      projectId,
      showQrModal: true,
    },
  }),
  new CoinbaseWalletConnector({
    chains,
    options: {
      appName: 'Chronos Vault',
    },
  }),
];

// Create wagmi config
export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

// Export everything needed for the app
export { chains };