import React from 'react';
import { Link } from 'wouter';

/**
 * A simple component for testing navigation between pages
 * while maintaining wallet connection state
 */
export default function NavigationTestMenu() {
  return (
    <div className="p-3 bg-black/40 border border-purple-600/30 rounded-lg shadow-lg">
      <h3 className="text-sm font-medium text-purple-400 mb-2">Navigation Test Menu</h3>
      <div className="flex flex-wrap gap-2">
        <Link href="/wallet-manager">
          <a className="px-3 py-1 text-xs bg-purple-900/50 hover:bg-purple-800/60 text-white rounded-full">
            Wallet Manager
          </a>
        </Link>
        
        <Link href="/ton-integration">
          <a className="px-3 py-1 text-xs bg-blue-900/50 hover:bg-blue-800/60 text-white rounded-full">
            TON Integration
          </a>
        </Link>
        
        <Link href="/cross-chain">
          <a className="px-3 py-1 text-xs bg-green-900/50 hover:bg-green-800/60 text-white rounded-full">
            Cross-Chain
          </a>
        </Link>
        
        <Link href="/test-contract">
          <a className="px-3 py-1 text-xs bg-amber-900/50 hover:bg-amber-800/60 text-white rounded-full">
            Test Contract
          </a>
        </Link>
        
        <Link href="/cross-chain-monitor">
          <a className="px-3 py-1 text-xs bg-red-900/50 hover:bg-red-800/60 text-white rounded-full">
            Cross-Chain Monitor
          </a>
        </Link>
      </div>
      <p className="text-xs text-gray-400 mt-2">
        Use these links to navigate between pages while testing wallet connection persistence
      </p>
    </div>
  );
}
