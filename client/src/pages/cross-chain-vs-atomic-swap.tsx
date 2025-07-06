/**
 * Cross-Chain vs Atomic Swap Explanation Page
 * 
 * This page explains the differences and relationships between cross-chain functionality
 * and atomic swaps in the Chronos Vault platform.
 */

import React from 'react';
import { Link, useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeftRight, Circle, ArrowRight, Lock, Clock, Wallet, LockKeyhole, Binary, GanttChartSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const CrossChainVsAtomicSwapPage = () => {
  const [_, navigate] = useLocation();

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Cross-Chain Features vs. Atomic Swaps</h1>
        <p className="text-gray-400">
          Understanding the differences and relationships between cross-chain functionality and atomic swaps in the Chronos Vault platform
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card className="border border-blue-600/20 bg-black/10">
          <CardHeader>
            <CardTitle className="text-xl text-blue-500 flex items-center">
              <GanttChartSquare className="mr-2 h-5 w-5" /> Cross-Chain Features
            </CardTitle>
            <CardDescription>
              The broader ecosystem of multi-blockchain functionality
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-500/10 rounded-lg p-4">
              <h3 className="font-medium text-blue-400 mb-2">What are Cross-Chain Features?</h3>
              <p className="text-sm text-gray-300">
                Cross-chain functionality refers to the entire ecosystem of features that connect multiple blockchains together, allowing them to interact and share data. This includes:
              </p>
              <ul className="list-disc list-inside text-sm text-gray-300 mt-2 space-y-1">
                <li>Creating vaults on different blockchains</li>
                <li>Transferring assets across blockchains</li>
                <li>Managing security across multiple chains</li>
                <li>Cross-chain messaging and oracle services</li>
                <li>Asset bridging and wrapping</li>
              </ul>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-blue-500/10 p-2 rounded-full">
                <Wallet className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-blue-400">Universal Vault Management</h3>
                <p className="text-xs text-gray-400">
                  Create and manage vaults across different blockchains with a unified interface. Use each blockchain's unique advantages while maintaining a consistent user experience.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-blue-500/10 p-2 rounded-full">
                <Lock className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-blue-400">Enhanced Security</h3>
                <p className="text-xs text-gray-400">
                  Leverage the security models of multiple blockchains to create more robust and resilient vault solutions. Our Triple-Chain Security model ensures your assets have the highest level of protection.
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full text-blue-500 border-blue-500 hover:bg-blue-500/10"
              onClick={() => navigate('/cross-chain')}
            >
              Explore Cross-Chain Features
            </Button>
          </CardFooter>
        </Card>

        <Card className="border border-purple-600/20 bg-black/10">
          <CardHeader>
            <CardTitle className="text-xl text-purple-500 flex items-center">
              <ArrowLeftRight className="mr-2 h-5 w-5" /> Atomic Swaps
            </CardTitle>
            <CardDescription>
              A specific cross-chain implementation for trustless asset exchange
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-purple-500/10 rounded-lg p-4">
              <h3 className="font-medium text-purple-400 mb-2">What are Atomic Swaps?</h3>
              <p className="text-sm text-gray-300">
                Atomic swaps are a <strong>specific implementation of cross-chain technology</strong> that enables the trustless exchange of cryptocurrencies across different blockchains without requiring a third-party intermediary. Key characteristics include:
              </p>
              <ul className="list-disc list-inside text-sm text-gray-300 mt-2 space-y-1">
                <li>Direct peer-to-peer exchange of different cryptocurrencies</li>
                <li>Conditional time-locked contracts (HTLCs)</li>
                <li>All-or-nothing execution (hence "atomic")</li>
                <li>No need for centralized exchanges</li>
              </ul>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-purple-500/10 p-2 rounded-full">
                <LockKeyhole className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-purple-400">Hash Time-Locked Contracts</h3>
                <p className="text-xs text-gray-400">
                  HTLCs are smart contracts that lock assets until specific conditions are met: either a cryptographic secret is revealed, or a timeout occurs. This ensures the security of the swap process.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-purple-500/10 p-2 rounded-full">
                <Clock className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-purple-400">Timelock Security</h3>
                <p className="text-xs text-gray-400">
                  Every atomic swap includes a timeout period. If the swap doesn't complete within this timeframe, both parties can retrieve their original funds, ensuring no one loses assets.
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full text-purple-500 border-purple-500 hover:bg-purple-500/10"
              onClick={() => navigate('/cross-chain-atomic-swap')}
            >
              Try Atomic Swaps
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card className="border border-[#8B00D7]/20 bg-black/10 mb-8">
        <CardHeader>
          <CardTitle className="text-xl text-[#8B00D7]">How They Relate</CardTitle>
          <CardDescription>
            Understanding the relationship between cross-chain functionality and atomic swaps
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-6 border border-[#8B00D7]/20">
            <div className="flex flex-col lg:flex-row items-center justify-center gap-6 relative">
              <div className="bg-blue-500/20 rounded-lg p-4 text-center w-full lg:w-1/3 z-10">
                <h3 className="text-blue-400 font-medium mb-2">Cross-Chain Features</h3>
                <p className="text-sm text-gray-300">The broader ecosystem of multi-blockchain functionality and interoperability</p>
              </div>
              
              <div className="hidden lg:flex items-center justify-center">
                <div className="w-16 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                <Circle className="h-3 w-3 text-[#8B00D7]" />
                <div className="w-16 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500"></div>
              </div>
              
              <div className="bg-purple-500/20 rounded-lg p-4 text-center w-full lg:w-1/3 z-10">
                <h3 className="text-purple-400 font-medium mb-2">Atomic Swaps</h3>
                <p className="text-sm text-gray-300">A specific implementation of cross-chain technology focused on asset exchange</p>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-gray-300">
                <span className="text-[#8B00D7] font-semibold">Atomic swaps are a subset of cross-chain functionality</span>. While cross-chain features encompass all aspects of multi-blockchain interaction, atomic swaps specifically handle the trustless exchange of assets between different blockchains.
              </p>
              <p className="text-gray-300 mt-4">
                Think of it like this: Cross-chain features are the entire highway system connecting different cities (blockchains), while atomic swaps are a specific type of vehicle (implementation) that travels on these highways to transport goods (assets) between cities.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-[#8B00D7]/20 bg-black/10">
        <CardHeader>
          <CardTitle className="text-xl text-[#8B00D7]">When to Use Each</CardTitle>
          <CardDescription>
            Guidance on which feature to use for different scenarios
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20">
              <h3 className="text-blue-400 font-medium mb-3 flex items-center">
                <GanttChartSquare className="mr-2 h-5 w-5" /> Use Cross-Chain Features When:
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Circle className="h-2 w-2 text-blue-500 mt-1.5 mr-2 flex-shrink-0" />
                  <span className="text-sm text-gray-300">You want to create vaults that operate across multiple blockchains</span>
                </li>
                <li className="flex items-start">
                  <Circle className="h-2 w-2 text-blue-500 mt-1.5 mr-2 flex-shrink-0" />
                  <span className="text-sm text-gray-300">You need enhanced security through Triple-Chain Security</span>
                </li>
                <li className="flex items-start">
                  <Circle className="h-2 w-2 text-blue-500 mt-1.5 mr-2 flex-shrink-0" />
                  <span className="text-sm text-gray-300">You want to manage assets across different blockchains with a unified interface</span>
                </li>
                <li className="flex items-start">
                  <Circle className="h-2 w-2 text-blue-500 mt-1.5 mr-2 flex-shrink-0" />
                  <span className="text-sm text-gray-300">You're building a comprehensive cross-chain solution with multiple components</span>
                </li>
              </ul>
            </div>

            <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/20">
              <h3 className="text-purple-400 font-medium mb-3 flex items-center">
                <ArrowLeftRight className="mr-2 h-5 w-5" /> Use Atomic Swaps When:
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Circle className="h-2 w-2 text-purple-500 mt-1.5 mr-2 flex-shrink-0" />
                  <span className="text-sm text-gray-300">You want to exchange one cryptocurrency for another without a centralized exchange</span>
                </li>
                <li className="flex items-start">
                  <Circle className="h-2 w-2 text-purple-500 mt-1.5 mr-2 flex-shrink-0" />
                  <span className="text-sm text-gray-300">You need a trustless way to trade assets with another party</span>
                </li>
                <li className="flex items-start">
                  <Circle className="h-2 w-2 text-purple-500 mt-1.5 mr-2 flex-shrink-0" />
                  <span className="text-sm text-gray-300">You want to perform peer-to-peer cross-chain trades with security guarantees</span>
                </li>
                <li className="flex items-start">
                  <Circle className="h-2 w-2 text-purple-500 mt-1.5 mr-2 flex-shrink-0" />
                  <span className="text-sm text-gray-300">You're implementing a specific asset exchange between two different blockchains</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-6 flex flex-col md:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate('/cross-chain')}
              className="bg-blue-500 hover:bg-blue-600"
            >
              <GanttChartSquare className="mr-2 h-4 w-4" /> Explore Cross-Chain Features
            </Button>
            <Button 
              onClick={() => navigate('/cross-chain-atomic-swap')}
              className="bg-purple-500 hover:bg-purple-600"
            >
              <ArrowLeftRight className="mr-2 h-4 w-4" /> Try Atomic Swaps
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CrossChainVsAtomicSwapPage;
