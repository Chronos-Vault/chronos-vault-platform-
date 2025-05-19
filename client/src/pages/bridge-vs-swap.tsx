/**
 * Bridge vs Swap Comparison Page
 * 
 * This page explains the differences and relationships between bridges and swaps
 * in the Chronos Vault platform.
 */

import React from 'react';
import { Link, useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeftRight, Circle, ArrowRight, Lock, Clock, Wallet, ExternalLink, Shield, Repeat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const BridgeVsSwapPage = () => {
  const [_, navigate] = useLocation();

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Bridges vs. Swaps</h1>
        <p className="text-gray-400">
          Understanding the differences and use cases for bridges and swaps in the Chronos Vault platform
        </p>
      </div>

      <Card className="border border-[#333] bg-[#1A1A1A] shadow-xl mb-10">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] flex items-center justify-center">
              <ArrowLeftRight className="h-5 w-5 text-white" />
            </div>
            <CardTitle className="text-2xl text-white">Bridge vs. Swap: An Overview</CardTitle>
          </div>
          <CardDescription className="text-gray-400">
            Two essential tools for cross-chain operations with different purposes and mechanics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-[#242424] rounded-lg p-6 border border-[#333]">
                <div className="flex items-center mb-4">
                  <div className="bg-[#6B00D7]/20 p-2 rounded-full mr-3">
                    <ExternalLink className="h-6 w-6 text-[#FF5AF7]" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Bridges</h3>
                </div>
                
                <p className="text-gray-300 mb-4">
                  Cross-chain bridges facilitate the movement of assets from one blockchain to another,
                  allowing tokens to maintain their value and utility across different networks.
                </p>
                
                <div className="space-y-3 mt-4">
                  <div className="flex items-start">
                    <Circle className="h-4 w-4 text-[#FF5AF7] mr-2 mt-1 flex-shrink-0" />
                    <p className="text-sm text-gray-300">Preserves asset identity across chains</p>
                  </div>
                  <div className="flex items-start">
                    <Circle className="h-4 w-4 text-[#FF5AF7] mr-2 mt-1 flex-shrink-0" />
                    <p className="text-sm text-gray-300">Typically uses wrapped token representations</p>
                  </div>
                  <div className="flex items-start">
                    <Circle className="h-4 w-4 text-[#FF5AF7] mr-2 mt-1 flex-shrink-0" />
                    <p className="text-sm text-gray-300">Focuses on interoperability between blockchains</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-[#242424] rounded-lg p-6 border border-[#333]">
                <div className="flex items-center mb-4">
                  <div className="bg-[#6B00D7]/20 p-2 rounded-full mr-3">
                    <Repeat className="h-6 w-6 text-[#FF5AF7]" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Swaps</h3>
                </div>
                
                <p className="text-gray-300 mb-4">
                  Swaps enable the exchange of one asset for another with a focus on changing
                  the type of asset, rather than just moving it between blockchains.
                </p>
                
                <div className="space-y-3 mt-4">
                  <div className="flex items-start">
                    <Circle className="h-4 w-4 text-[#FF5AF7] mr-2 mt-1 flex-shrink-0" />
                    <p className="text-sm text-gray-300">Changes asset type (e.g., ETH to SOL)</p>
                  </div>
                  <div className="flex items-start">
                    <Circle className="h-4 w-4 text-[#FF5AF7] mr-2 mt-1 flex-shrink-0" />
                    <p className="text-sm text-gray-300">Typically involves market rates and price discovery</p>
                  </div>
                  <div className="flex items-start">
                    <Circle className="h-4 w-4 text-[#FF5AF7] mr-2 mt-1 flex-shrink-0" />
                    <p className="text-sm text-gray-300">Focuses on asset exchange value rather than movement</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-gray-300">
                <span className="text-[#8B00D7] font-semibold">Bridges and swaps serve complementary purposes</span>. While bridges focus on asset movement between chains, swaps facilitate asset exchange. Chronos Vault integrates both technologies to provide comprehensive cross-chain functionality.
              </p>
              <p className="text-gray-300 mt-4">
                In many cross-chain operations, bridges and swaps work together to provide a complete solution for moving and exchanging assets across different blockchain networks.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <Card className="border border-[#333] bg-[#1A1A1A] shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl text-white">Bridge Security Features</CardTitle>
            <CardDescription className="text-gray-400">
              How Chronos Vault ensures bridge security
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="bg-[#6B00D7]/20 p-2 rounded-full mr-3 mt-1">
                  <Shield className="h-4 w-4 text-[#FF5AF7]" />
                </div>
                <div>
                  <h4 className="font-medium text-white">Multi-Signature Verification</h4>
                  <p className="text-sm text-gray-300">All bridge transactions require multiple signatures from authorized validators</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-[#6B00D7]/20 p-2 rounded-full mr-3 mt-1">
                  <Lock className="h-4 w-4 text-[#FF5AF7]" />
                </div>
                <div>
                  <h4 className="font-medium text-white">Zero-Knowledge Attestations</h4>
                  <p className="text-sm text-gray-300">Privacy-preserving validation of bridge transactions</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-[#6B00D7]/20 p-2 rounded-full mr-3 mt-1">
                  <Clock className="h-4 w-4 text-[#FF5AF7]" />
                </div>
                <div>
                  <h4 className="font-medium text-white">Time-Locked Security</h4>
                  <p className="text-sm text-gray-300">Transactions include time-lock mechanisms for additional security</p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border border-[#333] bg-[#1A1A1A] shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl text-white">Swap Security Features</CardTitle>
            <CardDescription className="text-gray-400">
              How Chronos Vault ensures swap security
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="bg-[#6B00D7]/20 p-2 rounded-full mr-3 mt-1">
                  <ArrowLeftRight className="h-4 w-4 text-[#FF5AF7]" />
                </div>
                <div>
                  <h4 className="font-medium text-white">Atomic Execution</h4>
                  <p className="text-sm text-gray-300">All swap transactions execute atomically - either completely or not at all</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-[#6B00D7]/20 p-2 rounded-full mr-3 mt-1">
                  <Wallet className="h-4 w-4 text-[#FF5AF7]" />
                </div>
                <div>
                  <h4 className="font-medium text-white">Slippage Protection</h4>
                  <p className="text-sm text-gray-300">Advanced mechanisms to prevent price manipulation during swaps</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-[#6B00D7]/20 p-2 rounded-full mr-3 mt-1">
                  <Shield className="h-4 w-4 text-[#FF5AF7]" />
                </div>
                <div>
                  <h4 className="font-medium text-white">Cross-Chain Verification</h4>
                  <p className="text-sm text-gray-300">Multiple blockchain verifications for each swap transaction</p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-[#333] bg-[#1A1A1A] shadow-xl mb-10">
        <CardHeader>
          <CardTitle className="text-xl text-white">When to Use Each Technology</CardTitle>
          <CardDescription className="text-gray-400">
            Guidelines for choosing the right cross-chain solution
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-[#333] rounded-lg p-4">
              <h3 className="font-semibold text-[#FF5AF7] mb-2">Use Bridges When:</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <ArrowRight className="h-4 w-4 text-[#FF5AF7] mr-2 mt-1 flex-shrink-0" />
                  <p className="text-sm text-gray-300">You want to use the same token type on a different blockchain</p>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-4 w-4 text-[#FF5AF7] mr-2 mt-1 flex-shrink-0" />
                  <p className="text-sm text-gray-300">You need to access dApps on another chain with your current assets</p>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-4 w-4 text-[#FF5AF7] mr-2 mt-1 flex-shrink-0" />
                  <p className="text-sm text-gray-300">You're looking for interoperability rather than changing asset types</p>
                </li>
              </ul>
            </div>
            
            <div className="border border-[#333] rounded-lg p-4">
              <h3 className="font-semibold text-[#FF5AF7] mb-2">Use Swaps When:</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <ArrowRight className="h-4 w-4 text-[#FF5AF7] mr-2 mt-1 flex-shrink-0" />
                  <p className="text-sm text-gray-300">You want to change from one token type to another</p>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-4 w-4 text-[#FF5AF7] mr-2 mt-1 flex-shrink-0" />
                  <p className="text-sm text-gray-300">You're looking to take advantage of price differences across markets</p>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-4 w-4 text-[#FF5AF7] mr-2 mt-1 flex-shrink-0" />
                  <p className="text-sm text-gray-300">You want to diversify your holdings across different assets</p>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center gap-4 pt-4">
          <Button variant="outline" onClick={() => navigate('/cross-chain-operations')} className="text-[#FF5AF7] border-[#FF5AF7]/30 hover:bg-[#FF5AF7]/10">
            <ArrowLeftRight className="mr-2 h-4 w-4" />
            Explore Cross-Chain Operations
          </Button>
          <Button onClick={() => navigate('/cross-chain-atomic-swap')} className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] text-white hover:opacity-90">
            <Repeat className="mr-2 h-4 w-4" />
            Try Atomic Swaps
          </Button>
        </CardFooter>
      </Card>

      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-white mb-4">Still Have Questions?</h2>
        <p className="text-gray-400 max-w-2xl mx-auto mb-6">
          Our documentation provides detailed technical explanations of our cross-chain technologies,
          including bridges and swaps. Visit our detailed docs for more information.
        </p>
        <Button variant="outline" onClick={() => navigate('/documentation')} className="text-[#FF5AF7] border-[#FF5AF7]/30 hover:bg-[#FF5AF7]/10">
          <ExternalLink className="mr-2 h-4 w-4" />
          View Technical Documentation
        </Button>
      </div>
    </div>
  );
};

export default BridgeVsSwapPage;