import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuthContext } from '@/contexts/auth-context';
import { Loader2, Wallet } from 'lucide-react';
import { truncateAddress } from '@/lib/utils';

export function ConnectWalletButton() {
  const { address, isConnected, isAuthenticated, signIn, signOut, isAuthenticating } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);

  // Handle wallet connection
  const handleConnect = async () => {
    try {
      setIsLoading(true);
      await signIn();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle sign out
  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      await signOut();
    } catch (error) {
      console.error('Failed to sign out:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Loading/authenticating state
  if (isLoading || isAuthenticating) {
    return (
      <Button disabled variant="outline" size="sm">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Connecting...
      </Button>
    );
  }

  // Connected and authenticated
  if (isConnected && isAuthenticated) {
    return (
      <Button 
        onClick={handleSignOut} 
        variant="ghost" 
        size="sm"
        className="text-violet-400 hover:text-violet-300 hover:bg-violet-900/30"
      >
        <Wallet className="mr-2 h-4 w-4" />
        {truncateAddress(address || '')}
      </Button>
    );
  }

  // Not connected
  return (
    <Button 
      onClick={handleConnect} 
      variant="outline" 
      size="sm"
      className="border-violet-500 text-violet-400 hover:text-violet-300 hover:bg-violet-900/30"
    >
      <Wallet className="mr-2 h-4 w-4" />
      Connect Wallet
    </Button>
  );
}

export default ConnectWalletButton;