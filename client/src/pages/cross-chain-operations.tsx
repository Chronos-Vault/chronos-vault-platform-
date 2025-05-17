import React from 'react';
import { useLocation } from 'wouter';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Router, Network } from "lucide-react";
import CrossChainControlPanel from '@/components/cross-chain/CrossChainControlPanel';

const CrossChainOperationsPage = () => {
  const [_, navigate] = useLocation();

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="mb-8">
        <Button 
          variant="ghost" 
          className="mb-6 hover:bg-[#6B00D7]/10"
          onClick={() => navigate('/dashboard')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        
        <div className="flex items-center mb-4">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#6B00D7] to-[#FF5AF7] flex items-center justify-center shadow-lg shadow-[#6B00D7]/30 mr-4">
            <Network className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]">
            Cross-Chain Operations
          </h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-6 flex items-center">
            <div className="bg-[#242424] rounded-full p-3 mr-4">
              <Router className="h-6 w-6 text-[#FF5AF7]" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">Multi-Chain Control</h3>
              <p className="text-gray-400 text-sm">Manage operations across multiple blockchains</p>
            </div>
          </div>
          
          <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-6 flex items-center">
            <div className="bg-[#242424] rounded-full p-3 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-[#FF5AF7]">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">Real-Time Execution</h3>
              <p className="text-gray-400 text-sm">Monitor and control operations in real-time</p>
            </div>
          </div>
          
          <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-6 flex items-center">
            <div className="bg-[#242424] rounded-full p-3 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-[#FF5AF7]">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">Performance Optimization</h3>
              <p className="text-gray-400 text-sm">Automatic optimization based on chain metrics</p>
            </div>
          </div>
        </div>
        
        <p className="text-lg text-gray-300 max-w-3xl mb-8">
          The Cross-Chain Operations Center gives you complete control over transfers, swaps, and bridges
          across multiple blockchain networks. Execute operations with optimal security, speed, and cost efficiency.
        </p>
      </div>
      
      <CrossChainControlPanel />
      
      <div className="mt-12 bg-[#1A1A1A] border border-[#333] rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">About Cross-Chain Operations</h2>
        <p className="text-gray-400 mb-6">
          Chronos Vault's cross-chain operations system leverages our proprietary Triple-Chain Security Architecture to 
          ensure your assets are safely transferred between different blockchain networks:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="text-[#FF5AF7] font-semibold text-lg">1. Transfer</div>
            <p className="text-gray-400 text-sm">
              Move the same asset between different blockchain networks, preserving the token type
              while ensuring complete security through our atomic commitment protocol.
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="text-[#FF5AF7] font-semibold text-lg">2. Swap</div>
            <p className="text-gray-400 text-sm">
              Exchange one asset for another on the same or different blockchains with optimal pricing
              and execution through our cross-chain DEX aggregator.
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="text-[#FF5AF7] font-semibold text-lg">3. Bridge</div>
            <p className="text-gray-400 text-sm">
              Utilize specialized cross-chain bridges with multi-signature security and automated verification
              to move assets between networks with maximum security.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrossChainOperationsPage;