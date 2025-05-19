import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { ArrowLeft, Shield, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Footer from '@/components/layout/footer';

export default function CrossChainSecurityPage() {
  const [_, navigate] = useLocation();
  const [vaultId, setVaultId] = useState('v-1746567000000-primary');
  const [txHash, setTxHash] = useState('0x7f23c5bd38b3f3402e168cf4133cf05d5be18dcbd0ffb364ae1b66e19c1c0d33');
  const [sourceChain, setSourceChain] = useState('Ethereum');
  const [requiredChains, setRequiredChains] = useState(['ETH', 'SOL', 'TON']);
  const [selectedPreset, setSelectedPreset] = useState('triple-chain');
  
  return (
    <div className="min-h-screen flex flex-col bg-black">
      <main className="flex-grow container mx-auto px-4 py-4 max-w-3xl">
        {/* Header with back button */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white bg-gradient-to-r from-white via-[#FF5AF7] to-[#6B00D7] bg-clip-text text-transparent">
              Cross-Chain Security Verification
            </h1>
          </div>
          <div className="flex items-center gap-1.5">
            <Shield className="h-5 w-5 text-[#FF5AF7]" />
            <span className="text-sm text-[#FF5AF7]">Triple-Chain Security™</span>
          </div>
        </div>
        
        {/* Main content */}
        <Card className="bg-black border border-gray-800 overflow-hidden">
          <CardHeader>
            <CardTitle className="text-xl text-white">Configure Verification Parameters</CardTitle>
            <p className="text-sm text-gray-400 mt-2">
              Set up the cross-chain verification parameters for your vault
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="vault-id">Vault ID</Label>
              <Input
                id="vault-id"
                value={vaultId}
                onChange={(e) => setVaultId(e.target.value)}
                className="bg-black border-gray-800 text-white"
                placeholder="Enter vault ID"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tx-hash">Transaction Hash</Label>
              <Input
                id="tx-hash"
                value={txHash}
                onChange={(e) => setTxHash(e.target.value)}
                className="bg-black border-gray-800 text-white font-mono"
                placeholder="Enter transaction hash"
              />
              <p className="text-xs text-gray-400">
                Enter the transaction hash to verify across multiple blockchains
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="source-chain">Source Blockchain</Label>
              <Select
                value={sourceChain}
                onValueChange={(value) => setSourceChain(value)}
              >
                <SelectTrigger id="source-chain" className="bg-black border-gray-800 text-white">
                  <SelectValue placeholder="Select source blockchain" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-800 text-white">
                  <SelectItem value="Ethereum">Ethereum</SelectItem>
                  <SelectItem value="Solana">Solana</SelectItem>
                  <SelectItem value="TON">TON</SelectItem>
                  <SelectItem value="Bitcoin">Bitcoin</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-400">
                The blockchain where the transaction originated
              </p>
            </div>
            
            <div className="space-y-2">
              <Label>Required Blockchains</Label>
              <Tabs defaultValue="presets" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-black border border-gray-800">
                  <TabsTrigger value="presets">Presets</TabsTrigger>
                  <TabsTrigger value="custom">Custom</TabsTrigger>
                </TabsList>
                
                <TabsContent value="presets" className="space-y-4 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setRequiredChains(['ETH', 'SOL', 'TON']);
                      setSelectedPreset('triple-chain');
                    }}
                    className={`w-full flex justify-between items-center border transition-all ${
                      selectedPreset === 'triple-chain'
                        ? 'bg-[#6B00D7]/20 border-[#6B00D7] text-white'
                        : 'bg-gray-900/20 border-gray-800 text-gray-300 hover:bg-gray-800/30'
                    }`}
                  >
                    <div className="text-left">
                      <p className="font-medium">Triple-Chain</p>
                      <p className="text-xs text-gray-400">ETH + SOL + TON</p>
                    </div>
                    <Shield className="h-4 w-4 ml-2" />
                  </Button>
                </TabsContent>
                
                <TabsContent value="custom" className="space-y-4 pt-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="eth-chain"
                      checked={requiredChains.includes('ETH')}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setRequiredChains([...requiredChains, 'ETH']);
                        } else {
                          setRequiredChains(requiredChains.filter(chain => chain !== 'ETH'));
                        }
                      }}
                      className="rounded bg-black border-gray-700 text-[#6B00D7]"
                    />
                    <Label htmlFor="eth-chain">Ethereum (ETH)</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="sol-chain"
                      checked={requiredChains.includes('SOL')}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setRequiredChains([...requiredChains, 'SOL']);
                        } else {
                          setRequiredChains(requiredChains.filter(chain => chain !== 'SOL'));
                        }
                      }}
                      className="rounded bg-black border-gray-700 text-[#6B00D7]"
                    />
                    <Label htmlFor="sol-chain">Solana (SOL)</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="ton-chain"
                      checked={requiredChains.includes('TON')}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setRequiredChains([...requiredChains, 'TON']);
                        } else {
                          setRequiredChains(requiredChains.filter(chain => chain !== 'TON'));
                        }
                      }}
                      className="rounded bg-black border-gray-700 text-[#6B00D7]"
                    />
                    <Label htmlFor="ton-chain">TON</Label>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            <div className="pt-4">
              <Button 
                className="w-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] text-white hover:opacity-90"
                onClick={() => navigate('/security-verification')}
              >
                Begin Verification
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
}
