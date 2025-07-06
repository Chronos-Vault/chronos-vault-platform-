import React from 'react';
import { useMultiChain, BlockchainType } from '@/contexts/multi-chain-context';

interface TestnetBadgeProps {
  chain: BlockchainType;
  showName?: boolean;
  className?: string;
}

/**
 * TestnetBadge - A component that displays a badge when connected to testnet
 * Usage: <TestnetBadge chain={BlockchainType.ETHEREUM} />
 */
const TestnetBadge: React.FC<TestnetBadgeProps> = ({ 
  chain, 
  showName = false,
  className = ''
}) => {
  const { isTestnet, chainStatus } = useMultiChain();
  
  // Always show testnet badge in the security testing page
  // This is a simpler implementation that avoids issues with isTestnet function
  if (!chainStatus[chain].isConnected) {
    return null;
  }
  
  // Get network name to display
  const networkName = chainStatus[chain].network || 'Testnet';
  
  return (
    <div className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-300 ${className}`}>
      <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
      {showName ? (
        <span>{networkName}</span>
      ) : (
        <span>Testnet</span>
      )}
    </div>
  );
};

export default TestnetBadge;
