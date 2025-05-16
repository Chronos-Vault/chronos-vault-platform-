import React, { createContext, useContext, useState } from 'react';

export type ChainType = 'ton' | 'ethereum' | 'solana' | 'bitcoin';

export interface WalletInfo {
  address: string;
  chain: ChainType;
  wallet: string;
  balance?: number;
}

export interface BlockchainContextType {
  connect: (chain: ChainType, wallet: string) => Promise<boolean>;
  disconnect: () => void;
  isConnected: boolean;
  connectedWallet: WalletInfo | null;
  activeChain: ChainType | null;
}

const defaultContext: BlockchainContextType = {
  connect: async () => false,
  disconnect: () => {},
  isConnected: false,
  connectedWallet: null,
  activeChain: null,
};

const BlockchainContext = createContext<BlockchainContextType>(defaultContext);

export function BlockchainProvider({ children }: { children: React.ReactNode }) {
  const [connectedWallet, setConnectedWallet] = useState<WalletInfo | null>(null);

  const connect = async (chain: ChainType, wallet: string): Promise<boolean> => {
    try {
      // Generate a mock address based on the chain and wallet
      let mockAddress = '';
      switch (chain) {
        case 'ton':
          mockAddress = 'EQAvDfYmkVV2zFXzC0Hs2e2RGWJyMXHpnMTXH4jnI2W3AwLb';
          break;
        case 'ethereum':
          mockAddress = '0x1234567890123456789012345678901234567890';
          break;
        case 'solana':
          mockAddress = 'AKzB7dUMp5YUVJ5YuTN1Y5AD3rf1YtDGaPKw1MQH8ikR';
          break;
        case 'bitcoin':
          mockAddress = 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq';
          break;
      }
      
      setConnectedWallet({
        address: mockAddress,
        chain,
        wallet,
        balance: Math.floor(Math.random() * 1000) / 100,
      });
      
      return true;
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      return false;
    }
  };

  const disconnect = () => {
    setConnectedWallet(null);
  };

  return (
    <BlockchainContext.Provider 
      value={{
        connect,
        disconnect,
        isConnected: !!connectedWallet,
        connectedWallet,
        activeChain: connectedWallet?.chain || null,
      }}
    >
      {children}
    </BlockchainContext.Provider>
  );
}

export const useBlockchain = () => useContext(BlockchainContext);