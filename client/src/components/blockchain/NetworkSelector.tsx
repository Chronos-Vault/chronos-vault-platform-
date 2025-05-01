import React from 'react';
import { useEthereum } from '@/contexts/ethereum-context';
import { BlockchainType, useMultiChain } from '@/contexts/multi-chain-context';
import TestnetBadge from './TestnetBadge';

interface NetworkSelectorProps {
  chain: BlockchainType;
  className?: string;
}

/**
 * NetworkSelector - Component for displaying and switching network
 * Currently only supports Ethereum network switching
 */
const NetworkSelector: React.FC<NetworkSelectorProps> = ({ 
  chain,
  className = ''
}) => {
  const { chainStatus, isTestnet } = useMultiChain();
  const { switchNetwork, availableNetworks, currentNetwork } = useEthereum();
  
  // Only render for Ethereum for now
  if (chain !== BlockchainType.ETHEREUM || !chainStatus[chain].isConnected) {
    return null;
  }
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">
            {chainStatus[chain].network}
          </span>
          <TestnetBadge chain={chain} />
        </div>
        
        <select 
          className="mt-1 text-xs border rounded p-1"
          value={currentNetwork}
          onChange={(e) => switchNetwork(e.target.value as any)}
        >
          {availableNetworks.map(net => (
            <option key={net.id} value={net.id}>
              {net.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default NetworkSelector;
