import React from 'react';
import { DirectWalletConnect } from './DirectWalletConnect';

interface SimpleWalletButtonsProps {
  onConnect: (walletType: string, address: string) => void;
}

export function SimpleWalletButtons({ onConnect }: SimpleWalletButtonsProps) {
  return <DirectWalletConnect onConnect={onConnect} />;
}