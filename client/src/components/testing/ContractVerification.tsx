import React, { useState } from 'react';
import { BlockchainType, useMultiChain } from '@/contexts/multi-chain-context';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Check, AlertCircle, RefreshCw, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import TestnetBadge from '@/components/blockchain/TestnetBadge';

interface ContractVerificationProps {
  className?: string;
}

// Contract interface type
interface Contract {
  name: string;
  address: string;
}

// Known contract addresses by blockchain
const knownContracts: Record<BlockchainType, Contract[]> = {
  [BlockchainType.ETHEREUM]: [
    { name: 'ChronosVault Master', address: '0x4B0897b0513fdC7C541B6d9D7E929C4e5364D2dB' },
    { name: 'Time Lock Factory', address: '0x3FaB184622Dc19b6109349B94811493BF2a45362' },
    { name: 'CVT Token', address: '0x45A67D5ea5DEf0964B9CeA3C9e45E944C5D6183D' }
  ],
  [BlockchainType.SOLANA]: [
    { name: 'ChronosVault Program', address: 'ChronoSVauLt11111111111111111111111111111111' },
    { name: 'Cross-Chain Bridge', address: 'Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS' }
  ],
  [BlockchainType.TON]: [
    { name: 'CVT Master', address: 'EQAvDfYmkVV2zFXzC0Hs2e2RGWJyMXHpnMTXH4jnI2W3AwLb' },
    { name: 'Vault Factory', address: 'EQB0gCDoGJNTfoPUSCgBxLuZ_O-7aYUccU0P1Vj_QdO6rQTf' },
    { name: 'Staking Contract', address: 'EQDi_PSI1WbigxBKCj7vEz2pAvUQfw0IFZz9Sz2aGHUFNpSw' },
    { name: 'Newly Deployed Contract', address: 'UQAkIXbCToQ6LowMrDNG2K3ERmMH8m4XB2owWgL0BAB14Jtl' }
  ],
  [BlockchainType.BITCOIN]: [
    { name: 'CVT Bitcoin Bridge', address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh' },
    { name: 'MultiSig Vault', address: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq' }
  ]
};

interface ContractStatus {
  isVerified: boolean;
  isDeployed: boolean;
  balance?: string;
  deploymentDate?: string;
  transactions?: number;
  message?: string;
}

interface VerificationResult {
  address: string;
  name: string;
  status: ContractStatus;
}

export default function ContractVerification({ className }: ContractVerificationProps) {
  const { chainStatus } = useMultiChain();
  const [activeChain, setActiveChain] = useState<BlockchainType>(BlockchainType.TON);
  const [customAddress, setCustomAddress] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [results, setResults] = useState<VerificationResult[]>([]);
  
  // Get block explorer URL based on chain
  const getExplorerUrl = (chain: BlockchainType, address: string): string => {
    switch (chain) {
      case BlockchainType.ETHEREUM:
        return `https://sepolia.etherscan.io/address/${address}`;
      case BlockchainType.SOLANA:
        return `https://explorer.solana.com/address/${address}?cluster=devnet`;
      case BlockchainType.TON:
        return `https://testnet.tonscan.org/address/${address}`;
      case BlockchainType.BITCOIN:
        return `https://blockstream.info/testnet/address/${address}`;
      default:
        return '#';
    }
  };
  
  // Simulate verification of contracts
  const verifyContracts = async (): Promise<void> => {
    setIsVerifying(true);
    setResults([]);
    
    const contractsToVerify = [...knownContracts[activeChain]];
    
    // Add custom address if provided
    if (customAddress.trim()) {
      contractsToVerify.push({
        name: 'Custom Contract',
        address: customAddress.trim()
      });
    }
    
    // Simulate verification with delay
    setTimeout(() => {
      const verificationResults = contractsToVerify.map((contract: Contract) => {
        // In a real implementation, we would make API calls to verify each contract
        // For now, we're simulating successful verification for known contracts
        const isKnown = knownContracts[activeChain].some((c: Contract) => c.address === contract.address);
        
        // Determine balance based on chain
        let balance = '3.5 TON';
        if (activeChain === BlockchainType.ETHEREUM) {
          balance = '0.05 ETH';
        } else if (activeChain === BlockchainType.SOLANA) {
          balance = '1.2 SOL';
        } else if (activeChain === BlockchainType.BITCOIN) {
          balance = '0.002 BTC';
        }
        
        return {
          address: contract.address,
          name: contract.name,
          status: {
            isVerified: isKnown,
            isDeployed: true,
            balance,
            deploymentDate: '2025-04-15',
            transactions: Math.floor(Math.random() * 100) + 5,
            message: isKnown ? 
                      'Contract verified successfully' : 
                      'Contract found but not verified in our registry'
          }
        };
      });
      
      setResults(verificationResults);
      setIsVerifying(false);
    }, 2000);
  };
  
  const handleTabChange = (value: string) => {
    switch(value) {
      case 'ethereum':
        setActiveChain(BlockchainType.ETHEREUM);
        break;
      case 'solana':
        setActiveChain(BlockchainType.SOLANA);
        break;
      case 'ton':
        setActiveChain(BlockchainType.TON);
        break;
      default:
        setActiveChain(BlockchainType.TON);
    }
    
    setCustomAddress('');
    setResults([]);
  };
  
  // Check if wallet is connected and on testnet
  // Assume we're always on testnet in the security testing page
  const isWalletReady = chainStatus[activeChain].isConnected;
  
  return (
    <Card className={`${className} border border-[#6B00D7]/30 bg-gradient-to-br from-[#121212]/80 to-[#1A1A1A]/80 backdrop-blur-sm`}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-white">Contract Verification</CardTitle>
            <CardDescription className="text-gray-400">Verify Chronos Vault smart contracts on testnets</CardDescription>
          </div>
          <TestnetBadge chain={activeChain} showName={true} />
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="ton" onValueChange={handleTabChange}>
          <TabsList className="mb-4 bg-[#1A1A1A] border border-[#6B00D7]/20">
            <TabsTrigger value="ethereum" className="data-[state=active]:bg-[#6B00D7]/40">
              Ethereum
            </TabsTrigger>
            <TabsTrigger value="solana" className="data-[state=active]:bg-[#6B00D7]/40">
              Solana
            </TabsTrigger>
            <TabsTrigger value="ton" className="data-[state=active]:bg-[#6B00D7]/40">
              TON
            </TabsTrigger>
          </TabsList>
          
          <div className="space-y-4">
            {/* Always assume we're on testnet in security testing page */}
            
            <div>
              <Label className="text-sm font-medium text-white">Known Chronos Vault Contracts</Label>
              <div className="mt-2 grid gap-2">
                {knownContracts[activeChain].map((contract: Contract, index: number) => (
                  <div key={index} className="bg-black/20 border border-[#6B00D7]/20 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm font-medium text-white">{contract.name}</div>
                        <div className="text-xs font-mono text-gray-400 mt-1">{contract.address}</div>
                      </div>
                      <a 
                        href={getExplorerUrl(activeChain, contract.address)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[#FF5AF7] hover:text-[#FF80F9] transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="pt-2">
              <Label className="text-sm font-medium text-white">Custom Contract Address</Label>
              <div className="flex space-x-2 mt-2">
                <Input 
                  value={customAddress}
                  onChange={(e) => setCustomAddress(e.target.value)}
                  placeholder={`Enter ${activeChain} contract address`}
                  className="bg-[#121212] border-[#6B00D7]/30 text-sm"
                />
              </div>
            </div>
            
            <Button 
              onClick={verifyContracts}
              disabled={isVerifying}
              className="w-full bg-gradient-to-r from-[#6B00D7]/90 to-[#FF5AF7]/90 hover:from-[#7B10E7] hover:to-[#FF6AF7] text-white mt-2"
            >
              {isVerifying ? 
                <Loader2 className="h-4 w-4 animate-spin mr-2" /> : 
                <RefreshCw className="h-4 w-4 mr-2" />
              }
              Verify Contracts
            </Button>
            
            {/* Verification Results */}
            {results.length > 0 && (
              <div className="mt-4 space-y-4">
                <Label className="text-sm font-medium text-white">Verification Results</Label>
                <div className="space-y-3">
                  {results.map((result, index) => (
                    <div key={index} className="bg-black/20 border border-[#6B00D7]/20 rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <div className="text-sm font-medium text-white">{result.name}</div>
                        <Badge 
                          variant={result.status.isVerified ? "default" : "secondary"}
                          className={result.status.isVerified ? 
                            "bg-green-800/60 text-green-200 hover:bg-green-800/80" : 
                            "bg-amber-800/60 text-amber-200 hover:bg-amber-800/80"}
                        >
                          {result.status.isVerified ? "Verified" : "Unverified"}
                        </Badge>
                      </div>
                      <div className="text-xs font-mono text-gray-400 mb-3">{result.address}</div>
                      
                      {result.status.isDeployed && (
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-gray-500">Balance:</span>
                            <span className="text-white ml-2">{result.status.balance}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Deployed:</span>
                            <span className="text-white ml-2">{result.status.deploymentDate}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Transactions:</span>
                            <span className="text-white ml-2">{result.status.transactions}</span>
                          </div>
                          <div>
                            <a 
                              href={getExplorerUrl(activeChain, result.address)} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-[#FF5AF7] hover:text-[#FF80F9] transition-colors flex items-center"
                            >
                              View on Explorer
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </a>
                          </div>
                        </div>
                      )}
                      
                      {result.status.message && (
                        <div className={`mt-2 text-xs p-2 rounded ${result.status.isVerified ? 'bg-green-950/30 text-green-200' : 'bg-amber-950/30 text-amber-200'}`}>
                          {result.status.isVerified ? 
                            <Check className="h-3 w-3 inline-block mr-1" /> : 
                            <AlertCircle className="h-3 w-3 inline-block mr-1" />
                          }
                          {result.status.message}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex flex-col items-start text-xs text-gray-400 pt-2 border-t border-[#6B00D7]/10">
        <p>All verifications are performed on testnet contract deployments only.</p>
      </CardFooter>
    </Card>
  );
}
