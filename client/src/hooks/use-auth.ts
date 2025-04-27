import { useState } from 'react';
import { useAccount, useConnect, useDisconnect, useSignMessage } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { SiweMessage } from 'siwe';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export function useAuth() {
  const queryClient = useQueryClient();
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { signMessage } = useSignMessage();
  
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Fetch the current user session if it exists
  const { data: session, isLoading: isLoadingSession } = useQuery({
    queryKey: ['/api/auth/session'],
    enabled: !!isConnected,
  });

  // Verify if the user is authenticated
  const isAuthenticated = session?.authenticated === true;

  // Connect wallet
  const connectWallet = async () => {
    try {
      if (isConnected) {
        disconnect();
      }

      // Connect with the injected connector (MetaMask, etc.)
      connect({ connector: injected() });
      
      return { address };
    } catch (error) {
      console.error("Error connecting wallet:", error);
      throw error;
    }
  };

  // Sign in with Ethereum
  const signIn = async () => {
    try {
      setIsAuthenticating(true);
      
      let walletAddress = address;
      
      // Connect wallet if not already connected
      if (!isConnected || !walletAddress) {
        const result = await connectWallet();
        walletAddress = result.address;
      }
      
      if (!walletAddress) throw new Error("No wallet address");

      // Get nonce from server
      const nonceResponse = await fetch('/api/auth/nonce');
      if (!nonceResponse.ok) {
        throw new Error('Failed to get nonce');
      }
      const { nonce } = await nonceResponse.json();

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
      
      const preparedMessage = message.prepareMessage();
      
      const signature = await signMessage({ message: preparedMessage });

      // Verify the signature with our server
      const verifyResponse = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, signature }),
        credentials: 'include',
      });

      if (!verifyResponse.ok) {
        throw new Error('Failed to verify signature');
      }

      const verifyResult = await verifyResponse.json();

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
      const response = await fetch('/api/auth/signout', {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to sign out');
      }
      
      // Refresh session data
      queryClient.invalidateQueries({ queryKey: ['/api/auth/session'] });
      
      // Disconnect wallet
      disconnect();
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