import React from 'react';
import { useLocation } from 'wouter';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Router, Network, Zap, Coins } from "lucide-react";
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
        
        <div className="bg-[#1A1A1A]/50 border border-[#333] rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#6B00D7] to-[#FF5AF7] flex items-center justify-center shadow-lg shadow-[#6B00D7]/20 mr-4">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Fee Monitoring System</h2>
                <p className="text-gray-400">Track and optimize transaction costs across multiple blockchains</p>
              </div>
            </div>
            <Button 
              className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:opacity-90 text-white"
              onClick={() => navigate('/cross-chain-fee-monitor')}
            >
              <Coins className="mr-2 h-4 w-4" />
              Open Fee Monitor
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-[#242424] rounded-lg p-4 flex flex-col items-center text-center">
              <div className="h-10 w-10 rounded-full bg-[#6B00D7]/20 flex items-center justify-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-[#FF5AF7]">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              </div>
              <h3 className="text-white font-semibold">Best Chain Selection</h3>
              <p className="text-gray-400 text-sm">Find the most cost-effective blockchain for your transaction</p>
            </div>
            
            <div className="bg-[#242424] rounded-lg p-4 flex flex-col items-center text-center">
              <div className="h-10 w-10 rounded-full bg-[#6B00D7]/20 flex items-center justify-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-[#FF5AF7]">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                </svg>
              </div>
              <h3 className="text-white font-semibold">Real-Time Fees</h3>
              <p className="text-gray-400 text-sm">Monitor transaction costs across networks with live updates</p>
            </div>
            
            <div className="bg-[#242424] rounded-lg p-4 flex flex-col items-center text-center">
              <div className="h-10 w-10 rounded-full bg-[#6B00D7]/20 flex items-center justify-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-[#FF5AF7]">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <h3 className="text-white font-semibold">Wait Time Estimates</h3>
              <p className="text-gray-400 text-sm">See estimated transaction confirmation times</p>
            </div>
            
            <div className="bg-[#242424] rounded-lg p-4 flex flex-col items-center text-center">
              <div className="h-10 w-10 rounded-full bg-[#6B00D7]/20 flex items-center justify-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-[#FF5AF7]">
                  <circle cx="18" cy="18" r="3"></circle>
                  <circle cx="6" cy="6" r="3"></circle>
                  <path d="M13 6h3a2 2 0 0 1 2 2v7"></path>
                  <path d="M11 18H8a2 2 0 0 1-2-2V9"></path>
                </svg>
              </div>
              <h3 className="text-white font-semibold">Gas Optimization</h3>
              <p className="text-gray-400 text-sm">Optimize transaction costs across multiple blockchain networks</p>
            </div>
          </div>
        </div>
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