import { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect, useSignMessage } from 'wagmi';
import { SiweMessage } from 'siwe';
import { apiRequest } from '@/lib/queryClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useAuth() {
  const queryClient = useQueryClient();
  const { address, isConnected } = useAccount();
  const { connectAsync, connectors } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const { signMessageAsync } = useSignMessage();
  
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Fetch the current user session if it exists
  const { data: session, isLoading: isLoadingSession } = useQuery({
    queryKey: ['/api/auth/session'],
    enabled: isConnected,
  });

  // Verify if the user is authenticated
  const isAuthenticated = !!session?.address;

  // Connect wallet and sign message for authentication
  const connectWallet = async (connectorId?: string) => {
    try {
      if (isConnected) {
        await disconnectAsync();
      }

      // Find the connector by ID or use the first available one
      const connector = connectorId 
        ? connectors.find(c => c.id === connectorId) 
        : connectors[0];
      
      if (!connector) throw new Error("Connector not found");

      const result = await connectAsync({ connector });
      return result;
    } catch (error) {
      console.error("Error connecting wallet:", error);
      throw error;
    }
  };

  // Sign in with Ethereum
  const signIn = async (connectorId?: string) => {
    try {
      setIsAuthenticating(true);
      
      // Connect wallet if not already connected
      const { address: walletAddress } = isConnected 
        ? { address } 
        : await connectWallet(connectorId);
      
      if (!walletAddress) throw new Error("No wallet address");

      // Get nonce from server
      const { nonce } = await apiRequest('/api/auth/nonce', {
        method: 'GET',
      });

      // Create and sign the SIWE message
      const message = new SiweMessage({
        domain: window.location.host,
        address: walletAddress,
        statement: 'Sign in to Chronos Vault with your wallet.',
        uri: window.location.origin,
        version: '1',
        chainId: 1, // Default to Ethereum mainnet
        nonce,
      });
      
      const signature = await signMessageAsync({ 
        message: message.prepareMessage() 
      });

      // Verify the signature with our server
      const verifyResult = await apiRequest('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, signature }),
      });

      // Refresh user session data
      queryClient.invalidateQueries({ queryKey: ['/api/auth/session'] });
      
      return verifyResult;
    } catch (error) {
      console.error("Error during sign in:", error);
      throw error;
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      await apiRequest('/api/auth/signout', {
        method: 'POST',
      });
      
      // Refresh session data
      queryClient.invalidateQueries({ queryKey: ['/api/auth/session'] });
      
      // Disconnect wallet
      await disconnectAsync();
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  return {
    address,
    isConnected,
    isAuthenticated,
    isAuthenticating,
    isLoadingSession,
    connectWallet,
    signIn,
    signOut,
    session,
  };
}

export default useAuth;