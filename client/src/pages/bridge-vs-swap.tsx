/**
 * Bridge vs Swap Comparison Page
 * 
 * This page explains the differences and relationships between bridges and swaps
 * in the Chronos Vault platform.
 */

import React from 'react';
import { useLocation } from 'wouter';
import { ArrowLeft, ArrowRight, CornerRightDown, CornerLeftDown, Globe, Shuffle, Timer, Server, Shield, Zap, DollarSign, Lock, ChevronRight, ReceiptIcon, Compass } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { motion } from 'framer-motion';

const BridgeVsSwapPage = () => {
  const [_, navigate] = useLocation();

  return (
    <div className="container mx-auto px-4 py-10 max-w-7xl">
      <Button 
        variant="ghost" 
        className="mb-6 hover:bg-[#6B00D7]/10"
        onClick={() => navigate('/cross-chain-operations')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Cross-Chain Operations
      </Button>
      
      <div className="flex flex-col items-center mb-12 text-center">
        <div className="relative mb-4">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#6B00D7] to-[#FF5AF7] flex items-center justify-center shadow-lg shadow-[#6B00D7]/30">
            <Globe className="h-7 w-7 text-white" />
          </div>
          <div className="absolute -right-3 -bottom-3 h-10 w-10 rounded-full bg-[#FF5AF7] flex items-center justify-center shadow-lg">
            <Shuffle className="h-5 w-5 text-white" />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] mb-4">
          Bridge vs Swap Technologies
        </h1>
        <p className="text-gray-400 max-w-2xl">
          Understanding the fundamental differences between cross-chain bridges and atomic swaps
          is essential for optimizing your multi-chain strategy in Chronos Vault.
        </p>
      </div>
      
      {/* Visual Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="p-6 bg-[#1A1A1A] border border-[#333] rounded-xl shadow-xl"
        >
          <div className="flex items-center mb-4">
            <div className="h-12 w-12 rounded-full bg-[#6B00D7] flex items-center justify-center mr-4">
              <Globe className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Cross-Chain Bridge</h2>
          </div>
          
          <p className="text-gray-400 mb-6">
            A technological bridge that enables assets to move between different blockchain networks
            by locking assets on the source chain and minting equivalent tokens on the destination chain.
          </p>
          
          <div className="mb-6 flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="bg-[#242424] p-4 rounded-lg text-center text-[#FF5AF7] font-medium mb-6">
                Blockchain A (Ethereum)
              </div>
              
              <div className="absolute left-1/2 transform -translate-x-1/2 h-20 flex items-center justify-center">
                <div className="h-full w-0.5 bg-gradient-to-b from-[#6B00D7] to-[#FF5AF7]"></div>
                <div className="absolute top-2 -ml-3">
                  <CornerRightDown className="h-5 w-5 text-[#6B00D7]" />
                </div>
                <div className="absolute top-1/2 transform -translate-y-1/2">
                  <div className="bg-[#1D142E] p-2 rounded-full border border-[#6B00D7]">
                    <Lock className="h-4 w-4 text-[#FF5AF7]" />
                  </div>
                </div>
                <div className="absolute bottom-2 -ml-3">
                  <CornerLeftDown className="h-5 w-5 text-[#FF5AF7]" />
                </div>
              </div>
              
              <div className="bg-[#242424] p-4 rounded-lg text-center text-[#FF5AF7] font-medium mt-20">
                Blockchain B (TON)
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="bg-[#6B00D7]/20 p-1.5 rounded-full mt-0.5 mr-3">
                <Lock className="h-4 w-4 text-[#FF5AF7]" />
              </div>
              <div>
                <p className="text-white font-medium">Custodial Process</p>
                <p className="text-sm text-gray-400">Assets are locked on one chain while wrapped tokens are minted on another</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-[#6B00D7]/20 p-1.5 rounded-full mt-0.5 mr-3">
                <Server className="h-4 w-4 text-[#FF5AF7]" />
              </div>
              <div>
                <p className="text-white font-medium">Centralized or Decentralized</p>
                <p className="text-sm text-gray-400">Can be operated by trusted validators or fully decentralized protocols</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-[#6B00D7]/20 p-1.5 rounded-full mt-0.5 mr-3">
                <Timer className="h-4 w-4 text-[#FF5AF7]" />
              </div>
              <div>
                <p className="text-white font-medium">Variable Speed</p>
                <p className="text-sm text-gray-400">Confirmation times vary based on bridge design and destination chain</p>
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="p-6 bg-[#1A1A1A] border border-[#333] rounded-xl shadow-xl"
        >
          <div className="flex items-center mb-4">
            <div className="h-12 w-12 rounded-full bg-[#FF5AF7] flex items-center justify-center mr-4">
              <Shuffle className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Atomic Swap</h2>
          </div>
          
          <p className="text-gray-400 mb-6">
            A peer-to-peer exchange protocol that allows direct trading of cryptocurrencies across different 
            blockchains without intermediaries, using hash time-locked contracts.
          </p>
          
          <div className="mb-6 flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="flex justify-between mb-6">
                <div className="bg-[#242424] p-4 rounded-lg text-center text-[#FF5AF7] font-medium w-5/12">
                  Blockchain A (Ethereum)
                </div>
                <div className="bg-[#242424] p-4 rounded-lg text-center text-[#FF5AF7] font-medium w-5/12">
                  Blockchain B (TON)
                </div>
              </div>
              
              <div className="absolute left-1/2 transform -translate-x-1/2 top-20 flex items-center">
                <div className="h-0.5 w-48 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]"></div>
                <ArrowRight className="absolute left-1/3 -mt-3 text-[#6B00D7]" />
                <ArrowLeft className="absolute right-1/3 -mt-3 text-[#FF5AF7]" />
                <div className="absolute left-1/2 transform -translate-x-1/2 -mt-2">
                  <div className="bg-[#1D142E] p-2 rounded-full border border-[#6B00D7]">
                    <Shuffle className="h-4 w-4 text-[#FF5AF7]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-16 space-y-3">
            <div className="flex items-start">
              <div className="bg-[#6B00D7]/20 p-1.5 rounded-full mt-0.5 mr-3">
                <Shield className="h-4 w-4 text-[#FF5AF7]" />
              </div>
              <div>
                <p className="text-white font-medium">Trustless Exchange</p>
                <p className="text-sm text-gray-400">Trade directly between users without third-party custody of funds</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-[#6B00D7]/20 p-1.5 rounded-full mt-0.5 mr-3">
                <Zap className="h-4 w-4 text-[#FF5AF7]" />
              </div>
              <div>
                <p className="text-white font-medium">All-or-Nothing</p>
                <p className="text-sm text-gray-400">Either the trade completes fully or is cancelled completely with funds returned</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-[#6B00D7]/20 p-1.5 rounded-full mt-0.5 mr-3">
                <DollarSign className="h-4 w-4 text-[#FF5AF7]" />
              </div>
              <div>
                <p className="text-white font-medium">Native Assets Only</p>
                <p className="text-sm text-gray-400">Trades the original assets directly, no wrapped tokens involved</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Detailed Comparison Tabs */}
      <Tabs defaultValue="comparison" className="space-y-8">
        <TabsList className="grid w-full grid-cols-3 bg-[#1A1A1A] border border-[#333] p-1 rounded-lg">
          <TabsTrigger value="comparison" className="data-[state=active]:bg-[#6B00D7] data-[state=active]:text-white">
            Feature Comparison
          </TabsTrigger>
          <TabsTrigger value="use-cases" className="data-[state=active]:bg-[#6B00D7] data-[state=active]:text-white">
            Use Cases
          </TabsTrigger>
          <TabsTrigger value="implementation" className="data-[state=active]:bg-[#6B00D7] data-[state=active]:text-white">
            Implementation Guide
          </TabsTrigger>
        </TabsList>
        
        {/* Comparison Tab */}
        <TabsContent value="comparison">
          <Card className="bg-[#1A1A1A] border-[#333] shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl text-white">Feature by Feature Comparison</CardTitle>
              <CardDescription className="text-gray-400">
                Comparing bridges and swaps across key metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-[#1A1A1A] border-[#333]">
                    <TableHead className="text-gray-400">Feature</TableHead>
                    <TableHead className="text-[#6B00D7]">Cross-Chain Bridge</TableHead>
                    <TableHead className="text-[#FF5AF7]">Atomic Swap</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="hover:bg-[#1D142E] border-[#333]">
                    <TableCell className="font-medium text-white">Trust Model</TableCell>
                    <TableCell>Requires trust in bridge operators or validators</TableCell>
                    <TableCell>Completely trustless, secured by cryptography</TableCell>
                  </TableRow>
                  <TableRow className="hover:bg-[#1D142E] border-[#333]">
                    <TableCell className="font-medium text-white">Asset Types</TableCell>
                    <TableCell>Supports tokens and NFTs with wrapped versions</TableCell>
                    <TableCell>Only supports fungible tokens in their native form</TableCell>
                  </TableRow>
                  <TableRow className="hover:bg-[#1D142E] border-[#333]">
                    <TableCell className="font-medium text-white">Transaction Speed</TableCell>
                    <TableCell>Minutes to hours depending on confirmation requirements</TableCell>
                    <TableCell>Typically faster, but requires counterparty availability</TableCell>
                  </TableRow>
                  <TableRow className="hover:bg-[#1D142E] border-[#333]">
                    <TableCell className="font-medium text-white">Liquidity Requirements</TableCell>
                    <TableCell>Requires liquidity pools on destination chains</TableCell>
                    <TableCell>Requires matching counterparty with desired assets</TableCell>
                  </TableRow>
                  <TableRow className="hover:bg-[#1D142E] border-[#333]">
                    <TableCell className="font-medium text-white">Security Model</TableCell>
                    <TableCell>Varies by implementation (MPC, federation, etc.)</TableCell>
                    <TableCell>Hash Time-Locked Contracts (HTLCs)</TableCell>
                  </TableRow>
                  <TableRow className="hover:bg-[#1D142E] border-[#333]">
                    <TableCell className="font-medium text-white">Infrastructure Complexity</TableCell>
                    <TableCell>High - requires ongoing maintenance and monitoring</TableCell>
                    <TableCell>Medium - requires matching service but simpler overall</TableCell>
                  </TableRow>
                  <TableRow className="hover:bg-[#1D142E] border-[#333]">
                    <TableCell className="font-medium text-white">Scalability</TableCell>
                    <TableCell>Can handle high volumes but may face congestion</TableCell>
                    <TableCell>Limited by counterparty matching and contract complexity</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Use Cases Tab */}
        <TabsContent value="use-cases">
          <Card className="bg-[#1A1A1A] border-[#333] shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl text-white">Strategic Use Cases</CardTitle>
              <CardDescription className="text-gray-400">
                When to use each technology in your cross-chain strategy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <h3 className="text-lg font-medium flex items-center text-[#6B00D7]">
                      <Globe className="mr-2 h-5 w-5" />
                      When to Use Cross-Chain Bridges
                    </h3>
                    
                    <div className="bg-[#242424] p-4 rounded-lg border-l-4 border-[#6B00D7] space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="bg-[#6B00D7]/20 p-1.5 rounded-full mt-0.5">
                          <DollarSign className="h-4 w-4 text-[#FF5AF7]" />
                        </div>
                        <div>
                          <p className="text-white font-medium">Large Value Transfers</p>
                          <p className="text-sm text-gray-400">When moving significant amounts of assets between chains and liquidity is abundant</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="bg-[#6B00D7]/20 p-1.5 rounded-full mt-0.5">
                          <ReceiptIcon className="h-4 w-4 text-[#FF5AF7]" />
                        </div>
                        <div>
                          <p className="text-white font-medium">NFT or Complex Asset Transfers</p>
                          <p className="text-sm text-gray-400">When moving non-fungible tokens or complex digital assets across chains</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="bg-[#6B00D7]/20 p-1.5 rounded-full mt-0.5">
                          <Shield className="h-4 w-4 text-[#FF5AF7]" />
                        </div>
                        <div>
                          <p className="text-white font-medium">Institutional Usage</p>
                          <p className="text-sm text-gray-400">When formal audit trails and centralized accountability are required</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="bg-[#6B00D7]/20 p-1.5 rounded-full mt-0.5">
                          <Zap className="h-4 w-4 text-[#FF5AF7]" />
                        </div>
                        <div>
                          <p className="text-white font-medium">Chains Without Atomic Swap Support</p>
                          <p className="text-sm text-gray-400">When working with blockchains that don't support necessary primitives for atomic swaps</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 rounded-lg border border-[#333] space-y-4">
                      <h4 className="text-white font-medium">Recommended Bridges in Chronos Vault</h4>
                      
                      <div className="space-y-2">
                        <div className="bg-[#242424] p-3 rounded-lg flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#6B00D7] to-[#FF5AF7] flex items-center justify-center mr-3">
                              <span className="text-white font-bold text-xs">CV</span>
                            </div>
                            <span className="text-white">Chronos Bridge Pro</span>
                          </div>
                          <Button variant="ghost" size="sm" className="text-[#FF5AF7]">
                            Details <ChevronRight className="ml-1 h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="bg-[#242424] p-3 rounded-lg flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-[#333] flex items-center justify-center mr-3">
                              <span className="text-white font-bold text-xs">WH</span>
                            </div>
                            <span className="text-white">Wormhole Integration</span>
                          </div>
                          <Button variant="ghost" size="sm" className="text-[#FF5AF7]">
                            Details <ChevronRight className="ml-1 h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="bg-[#242424] p-3 rounded-lg flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-[#333] flex items-center justify-center mr-3">
                              <span className="text-white font-bold text-xs">AP</span>
                            </div>
                            <span className="text-white">Axelar Powered Transfers</span>
                          </div>
                          <Button variant="ghost" size="sm" className="text-[#FF5AF7]">
                            Details <ChevronRight className="ml-1 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-3">
                    <h3 className="text-lg font-medium flex items-center text-[#FF5AF7]">
                      <Shuffle className="mr-2 h-5 w-5" />
                      When to Use Atomic Swaps
                    </h3>
                    
                    <div className="bg-[#242424] p-4 rounded-lg border-l-4 border-[#FF5AF7] space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="bg-[#6B00D7]/20 p-1.5 rounded-full mt-0.5">
                          <Lock className="h-4 w-4 text-[#FF5AF7]" />
                        </div>
                        <div>
                          <p className="text-white font-medium">Absolute Security Requirements</p>
                          <p className="text-sm text-gray-400">When complete trustlessness and zero counterparty risk is essential</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="bg-[#6B00D7]/20 p-1.5 rounded-full mt-0.5">
                          <Server className="h-4 w-4 text-[#FF5AF7]" />
                        </div>
                        <div>
                          <p className="text-white font-medium">Peer-to-Peer Trades</p>
                          <p className="text-sm text-gray-400">When trading directly with another known party without intermediaries</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="bg-[#6B00D7]/20 p-1.5 rounded-full mt-0.5">
                          <Timer className="h-4 w-4 text-[#FF5AF7]" />
                        </div>
                        <div>
                          <p className="text-white font-medium">Speed-Critical Transfers</p>
                          <p className="text-sm text-gray-400">When transfer speed is more important than broad asset support</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="bg-[#6B00D7]/20 p-1.5 rounded-full mt-0.5">
                          <Compass className="h-4 w-4 text-[#FF5AF7]" />
                        </div>
                        <div>
                          <p className="text-white font-medium">Privacy-Focused Transactions</p>
                          <p className="text-sm text-gray-400">When minimizing transaction trail and visibility is important</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 rounded-lg border border-[#333] space-y-4">
                      <h4 className="text-white font-medium">Recommended Atomic Swap Solutions</h4>
                      
                      <div className="space-y-2">
                        <div className="bg-[#242424] p-3 rounded-lg flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#6B00D7] to-[#FF5AF7] flex items-center justify-center mr-3">
                              <span className="text-white font-bold text-xs">CV</span>
                            </div>
                            <span className="text-white">Chronos AtomicX</span>
                          </div>
                          <Button variant="ghost" size="sm" className="text-[#FF5AF7]">
                            Details <ChevronRight className="ml-1 h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="bg-[#242424] p-3 rounded-lg flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-[#333] flex items-center justify-center mr-3">
                              <span className="text-white font-bold text-xs">TH</span>
                            </div>
                            <span className="text-white">THORChain Integration</span>
                          </div>
                          <Button variant="ghost" size="sm" className="text-[#FF5AF7]">
                            Details <ChevronRight className="ml-1 h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="bg-[#242424] p-3 rounded-lg flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-[#333] flex items-center justify-center mr-3">
                              <span className="text-white font-bold text-xs">AL</span>
                            </div>
                            <span className="text-white">Atomic Labs P2P Exchange</span>
                          </div>
                          <Button variant="ghost" size="sm" className="text-[#FF5AF7]">
                            Details <ChevronRight className="ml-1 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Implementation Tab */}
        <TabsContent value="implementation">
          <Card className="bg-[#1A1A1A] border-[#333] shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl text-white">Implementation Guide</CardTitle>
              <CardDescription className="text-gray-400">
                Technical overview for implementing cross-chain transfers in Chronos Vault
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-[#242424] p-5 rounded-lg border border-[#333]">
                    <h3 className="text-lg font-medium text-[#6B00D7] mb-4 flex items-center">
                      <Globe className="mr-2 h-5 w-5" />
                      Bridge Implementation
                    </h3>
                    
                    <div className="space-y-4">
                      <p className="text-gray-400">
                        Implementing a cross-chain bridge in your Chronos Vault strategy requires
                        understanding several key components:
                      </p>
                      
                      <div className="space-y-3">
                        <div className="flex items-start">
                          <div className="bg-[#6B00D7]/20 p-1.5 rounded-full mt-0.5 mr-3 flex-shrink-0">
                            <span className="text-[#FF5AF7] text-xs font-bold">1</span>
                          </div>
                          <p className="text-sm text-white">Select provider(s) based on security model, liquidity, and supported chains</p>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="bg-[#6B00D7]/20 p-1.5 rounded-full mt-0.5 mr-3 flex-shrink-0">
                            <span className="text-[#FF5AF7] text-xs font-bold">2</span>
                          </div>
                          <p className="text-sm text-white">Implement vault approval interface for token locking</p>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="bg-[#6B00D7]/20 p-1.5 rounded-full mt-0.5 mr-3 flex-shrink-0">
                            <span className="text-[#FF5AF7] text-xs font-bold">3</span>
                          </div>
                          <p className="text-sm text-white">Configure transaction monitoring across both source and destination chains</p>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="bg-[#6B00D7]/20 p-1.5 rounded-full mt-0.5 mr-3 flex-shrink-0">
                            <span className="text-[#FF5AF7] text-xs font-bold">4</span>
                          </div>
                          <p className="text-sm text-white">Set up confirmation thresholds based on value transferred</p>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="bg-[#6B00D7]/20 p-1.5 rounded-full mt-0.5 mr-3 flex-shrink-0">
                            <span className="text-[#FF5AF7] text-xs font-bold">5</span>
                          </div>
                          <p className="text-sm text-white">Implement failure recovery mechanisms for incomplete transfers</p>
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full bg-[#6B00D7] hover:bg-[#5A00B6] text-white mt-2"
                        onClick={() => navigate('/cross-chain-bridge')}
                      >
                        View Bridge Integration Guide
                      </Button>
                    </div>
                  </div>
                  
                  <div className="bg-[#242424] p-5 rounded-lg border border-[#333]">
                    <h3 className="text-lg font-medium text-[#FF5AF7] mb-4 flex items-center">
                      <Shuffle className="mr-2 h-5 w-5" />
                      Atomic Swap Implementation
                    </h3>
                    
                    <div className="space-y-4">
                      <p className="text-gray-400">
                        Implementing atomic swaps requires a deeper understanding of the underlying
                        cryptographic primitives and blockchain capabilities:
                      </p>
                      
                      <div className="space-y-3">
                        <div className="flex items-start">
                          <div className="bg-[#6B00D7]/20 p-1.5 rounded-full mt-0.5 mr-3 flex-shrink-0">
                            <span className="text-[#FF5AF7] text-xs font-bold">1</span>
                          </div>
                          <p className="text-sm text-white">Implement Hash Time-Locked Contract (HTLC) mechanism in your vault</p>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="bg-[#6B00D7]/20 p-1.5 rounded-full mt-0.5 mr-3 flex-shrink-0">
                            <span className="text-[#FF5AF7] text-xs font-bold">2</span>
                          </div>
                          <p className="text-sm text-white">Create secure counterparty discovery mechanism or integrate with existing network</p>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="bg-[#6B00D7]/20 p-1.5 rounded-full mt-0.5 mr-3 flex-shrink-0">
                            <span className="text-[#FF5AF7] text-xs font-bold">3</span>
                          </div>
                          <p className="text-sm text-white">Design user interface for initiating and accepting atomic swap proposals</p>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="bg-[#6B00D7]/20 p-1.5 rounded-full mt-0.5 mr-3 flex-shrink-0">
                            <span className="text-[#FF5AF7] text-xs font-bold">4</span>
                          </div>
                          <p className="text-sm text-white">Build real-time transaction monitoring for both blockchains</p>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="bg-[#6B00D7]/20 p-1.5 rounded-full mt-0.5 mr-3 flex-shrink-0">
                            <span className="text-[#FF5AF7] text-xs font-bold">5</span>
                          </div>
                          <p className="text-sm text-white">Implement timelock expiration handling with automatic refunds</p>
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full bg-[#FF5AF7] hover:bg-[#E34DE6] text-white mt-2"
                        onClick={() => navigate('/cross-chain-atomic-swap')}
                      >
                        View Atomic Swap Guide
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#1D142E] p-6 rounded-lg border border-[#6B00D7]/50">
                  <h3 className="text-lg font-medium text-white mb-4">Chronos Vault Hybrid Approach</h3>
                  
                  <p className="text-gray-400 mb-4">
                    For optimal security and flexibility, Chronos Vault implements a hybrid approach that
                    leverages both technologies strategically:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-[#242424] p-3 rounded-lg">
                      <h4 className="text-white font-medium mb-2">High Value Transfers</h4>
                      <p className="text-sm text-gray-400">Multi-signature bridges with time-locks and enhanced security for large transfers</p>
                    </div>
                    
                    <div className="bg-[#242424] p-3 rounded-lg">
                      <h4 className="text-white font-medium mb-2">Fast Transfers</h4>
                      <p className="text-sm text-gray-400">Atomic swaps for speed-critical operations with established counterparties</p>
                    </div>
                    
                    <div className="bg-[#242424] p-3 rounded-lg">
                      <h4 className="text-white font-medium mb-2">Chain Optimization</h4>
                      <p className="text-sm text-gray-400">Dynamic routing to select optimal path based on gas fees and congestion</p>
                    </div>
                    
                    <div className="bg-[#242424] p-3 rounded-lg">
                      <h4 className="text-white font-medium mb-2">Risk Splitting</h4>
                      <p className="text-sm text-gray-400">Fragment large transfers across multiple routes for enhanced security</p>
                    </div>
                  </div>
                  
                  <Button className="w-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:opacity-90 text-white">
                    Explore Hybrid Implementation 
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="mt-12 bg-[#1A1A1A] p-6 rounded-xl border border-[#333] flex flex-col md:flex-row items-center justify-between">
        <div className="mb-4 md:mb-0 md:mr-6">
          <h3 className="text-xl font-bold text-white mb-2">Ready to implement cross-chain functionality?</h3>
          <p className="text-gray-400">Start building your vault strategy with our comprehensive guides</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            className="bg-[#6B00D7] hover:bg-[#5A00B6] text-white"
            onClick={() => navigate('/cross-chain-bridge')}
          >
            <Globe className="mr-2 h-4 w-4" />
            Configure Bridge
          </Button>
          <Button 
            className="bg-[#FF5AF7] hover:bg-[#E34DE6] text-white"
            onClick={() => navigate('/cross-chain-atomic-swap')}
          >
            <Shuffle className="mr-2 h-4 w-4" />
            Setup Atomic Swap
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BridgeVsSwapPage;