import React, { createContext, useContext, useState, useEffect } from 'react';
import { EthereumProvider } from '@walletconnect/ethereum-provider';

interface WalletConnectContextType {
  provider: EthereumProvider | null;
  account: string | null;
  chainId: number | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  isConnecting: boolean;
}

const WalletConnectContext = createContext<WalletConnectContextType | null>(null);

export const useWalletConnect = () => {
  const context = useContext(WalletConnectContext);
  if (!context) {
    throw new Error('useWalletConnect must be used within WalletConnectProvider');
  }
  return context;
};

interface WalletConnectProviderProps {
  children: React.ReactNode;
}

export const WalletConnectProvider: React.FC<WalletConnectProviderProps> = ({ children }) => {
  const [provider, setProvider] = useState<EthereumProvider | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    const initProvider = async () => {
      try {
        const walletConnectProvider = await EthereumProvider.init({
          projectId: 'f1a006966920cbcac785194f58b6e073',
          chains: [1, 11155111], // Mainnet and Sepolia
          showQrModal: true,
          metadata: {
            name: 'Chronos Vault',
            description: 'Secure Multi-Chain Vault Platform',
            url: window.location.origin,
            icons: [`${window.location.origin}/favicon.ico`]
          }
        });

        setProvider(walletConnectProvider);

        // Subscribe to events
        walletConnectProvider.on('accountsChanged', (accounts: string[]) => {
          setAccount(accounts[0] || null);
        });

        walletConnectProvider.on('chainChanged', (chainId: string) => {
          setChainId(parseInt(chainId, 16));
        });

        walletConnectProvider.on('disconnect', () => {
          setAccount(null);
          setChainId(null);
        });

        // Check if already connected
        if (walletConnectProvider.accounts?.length > 0) {
          setAccount(walletConnectProvider.accounts[0]);
          setChainId(walletConnectProvider.chainId);
        }
      } catch (error) {
        console.error('Failed to initialize WalletConnect provider:', error);
      }
    };

    initProvider();
  }, []);

  const connect = async () => {
    if (!provider) return;
    
    setIsConnecting(true);
    try {
      const accounts = await provider.enable();
      setAccount(accounts[0]);
      setChainId(provider.chainId);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = async () => {
    if (!provider) return;
    
    try {
      await provider.disconnect();
      setAccount(null);
      setChainId(null);
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  };

  return (
    <WalletConnectContext.Provider
      value={{
        provider,
        account,
        chainId,
        connect,
        disconnect,
        isConnecting
      }}
    >
      {children}
    </WalletConnectContext.Provider>
  );
};