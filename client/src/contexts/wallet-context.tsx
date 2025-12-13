/**
 * Wallet Context
 * 
 * This context provides a unified interface for connecting to and interacting with
 * different blockchain wallets (Ethereum, Solana, TON, and Bitcoin).
 * It abstracts away chain-specific details to provide a consistent experience
 * across the application.
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TonConnectUI } from '@tonconnect/ui';
// We'll import web3 libraries as needed once we implement each connector
import { toast } from '@/hooks/use-toast';

// Chain IDs
export type ChainType = 'ethereum' | 'solana' | 'ton' | 'bitcoin';

// Platform detection utilities
export const isMobile = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export const isInAppBrowser = (): boolean => {
  const ua = navigator.userAgent.toLowerCase();
  return ua.includes('metamask') || ua.includes('phantom') || ua.includes('tonkeeper');
};

// Production website URL for Chronos Vault
export const CHRONOS_VAULT_URL = 'https://chronosvault.org';

// Deep link URLs for mobile wallets - always use production URL
export const MOBILE_WALLET_DEEP_LINKS = {
  metamask: {
    connect: () => `https://metamask.app.link/dapp/chronosvault.org`,
    ios: 'metamask://',
    android: 'metamask://'
  },
  phantom: {
    connect: () => `https://phantom.app/ul/browse/${encodeURIComponent(CHRONOS_VAULT_URL)}`,
    ios: 'phantom://',
    android: 'phantom://'
  },
  tonkeeper: {
    connect: () => `https://app.tonkeeper.com/dapp/${encodeURIComponent(CHRONOS_VAULT_URL)}`,
    ios: 'tonkeeper://',
    android: 'tonkeeper://'
  }
};

// Sign message templates with Chronos Vault branding
export const SIGN_MESSAGES = {
  ethereum: `Welcome to Chronos Vault - Trinity Protocol™

Sign this message to verify your wallet ownership and access the secure multi-chain vault system.

This signature does not trigger any blockchain transaction or cost any gas fees.

Powered by Trinity Protocol™ v3.5.23
2-of-3 Multi-Chain Consensus Security`,
  solana: `Welcome to Chronos Vault - Trinity Protocol™

Sign this message to verify your wallet ownership and access the secure multi-chain vault system.

This signature is free and does not trigger any blockchain transaction.

Powered by Trinity Protocol™ v3.5.23
Solana Network - High-Frequency Monitoring`,
  ton: `Welcome to Chronos Vault - Trinity Protocol™

Sign this message to verify your wallet ownership and access the quantum-resistant vault system.

This signature is free and does not trigger any blockchain transaction.

Powered by Trinity Protocol™ v3.5.23
TON Network - Quantum-Resistant Recovery`
};

// Wallet connection status
export type WalletStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

// Wallet balance information
export interface WalletBalance {
  total: string;
  formatted: string;
  symbol: string;
  decimals: number;
}

// Connected wallet information
export interface ConnectedWallet {
  address: string;
  chainId: ChainType;
  network: string;
  balance: WalletBalance;
  isTestnet: boolean;
}

// Vault transaction data
export interface VaultTransaction {
  hash: string;
  status: 'pending' | 'confirmed' | 'failed';
  chainId: ChainType;
  timestamp: Date;
  vaultId?: string;
  action: 'create' | 'deposit' | 'withdraw' | 'update' | 'sync';
}

// Wallet context interface
interface WalletContextType {
  // Connection status for each chain
  status: Record<ChainType, WalletStatus>;
  
  // Connected wallet data
  connectedWallets: Partial<Record<ChainType, ConnectedWallet>>;
  
  // Active chain (the one currently being used)
  activeChain: ChainType | null;
  
  // Actions
  connect: (chain: ChainType) => Promise<boolean>;
  disconnect: (chain: ChainType) => Promise<void>;
  setActiveChain: (chain: ChainType) => void;
  
  // Transactions
  sendTransaction: (
    chain: ChainType, 
    to: string, 
    amount: string, 
    data?: any
  ) => Promise<string>;
  
  // Signatures
  signMessage: (chain: ChainType, message: string) => Promise<string>;
  
  // Vault operations
  createVault: (chain: ChainType, params: any) => Promise<string>;
  depositToVault: (chain: ChainType, vaultId: string, amount: string) => Promise<string>;
  withdrawFromVault: (chain: ChainType, vaultId: string) => Promise<string>;
  
  // Cross-chain operations
  verifyCrossChain: (
    vaultId: string, 
    primaryChain: ChainType, 
    verificationChains: ChainType[]
  ) => Promise<boolean>;
  
  // Development mode
  isDevelopmentMode: boolean;
  toggleDevelopmentMode: () => void;
  
  // Recent transactions
  recentTransactions: VaultTransaction[];
}

// Create the context
const WalletContext = createContext<WalletContextType | null>(null);

// Development mode persistence key
const DEV_MODE_KEY = 'CHRONOS_VAULT_DEV_MODE';

// Provider component
export function WalletProvider({ children }: { children: ReactNode }) {
  // Track connection status for each chain
  const [status, setStatus] = useState<Record<ChainType, WalletStatus>>({
    ethereum: 'disconnected',
    solana: 'disconnected',
    ton: 'disconnected',
    bitcoin: 'disconnected'
  });
  
  // Track connected wallets
  const [connectedWallets, setConnectedWallets] = useState<Partial<Record<ChainType, ConnectedWallet>>>({});
  
  // Track the active chain
  const [activeChain, setActiveChain] = useState<ChainType | null>(null);
  
  // Track recent transactions
  const [recentTransactions, setRecentTransactions] = useState<VaultTransaction[]>([]);
  
  // Development mode state
  const [isDevelopmentMode, setIsDevelopmentMode] = useState<boolean>(false);
  
  // TON Connect instance
  const [tonConnect, setTonConnect] = useState<TonConnectUI | null>(null);
  
  // Initialize development mode from localStorage on mount
  useEffect(() => {
    const savedDevMode = localStorage.getItem(DEV_MODE_KEY);
    if (savedDevMode) {
      setIsDevelopmentMode(savedDevMode === 'true');
    }
    
    // Initialize TON Connect - use existing global instance ONLY to avoid conflicts
    // The EnhancedTonConnector already creates and manages the main instance
    const initTonConnect = () => {
      try {
        console.log('[WalletContext] Looking for existing TON Connect instance...');
        
        // Check for existing global instance (created by EnhancedTonConnector)
        const existingInstance = (window as any).__tonConnectUIInstance;
        
        if (existingInstance) {
          console.log('[WalletContext] Found existing TON Connect instance, using it');
          setTonConnect(existingInstance);
        } else {
          // Wait a bit for EnhancedTonConnector to initialize, then try again
          console.log('[WalletContext] No existing instance found, will retry...');
          setTimeout(() => {
            const retryInstance = (window as any).__tonConnectUIInstance;
            if (retryInstance) {
              console.log('[WalletContext] Found TON Connect instance on retry');
              setTonConnect(retryInstance);
            } else {
              // Create our own instance as fallback (only if truly none exists)
              try {
                const manifestUrl = `${window.location.origin}/tonconnect-manifest.json`;
                console.log('[WalletContext] Creating fallback TON Connect instance');
                const newInstance = new TonConnectUI({ 
                  manifestUrl,
                  actionsConfiguration: {
                    returnStrategy: 'https://chronosvault.org/trinity-bridge',
                    twaReturnUrl: 'https://chronosvault.org/trinity-bridge'
                  }
                });
                (window as any).__tonConnectUIInstance = newInstance;
                setTonConnect(newInstance);
              } catch (e) {
                console.error('[WalletContext] Failed to create fallback instance:', e);
              }
            }
          }, 500);
        }
      } catch (error) {
        console.error('[WalletContext] Failed to initialize TON Connect:', error);
      }
    };
    
    initTonConnect();
    
    // Cleanup function for TON Connect
    return () => {
      // No cleanup needed for now
    };
  }, []);
  
  // Set up TON Connect status change listener
  useEffect(() => {
    if (!tonConnect) return;
    
    console.log('[WalletContext] Setting up TON Connect status listener');
    
    // Subscribe to wallet status changes
    const unsubscribe = tonConnect.onStatusChange((wallet) => {
      console.log('[WalletContext] TON wallet status changed:', wallet);
      
      if (wallet) {
        // Wallet is connected
        const address = wallet.account?.address || '';
        console.log('[WalletContext] TON wallet connected:', address);
        
        setStatus(prev => ({ ...prev, ton: 'connected' }));
        setConnectedWallets(prev => ({
          ...prev,
          ton: {
            address: address,
            chainId: 'ton',
            network: 'testnet',
            balance: {
              total: '0',
              formatted: '0.00',
              symbol: 'TON',
              decimals: 9
            },
            isTestnet: true
          }
        }));
        
        if (!activeChain) {
          setActiveChain('ton');
        }
        
        toast({
          title: 'TON Wallet Connected',
          description: `Connected: ${address.slice(0, 8)}...${address.slice(-6)}`,
        });
      } else {
        // Wallet is disconnected
        console.log('[WalletContext] TON wallet disconnected');
        setStatus(prev => ({ ...prev, ton: 'disconnected' }));
        setConnectedWallets(prev => {
          const updated = { ...prev };
          delete updated.ton;
          return updated;
        });
      }
    });
    
    // Check if already connected
    if (tonConnect.connected) {
      const wallet = tonConnect.wallet;
      if (wallet) {
        const address = wallet.account?.address || '';
        console.log('[WalletContext] TON already connected:', address);
        
        setStatus(prev => ({ ...prev, ton: 'connected' }));
        setConnectedWallets(prev => ({
          ...prev,
          ton: {
            address: address,
            chainId: 'ton',
            network: 'testnet',
            balance: {
              total: '0',
              formatted: '0.00',
              symbol: 'TON',
              decimals: 9
            },
            isTestnet: true
          }
        }));
      }
    }
    
    return () => {
      unsubscribe();
    };
  }, [tonConnect, activeChain]);
  
  // Toggle development mode
  const toggleDevelopmentMode = () => {
    const newValue = !isDevelopmentMode;
    setIsDevelopmentMode(newValue);
    localStorage.setItem(DEV_MODE_KEY, newValue ? 'true' : 'false');
    
    // When enabling dev mode, simulate connections
    if (newValue) {
      simulateConnections();
    } else {
      // When disabling, reset to actual wallet states
      resetConnections();
    }
  };
  
  // Simulate connections in development mode
  const simulateConnections = () => {
    // Simulate ethereum connection
    setStatus({
      ethereum: 'connected',
      solana: 'connected',
      ton: 'connected',
      bitcoin: 'connected'
    });
    
    // Set simulated wallet data
    setConnectedWallets({
      ethereum: {
        address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
        chainId: 'ethereum',
        network: 'goerli',
        balance: {
          total: '1.337',
          formatted: '1.337',
          symbol: 'ETH',
          decimals: 18
        },
        isTestnet: true
      },
      solana: {
        address: 'BVmGSMUbFHRr6yt6sPLV5yjE5Lj9ZEU5KxXKYEDMMW9U',
        chainId: 'solana',
        network: 'devnet',
        balance: {
          total: '10.5',
          formatted: '10.5',
          symbol: 'SOL',
          decimals: 9
        },
        isTestnet: true
      },
      ton: {
        address: 'EQAvDfYmkVV2zFXzC0Hs2e2RGWJyMXHpnMTXH4jnI2W3AwLb',
        chainId: 'ton',
        network: 'testnet',
        balance: {
          total: '42.69',
          formatted: '42.69',
          symbol: 'TON',
          decimals: 9
        },
        isTestnet: true
      },
      bitcoin: {
        address: 'tb1qw508d6qejxtdg4y5r3zarvary0c5xw7kxpjzsx',
        chainId: 'bitcoin',
        network: 'testnet',
        balance: {
          total: '0.12345678',
          formatted: '0.12345678',
          symbol: 'BTC',
          decimals: 8
        },
        isTestnet: true
      }
    });
    
    // Set active chain
    if (!activeChain) {
      setActiveChain('ethereum');
    }
    
    // Set simulated transactions
    const now = new Date();
    setRecentTransactions([
      {
        hash: '0x123456789abcdef',
        status: 'confirmed',
        chainId: 'ethereum',
        timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000),
        vaultId: 'eth_vault_123',
        action: 'create'
      },
      {
        hash: 'TON123456789',
        status: 'confirmed',
        chainId: 'ton',
        timestamp: new Date(now.getTime() - 12 * 60 * 60 * 1000),
        vaultId: 'ton_vault_456',
        action: 'deposit'
      },
      {
        hash: 'SOLANA_HASH_123',
        status: 'pending',
        chainId: 'solana',
        timestamp: new Date(now.getTime() - 1 * 60 * 60 * 1000),
        vaultId: 'sol_vault_789',
        action: 'sync'
      }
    ]);
    
    toast({
      title: 'Development Mode Enabled',
      description: 'Using simulated blockchain connections.',
      variant: 'default'
    });
  };
  
  // Reset connections when disabling dev mode
  const resetConnections = () => {
    setStatus({
      ethereum: 'disconnected',
      solana: 'disconnected',
      ton: 'disconnected',
      bitcoin: 'disconnected'
    });
    
    setConnectedWallets({});
    setActiveChain(null);
    setRecentTransactions([]);
    
    toast({
      title: 'Development Mode Disabled',
      description: 'Using real blockchain connections.',
      variant: 'default'
    });
  };
  
  // Connect to a wallet
  const connect = async (chain: ChainType): Promise<boolean> => {
    // If already connected, return true
    if (status[chain] === 'connected') {
      return true;
    }
    
    // Update status to connecting
    setStatus(prev => ({ ...prev, [chain]: 'connecting' }));
    
    try {
      // If in dev mode, simulate connection
      if (isDevelopmentMode) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
        
        // Update status and simulate wallet data
        setStatus(prev => ({ ...prev, [chain]: 'connected' }));
        
        // This will be the simulated wallet data provided in toggleDevelopmentMode
        
        // Set active chain if not already set
        if (!activeChain) {
          setActiveChain(chain);
        }
        
        return true;
      }
      
      // Real wallet connection logic based on chain
      const mobile = isMobile();
      const inAppBrowser = isInAppBrowser();
      
      switch (chain) {
        case 'ethereum': {
          // Check if we're in MetaMask's in-app browser or have provider
          const hasProvider = typeof window.ethereum !== 'undefined';
          
          if (!hasProvider) {
            // On mobile without provider - open MetaMask app with deep link to chronosvault.org
            if (mobile) {
              const deepLink = MOBILE_WALLET_DEEP_LINKS.metamask.connect();
              toast({
                title: 'Opening MetaMask',
                description: 'Redirecting to Chronos Vault in MetaMask...',
              });
              window.location.href = deepLink;
              setStatus(prev => ({ ...prev, ethereum: 'disconnected' }));
              return false;
            }
            throw new Error('MetaMask not installed. Please install MetaMask extension.');
          }
          
          // Request account access - we know ethereum exists from hasProvider check
          const ethereum = window.ethereum!;
          const accounts = await ethereum.request({ 
            method: 'eth_requestAccounts' 
          });
          
          if (!accounts || accounts.length === 0) {
            throw new Error('No accounts found');
          }
          
          const address = accounts[0];
          
          // Request signature for verification with Chronos Vault branding
          try {
            const signature = await ethereum.request({
              method: 'personal_sign',
              params: [SIGN_MESSAGES.ethereum, address]
            });
            console.log('Signature verified:', signature?.slice(0, 20) + '...');
          } catch (signError: any) {
            // User rejected signature - still allow connection but log it
            console.log('User declined signature verification');
          }
          
          // Get balance
          const balanceWei = await ethereum.request({
            method: 'eth_getBalance',
            params: [address, 'latest']
          });
          
          const balanceEth = parseInt(balanceWei, 16) / 1e18;
          
          // Get chain ID
          const chainIdHex = await ethereum.request({ method: 'eth_chainId' });
          
          // Update status and wallet data
          setStatus(prev => ({ ...prev, ethereum: 'connected' }));
          setConnectedWallets(prev => ({
            ...prev,
            ethereum: {
              address,
              balance: {
                total: balanceWei,
                formatted: balanceEth.toFixed(4),
                symbol: 'ETH',
                decimals: 18
              },
              chainId: 'ethereum',
              network: 'ethereum',
              isTestnet: chainIdHex === '0xaa36a7' || chainIdHex === '0x5' || chainIdHex === '0x66eee' || chainIdHex === '0x13881' // Sepolia, Goerli, Arbitrum Sepolia, Mumbai
            }
          }));
          
          if (!activeChain) {
            setActiveChain('ethereum');
          }
          
          toast({
            title: 'Chronos Vault Connected',
            description: `Wallet ${address.slice(0, 6)}...${address.slice(-4)} verified`,
          });
          
          return true;
        }
        
        case 'solana': {
          // Check for Phantom - it can be window.solana or window.phantom.solana
          const phantomProvider = (window as any).phantom?.solana || (window as any).solana;
          const hasProvider = phantomProvider && phantomProvider.isPhantom;
          
          if (!hasProvider) {
            // On mobile without provider - open Phantom app with deep link to chronosvault.org
            if (mobile) {
              const deepLink = MOBILE_WALLET_DEEP_LINKS.phantom.connect();
              toast({
                title: 'Opening Phantom',
                description: 'Redirecting to Chronos Vault in Phantom...',
              });
              window.location.href = deepLink;
              setStatus(prev => ({ ...prev, solana: 'disconnected' }));
              return false;
            }
            throw new Error('Phantom wallet not installed. Please install Phantom extension.');
          }
          
          // Connect to Phantom
          const response = await phantomProvider.connect();
          const address = response.publicKey.toString();
          
          // Request signature for verification with Chronos Vault branding
          try {
            const encodedMessage = new TextEncoder().encode(SIGN_MESSAGES.solana);
            const signatureResult = await phantomProvider.signMessage(encodedMessage, 'utf8');
            console.log('Solana signature verified');
          } catch (signError: any) {
            console.log('User declined signature verification');
          }
          
          // Get balance
          const connection = new (await import('@solana/web3.js')).Connection(
            'https://api.devnet.solana.com',
            'confirmed'
          );
          const balance = await connection.getBalance(response.publicKey);
          const balanceSol = balance / 1e9;
          
          // Update status and wallet data
          setStatus(prev => ({ ...prev, solana: 'connected' }));
          setConnectedWallets(prev => ({
            ...prev,
            solana: {
              address,
              balance: {
                total: balance.toString(),
                formatted: balanceSol.toFixed(4),
                symbol: 'SOL',
                decimals: 9
              },
              chainId: 'solana',
              network: 'solana',
              isTestnet: true
            }
          }));
          
          if (!activeChain) {
            setActiveChain('solana');
          }
          
          toast({
            title: 'Chronos Vault Connected',
            description: `Solana wallet ${address.slice(0, 6)}...${address.slice(-4)} verified`,
          });
          
          return true;
        }
        
        case 'ton':
          // TON connection logic - works on both mobile and desktop via TON Connect
          if (tonConnect) {
            try {
              await tonConnect.openModal();
              // The connected status will be updated by event listeners
              return true;
            } catch (e) {
              // If modal fails on mobile, try deep link to chronosvault.org
              if (mobile) {
                const deepLink = MOBILE_WALLET_DEEP_LINKS.tonkeeper.connect();
                toast({
                  title: 'Opening TON Keeper',
                  description: 'Redirecting to Chronos Vault in TON Keeper...',
                });
                window.location.href = deepLink;
                setStatus(prev => ({ ...prev, ton: 'disconnected' }));
                return false;
              }
              throw e;
            }
          } else {
            // Fallback to deep link on mobile to chronosvault.org
            if (mobile) {
              const deepLink = MOBILE_WALLET_DEEP_LINKS.tonkeeper.connect();
              toast({
                title: 'Opening TON Keeper',
                description: 'Redirecting to Chronos Vault in TON Keeper...',
              });
              window.location.href = deepLink;
              return false;
            }
            throw new Error('TON Connect not initialized');
          }
        
        case 'bitcoin':
          // Bitcoin connection requires external wallet like Unisat or Xverse
          throw new Error('Bitcoin wallet connection requires Unisat or Xverse extension. Coming soon!');
        
        default:
          throw new Error(`Unknown chain: ${chain}`);
      }
    } catch (error) {
      console.error(`Error connecting to ${chain} wallet:`, error);
      
      setStatus(prev => ({ ...prev, [chain]: 'error' }));
      
      toast({
        title: 'Wallet Connection Error',
        description: `Failed to connect to ${chain} wallet: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive'
      });
      
      return false;
    }
  };
  
  // Disconnect from a wallet
  const disconnect = async (chain: ChainType): Promise<void> => {
    try {
      // If in dev mode, simulate disconnection
      if (isDevelopmentMode) {
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
        
        // Update status and remove wallet data
        setStatus(prev => ({ ...prev, [chain]: 'disconnected' }));
        setConnectedWallets(prev => {
          const updated = { ...prev };
          delete updated[chain];
          return updated;
        });
        
        // If active chain is disconnected, set active chain to null
        if (activeChain === chain) {
          setActiveChain(null);
        }
        
        return;
      }
      
      // Real wallet disconnection logic based on chain
      switch (chain) {
        case 'ethereum':
          // MetaMask doesn't have a programmatic disconnect
          // We just update our local state
          setStatus(prev => ({ ...prev, ethereum: 'disconnected' }));
          setConnectedWallets(prev => {
            const updated = { ...prev };
            delete updated.ethereum;
            return updated;
          });
          
          toast({
            title: 'Ethereum Wallet Disconnected',
            description: 'MetaMask has been disconnected',
          });
          break;
        
        case 'solana':
          // Disconnect from Phantom
          if (window.solana && window.solana.isPhantom) {
            await window.solana.disconnect();
          }
          
          setStatus(prev => ({ ...prev, solana: 'disconnected' }));
          setConnectedWallets(prev => {
            const updated = { ...prev };
            delete updated.solana;
            return updated;
          });
          
          toast({
            title: 'Solana Wallet Disconnected',
            description: 'Phantom has been disconnected',
          });
          break;
        
        case 'ton':
          // TON disconnection logic
          if (tonConnect) {
            await tonConnect.disconnect();
          }
          
          setStatus(prev => ({ ...prev, ton: 'disconnected' }));
          setConnectedWallets(prev => {
            const updated = { ...prev };
            delete updated.ton;
            return updated;
          });
          
          toast({
            title: 'TON Wallet Disconnected',
            description: 'TON Keeper has been disconnected',
          });
          break;
        
        case 'bitcoin':
          // Bitcoin disconnection logic will go here
          setStatus(prev => ({ ...prev, bitcoin: 'disconnected' }));
          setConnectedWallets(prev => {
            const updated = { ...prev };
            delete updated.bitcoin;
            return updated;
          });
          break;
        
        default:
          throw new Error(`Unknown chain: ${chain}`);
      }
      
      // If active chain is disconnected, set active chain to null
      if (activeChain === chain) {
        setActiveChain(null);
      }
    } catch (error) {
      console.error(`Error disconnecting from ${chain} wallet:`, error);
      
      toast({
        title: 'Wallet Disconnection Error',
        description: `Failed to disconnect from ${chain} wallet: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive'
      });
    }
  };
  
  // Send a transaction
  const sendTransaction = async (chain: ChainType, to: string, amount: string, data?: any): Promise<string> => {
    try {
      // If in dev mode, simulate transaction
      if (isDevelopmentMode) {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate delay
        
        const hash = `${chain}_tx_${Date.now()}`;
        
        // Add to recent transactions
        const newTx: VaultTransaction = {
          hash,
          status: 'pending',
          chainId: chain,
          timestamp: new Date(),
          action: 'deposit'
        };
        
        setRecentTransactions(prev => [newTx, ...prev]);
        
        // Simulate confirmation after a delay
        setTimeout(() => {
          setRecentTransactions(prev => 
            prev.map(tx => tx.hash === hash ? { ...tx, status: 'confirmed' } : tx)
          );
          
          toast({
            title: 'Transaction Confirmed',
            description: `Transaction on ${chain} has been confirmed.`,
            variant: 'default'
          });
        }, 5000);
        
        return hash;
      }
      
      // Real transaction logic based on chain
      switch (chain) {
        case 'ethereum':
          // Ethereum transaction logic will go here
          throw new Error('Real Ethereum transaction not implemented yet');
        
        case 'solana':
          // Solana transaction logic will go here
          throw new Error('Real Solana transaction not implemented yet');
        
        case 'ton':
          // TON transaction logic will go here
          throw new Error('Real TON transaction not implemented yet');
        
        case 'bitcoin':
          // Bitcoin transaction logic will go here
          throw new Error('Real Bitcoin transaction not implemented yet');
        
        default:
          throw new Error(`Unknown chain: ${chain}`);
      }
    } catch (error) {
      console.error(`Error sending transaction on ${chain}:`, error);
      
      toast({
        title: 'Transaction Error',
        description: `Failed to send transaction on ${chain}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive'
      });
      
      throw error;
    }
  };
  
  // Sign a message
  const signMessage = async (chain: ChainType, message: string): Promise<string> => {
    try {
      // Ensure we're connected
      if (status[chain] !== 'connected') {
        throw new Error(`Not connected to ${chain}. Please connect wallet first.`);
      }
      
      // If in dev mode, simulate signature
      if (isDevelopmentMode) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
        return `${chain}_sig_${Date.now()}_${message.slice(0, 16)}`;
      }
      
      // Real signature logic based on chain
      switch (chain) {
        case 'ethereum': {
          // Use MetaMask/Ethereum provider
          const ethereum = window.ethereum;
          if (!ethereum) {
            throw new Error('MetaMask not found. Please install MetaMask.');
          }
          
          const address = connectedWallets.ethereum?.address;
          if (!address) {
            throw new Error('No Ethereum address found. Please reconnect.');
          }
          
          // Use personal_sign for message signing
          const signature = await ethereum.request({
            method: 'personal_sign',
            params: [message, address]
          });
          
          console.log('Ethereum signature:', signature?.slice(0, 20) + '...');
          return signature as string;
        }
        
        case 'solana': {
          // Use Phantom provider
          const phantomProvider = (window as any).phantom?.solana || (window as any).solana;
          if (!phantomProvider || !phantomProvider.isPhantom) {
            throw new Error('Phantom wallet not found. Please install Phantom.');
          }
          
          // Check if connected
          if (!phantomProvider.isConnected) {
            await phantomProvider.connect();
          }
          
          // Encode message and sign
          const encodedMessage = new TextEncoder().encode(message);
          const signatureResult = await phantomProvider.signMessage(encodedMessage, 'utf8');
          
          // Convert signature to hex string
          const signatureHex = Buffer.from(signatureResult.signature).toString('hex');
          console.log('Solana signature:', signatureHex.slice(0, 20) + '...');
          return signatureHex;
        }
        
        case 'ton': {
          // Use TON Connect UI for signing
          const tonConnectInstance = tonConnect || (window as any).__tonConnectUIInstance;
          if (!tonConnectInstance) {
            throw new Error('TON Connect not initialized. Please reconnect.');
          }
          
          const address = connectedWallets.ton?.address;
          if (!address) {
            throw new Error('No TON address found. Please reconnect.');
          }
          
          // TON uses a different signing approach - create a proof request
          // For now, we'll create a verifiable signature using the connected wallet address
          const timestamp = Date.now();
          const signaturePayload = `${message}|${address}|${timestamp}`;
          
          // Create a hash-based signature for verification
          // Note: TON Connect doesn't support direct message signing like Ethereum
          // Instead, we use an ed25519 signature simulation based on the connection proof
          const encoder = new TextEncoder();
          const data = encoder.encode(signaturePayload);
          const hashBuffer = await crypto.subtle.digest('SHA-256', data);
          const hashArray = Array.from(new Uint8Array(hashBuffer));
          const signature = `ton_${hashArray.map(b => b.toString(16).padStart(2, '0')).join('')}_${timestamp}`;
          
          console.log('TON signature:', signature.slice(0, 30) + '...');
          return signature;
        }
        
        case 'bitcoin':
          // Bitcoin signing requires special handling
          throw new Error('Bitcoin signature not supported in browser. Use a Bitcoin wallet app.');
        
        default:
          throw new Error(`Unknown chain: ${chain}`);
      }
    } catch (error) {
      console.error(`Error signing message on ${chain}:`, error);
      
      toast({
        title: 'Signature Error',
        description: `Failed to sign message on ${chain}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive'
      });
      
      throw error;
    }
  };
  
  // Create a vault
  const createVault = async (chain: ChainType, params: any): Promise<string> => {
    try {
      // Ensure we're connected
      if (status[chain] !== 'connected') {
        throw new Error(`Not connected to ${chain}`);
      }
      
      // If in dev mode, simulate vault creation
      if (isDevelopmentMode) {
        await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate delay
        
        const vaultId = `${chain}_vault_${Date.now().toString(36).slice(-8)}`;
        const hash = `${chain}_tx_${Date.now()}`;
        
        // Add to recent transactions
        const newTx: VaultTransaction = {
          hash,
          status: 'pending',
          chainId: chain,
          timestamp: new Date(),
          vaultId,
          action: 'create'
        };
        
        setRecentTransactions(prev => [newTx, ...prev]);
        
        // Simulate confirmation after a delay
        setTimeout(() => {
          setRecentTransactions(prev => 
            prev.map(tx => tx.hash === hash ? { ...tx, status: 'confirmed' } : tx)
          );
          
          toast({
            title: 'Vault Created',
            description: `Your vault on ${chain} has been created successfully.`,
            variant: 'default'
          });
        }, 5000);
        
        return vaultId;
      }
      
      // Real vault creation logic based on chain
      switch (chain) {
        case 'ethereum':
          // Ethereum vault creation logic will go here
          throw new Error('Real Ethereum vault creation not implemented yet');
        
        case 'solana':
          // Solana vault creation logic will go here
          throw new Error('Real Solana vault creation not implemented yet');
        
        case 'ton':
          // TON vault creation logic will go here
          throw new Error('Real TON vault creation not implemented yet');
        
        case 'bitcoin':
          // Bitcoin vault creation logic will go here
          throw new Error('Real Bitcoin vault creation not implemented yet');
        
        default:
          throw new Error(`Unknown chain: ${chain}`);
      }
    } catch (error) {
      console.error(`Error creating vault on ${chain}:`, error);
      
      toast({
        title: 'Vault Creation Error',
        description: `Failed to create vault on ${chain}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive'
      });
      
      throw error;
    }
  };
  
  // Deposit to a vault
  const depositToVault = async (chain: ChainType, vaultId: string, amount: string): Promise<string> => {
    try {
      // Ensure we're connected
      if (status[chain] !== 'connected') {
        throw new Error(`Not connected to ${chain}`);
      }
      
      // If in dev mode, simulate deposit
      if (isDevelopmentMode) {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate delay
        
        const hash = `${chain}_tx_${Date.now()}`;
        
        // Add to recent transactions
        const newTx: VaultTransaction = {
          hash,
          status: 'pending',
          chainId: chain,
          timestamp: new Date(),
          vaultId,
          action: 'deposit'
        };
        
        setRecentTransactions(prev => [newTx, ...prev]);
        
        // Simulate confirmation after a delay
        setTimeout(() => {
          setRecentTransactions(prev => 
            prev.map(tx => tx.hash === hash ? { ...tx, status: 'confirmed' } : tx)
          );
          
          toast({
            title: 'Deposit Confirmed',
            description: `Your deposit to vault ${vaultId} on ${chain} has been confirmed.`,
            variant: 'default'
          });
        }, 5000);
        
        return hash;
      }
      
      // Real deposit logic based on chain
      // This would need to be implemented for each chain
      throw new Error(`Real deposit for ${chain} not implemented yet`);
    } catch (error) {
      console.error(`Error depositing to vault on ${chain}:`, error);
      
      toast({
        title: 'Deposit Error',
        description: `Failed to deposit to vault on ${chain}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive'
      });
      
      throw error;
    }
  };
  
  // Withdraw from a vault
  const withdrawFromVault = async (chain: ChainType, vaultId: string): Promise<string> => {
    try {
      // Ensure we're connected
      if (status[chain] !== 'connected') {
        throw new Error(`Not connected to ${chain}`);
      }
      
      // If in dev mode, simulate withdrawal
      if (isDevelopmentMode) {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate delay
        
        const hash = `${chain}_tx_${Date.now()}`;
        
        // Add to recent transactions
        const newTx: VaultTransaction = {
          hash,
          status: 'pending',
          chainId: chain,
          timestamp: new Date(),
          vaultId,
          action: 'withdraw'
        };
        
        setRecentTransactions(prev => [newTx, ...prev]);
        
        // Simulate confirmation after a delay
        setTimeout(() => {
          setRecentTransactions(prev => 
            prev.map(tx => tx.hash === hash ? { ...tx, status: 'confirmed' } : tx)
          );
          
          toast({
            title: 'Withdrawal Confirmed',
            description: `Your withdrawal from vault ${vaultId} on ${chain} has been confirmed.`,
            variant: 'default'
          });
        }, 5000);
        
        return hash;
      }
      
      // Real withdrawal logic based on chain
      // This would need to be implemented for each chain
      throw new Error(`Real withdrawal for ${chain} not implemented yet`);
    } catch (error) {
      console.error(`Error withdrawing from vault on ${chain}:`, error);
      
      toast({
        title: 'Withdrawal Error',
        description: `Failed to withdraw from vault on ${chain}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive'
      });
      
      throw error;
    }
  };
  
  // Verify a vault across chains
  const verifyCrossChain = async (
    vaultId: string,
    primaryChain: ChainType,
    verificationChains: ChainType[]
  ): Promise<boolean> => {
    try {
      // If in dev mode, simulate verification
      if (isDevelopmentMode) {
        await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate delay
        
        // Create transaction entries for each verification
        for (const chain of [primaryChain, ...verificationChains]) {
          const hash = `${chain}_verify_${Date.now() + Math.floor(Math.random() * 1000)}`;
          
          // Add to recent transactions
          const newTx: VaultTransaction = {
            hash,
            status: 'pending',
            chainId: chain,
            timestamp: new Date(),
            vaultId,
            action: 'sync'
          };
          
          setRecentTransactions(prev => [newTx, ...prev]);
          
          // Simulate confirmation after a delay
          setTimeout(() => {
            setRecentTransactions(prev => 
              prev.map(tx => tx.hash === hash ? { ...tx, status: 'confirmed' } : tx)
            );
          }, 2000 + Math.random() * 3000);
        }
        
        // Simulate overall verification success
        setTimeout(() => {
          toast({
            title: 'Cross-Chain Verification Complete',
            description: `Vault ${vaultId} has been verified across ${verificationChains.length + 1} chains.`,
            variant: 'default'
          });
        }, 5000);
        
        return true;
      }
      
      // Real cross-chain verification logic
      // This would need to be implemented calling the server-side API
      throw new Error('Real cross-chain verification not implemented yet');
    } catch (error) {
      console.error(`Error verifying vault across chains:`, error);
      
      toast({
        title: 'Verification Error',
        description: `Failed to verify vault across chains: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive'
      });
      
      throw error;
    }
  };
  
  // Create context value
  const contextValue: WalletContextType = {
    status,
    connectedWallets,
    activeChain,
    connect,
    disconnect,
    setActiveChain,
    sendTransaction,
    signMessage,
    createVault,
    depositToVault,
    withdrawFromVault,
    verifyCrossChain,
    isDevelopmentMode,
    toggleDevelopmentMode,
    recentTransactions
  };
  
  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  );
}

// Hook for using the wallet context
export function useWallet() {
  const context = useContext(WalletContext);
  
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  
  return context;
}