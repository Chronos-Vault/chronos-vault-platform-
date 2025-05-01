import React from 'react';
import { BlockchainType } from '@/contexts/multi-chain-context';
import { FaEthereum, FaBitcoin } from 'react-icons/fa';
import { SiSolana } from 'react-icons/si';

interface BlockchainIconProps {
  blockchain: BlockchainType;
  className?: string;
  size?: number;
}

export const BlockchainIcon: React.FC<BlockchainIconProps> = ({ 
  blockchain, 
  className = '', 
  size = 24 
}) => {
  switch (blockchain) {
    case BlockchainType.ETHEREUM:
      return <FaEthereum className={`text-blue-500 ${className}`} size={size} />;
    case BlockchainType.SOLANA:
      return <SiSolana className={`text-purple-500 ${className}`} size={size} />;
    case BlockchainType.TON:
      // TON doesn't have a dedicated icon in react-icons, so we'll use a custom element
      return (
        <div 
          className={`inline-flex items-center justify-center bg-blue-600 text-white rounded-full ${className}`}
          style={{ width: size, height: size, fontSize: size * 0.5 }}
        >
          TON
        </div>
      );
    case BlockchainType.BITCOIN:
      return <FaBitcoin className={`text-orange-500 ${className}`} size={size} />;
    default:
      return null;
  }
};

export default BlockchainIcon;
