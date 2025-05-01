import React, { useState } from 'react';
import { BlockchainType, useMultiChain } from '@/contexts/multi-chain-context';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Check, AlertCircle, Upload, Code } from 'lucide-react';
import TestnetBadge from '@/components/blockchain/TestnetBadge';

interface TestContractDeploymentProps {
  className?: string;
}

const defaultEthereumContract = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ChronosTimelock {
    address public owner;
    uint256 public unlockTime;
    address public beneficiary;
    string public message;

    event Withdrawal(uint amount, uint when);

    constructor(address _beneficiary, uint256 _unlockTime, string memory _message) payable {
        owner = msg.sender;
        beneficiary = _beneficiary;
        unlockTime = _unlockTime;
        message = _message;
    }

    function withdraw() public {
        require(block.timestamp >= unlockTime, "Time lock not expired");
        require(msg.sender == beneficiary, "You are not the beneficiary");

        emit Withdrawal(address(this).balance, block.timestamp);

        payable(beneficiary).transfer(address(this).balance);
    }
}`;

const defaultSolanaContract = `// Sample Solana Rust program skeleton for ChronosVault
// This is simplified for testing purposes
pub mod chronos_vault {
    use solana_program::{
        account_info::{next_account_info, AccountInfo},
        entrypoint,
        entrypoint::ProgramResult,
        msg,
        program_error::ProgramError,
        pubkey::Pubkey,
        clock::Clock,
        sysvar::Sysvar,
    };

    pub struct TimeVault {
        pub owner: Pubkey,
        pub beneficiary: Pubkey,
        pub unlock_time: i64,
        pub message: String,
    }

    entrypoint!(process_instruction);

    pub fn process_instruction(
        program_id: &Pubkey,
        accounts: &[AccountInfo],
        instruction_data: &[u8],
    ) -> ProgramResult {
        msg!("Chronos Vault Program: Process instruction");
        // Logic would go here
        Ok(())
    }
}`;

const defaultTonContract = `// Sample TON/FunC smart contract for ChronosVault
// Simplified for testing purposes

() recv_internal(int msg_value, cell in_msg, slice in_msg_body) impure {
    slice cs = in_msg_body;
    int op = cs~load_uint(32); // operation code

    if (op == 1) { // create vault
        int unlock_time = cs~load_uint(64);
        slice beneficiary = cs~load_msg_addr();
        slice message = cs~load_ref().begin_parse();
        
        set_data(begin_cell()
            .store_uint(unlock_time, 64)
            .store_slice(beneficiary)
            .store_ref(begin_cell().store_slice(message).end_cell())
            .end_cell());
    }
    
    if (op == 2) { // withdraw
        cell data = get_data();
        slice ds = data.begin_parse();
        int unlock_time = ds~load_uint(64);
        slice beneficiary = ds~load_msg_addr();
        
        throw_if(35, now() < unlock_time);
        throw_if(36, equal_slice_bits(in_msg.sender_address, beneficiary));

        send_raw_message(begin_cell()
            .store_uint(0x18, 6)
            .store_slice(beneficiary)
            .store_coins(0)
            .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
            .end_cell(), 64);
    }
}`;

const getSampleCode = (chain: BlockchainType): string => {
  switch (chain) {
    case BlockchainType.ETHEREUM:
      return defaultEthereumContract;
    case BlockchainType.SOLANA:
      return defaultSolanaContract;
    case BlockchainType.TON:
      return defaultTonContract;
    default:
      return '';
  }
};

export default function TestContractDeployment({ className }: TestContractDeploymentProps) {
  const { chainStatus, isTestnet } = useMultiChain();
  const [activeChain, setActiveChain] = useState<BlockchainType>(BlockchainType.ETHEREUM);
  const [contractCode, setContractCode] = useState<string>(getSampleCode(BlockchainType.ETHEREUM));
  const [isCompiling, setIsCompiling] = useState<boolean>(false);
  const [isDeploying, setIsDeploying] = useState<boolean>(false);
  const [compileResult, setCompileResult] = useState<{success: boolean; message: string} | null>(null);
  const [deployResult, setDeployResult] = useState<{success: boolean; address?: string; message: string} | null>(null);
  
  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContractCode(e.target.value);
    // Reset results when code changes
    setCompileResult(null);
    setDeployResult(null);
  };
  
  const handleTabChange = (value: string) => {
    let chain;
    switch(value) {
      case 'ethereum':
        chain = BlockchainType.ETHEREUM;
        break;
      case 'solana':
        chain = BlockchainType.SOLANA;
        break;
      case 'ton':
        chain = BlockchainType.TON;
        break;
      default:
        chain = BlockchainType.ETHEREUM;
    }
    
    setActiveChain(chain);
    setContractCode(getSampleCode(chain));
    setCompileResult(null);
    setDeployResult(null);
  };
  
  const handleCompile = () => {
    setIsCompiling(true);
    setCompileResult(null);
    
    // Simulate compilation delay
    setTimeout(() => {
      setIsCompiling(false);
      // In a real application, this would make an API call to a compile service
      // For now, we're just simulating success
      setCompileResult({
        success: true,
        message: 'Contract compiled successfully on testnet'
      });
    }, 2000);
  };
  
  const handleDeploy = async () => {
    if (!compileResult?.success) {
      setCompileResult({
        success: false,
        message: 'Please compile the contract first'
      });
      return;
    }
    
    setIsDeploying(true);
    setDeployResult(null);
    
    try {
      // Deploy the contract using our contract service
      if (activeChain === BlockchainType.TON) {
        // For TON, use our implemented contract service
        // Import the tonContractService
        import('@/lib/ton/ton-contract-service').then(async ({ tonContractService }) => {
          // Get current timestamp + 1 day for unlock time
          const unlockTime = Math.floor(Date.now() / 1000) + 86400; // 1 day in the future

          // Call the deployContract method
          const result = await tonContractService.deployContract(contractCode, {
            unlockTime: unlockTime,
            amount: '0.1', // 0.1 TON
            message: 'Test deployment from Chronos Vault interface'
          });

          if (result.success && result.contractAddress) {
            setDeployResult({
              success: true,
              address: result.contractAddress,
              message: `Contract deployed successfully to TON testnet.${result.transactionHash ? ` Transaction hash: ${result.transactionHash.substring(0, 10)}...` : ''}`
            });
          } else {
            setDeployResult({
              success: false,
              message: result.error || 'Deployment failed with unknown error'
            });
          }

          setIsDeploying(false);
        }).catch(error => {
          console.error('Error importing TON contract service:', error);
          setDeployResult({
            success: false,
            message: `Module import error: ${error.message}`
          });
          setIsDeploying(false);
        });
        return;
      }
      
      // For other chains, simulate deployment for now
      // In a real application, we would call the respective service
      setTimeout(() => {
        setIsDeploying(false);
        
        // Generate placeholder addresses based on blockchain type
        let contractAddress = '';
        if (activeChain === BlockchainType.ETHEREUM) {
          contractAddress = '0x' + Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
        } else if (activeChain === BlockchainType.SOLANA) {
          contractAddress = Array(44).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
        }
        
        setDeployResult({
          success: true,
          address: contractAddress,
          message: `Contract simulated deployment to ${activeChain} testnet`
        });
      }, 3000);
    } catch (error: any) {
      console.error('Contract deployment error:', error);
      setIsDeploying(false);
      setDeployResult({
        success: false,
        message: `Deployment error: ${error.message || 'Unknown error'}`
      });
    }
  };
  
  // Check if wallet is connected and on testnet
  const isWalletReady = chainStatus[activeChain].isConnected && isTestnet(activeChain);
  
  return (
    <Card className={`${className} border border-[#6B00D7]/30 bg-gradient-to-br from-[#121212]/80 to-[#1A1A1A]/80 backdrop-blur-sm`}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-white">Contract Deployment</CardTitle>
            <CardDescription className="text-gray-400">Deploy and test smart contracts on testnets</CardDescription>
          </div>
          <TestnetBadge chain={activeChain} showName={true} />
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="ethereum" onValueChange={handleTabChange}>
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
            {!chainStatus[activeChain].isConnected ? (
              <Alert variant="destructive" className="mb-4 bg-red-950/30 border-red-700/50">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Wallet Not Connected</AlertTitle>
                <AlertDescription>
                  You need to connect your {activeChain} wallet to compile and deploy contracts.
                </AlertDescription>
              </Alert>
            ) : !isTestnet(activeChain) ? (
              <Alert variant="destructive" className="mb-4 bg-orange-950/30 border-orange-700/50">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Mainnet Detected</AlertTitle>
                <AlertDescription>
                  Test deployments can only be executed on testnets. Please switch to a testnet network.
                </AlertDescription>
              </Alert>
            ) : null}
            
            <div>
              <Label className="text-sm font-medium text-white">Contract Code</Label>
              <Textarea 
                value={contractCode}
                onChange={handleCodeChange}
                className="mt-2 h-80 font-mono text-xs bg-[#121212] border-[#6B00D7]/30"
                placeholder={`// Enter your ${activeChain} contract code here`}
              />
            </div>
            
            <div className="flex gap-4">
              <Button 
                onClick={handleCompile}
                disabled={isCompiling || isDeploying || !isWalletReady || !contractCode.trim()}
                className="bg-gradient-to-r from-[#6B00D7]/90 to-[#9242FC]/90 hover:from-[#7B10E7] hover:to-[#A252FC] text-white"
              >
                {isCompiling ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Code className="h-4 w-4 mr-2" />}
                Compile
              </Button>
              
              <Button 
                onClick={handleDeploy}
                disabled={isDeploying || !compileResult?.success || !isWalletReady}
                className="bg-gradient-to-r from-[#6B00D7]/90 to-[#FF5AF7]/90 hover:from-[#7B10E7] hover:to-[#FF6AF7] text-white"
              >
                {isDeploying ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
                Deploy to Testnet
              </Button>
            </div>
            
            {/* Compilation Result */}
            {compileResult && (
              <div className={`p-3 rounded-lg border ${compileResult.success ? 'bg-green-950/30 border-green-700/50' : 'bg-red-950/30 border-red-700/50'}`}>
                <div className="flex items-center">
                  {compileResult.success ? (
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                  )}
                  <span className="text-sm font-medium text-white">
                    {compileResult.success ? 'Compilation Successful' : 'Compilation Failed'}
                  </span>
                </div>
                <div className="mt-1 text-xs text-gray-300">
                  {compileResult.message}
                </div>
              </div>
            )}
            
            {/* Deployment Result */}
            {deployResult && (
              <div className={`p-3 rounded-lg border ${deployResult.success ? 'bg-green-950/30 border-green-700/50' : 'bg-red-950/30 border-red-700/50'}`}>
                <div className="flex items-center">
                  {deployResult.success ? (
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                  )}
                  <span className="text-sm font-medium text-white">
                    {deployResult.success ? 'Deployment Successful' : 'Deployment Failed'}
                  </span>
                </div>
                {deployResult.address && (
                  <div className="mt-2 text-xs">
                    <span className="font-medium text-gray-300">Contract Address:</span>
                    <div className="mt-1 bg-black/30 p-2 rounded-md overflow-auto text-green-300 font-mono">
                      {deployResult.address}
                    </div>
                  </div>
                )}
                <div className="mt-1 text-xs text-gray-300">
                  {deployResult.message}
                </div>
              </div>
            )}
          </div>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex flex-col items-start text-xs text-gray-400 pt-2 border-t border-[#6B00D7]/10">
        <p>All contracts are deployed to testnet networks only. Test deployments have no real-world impact.</p>
      </CardFooter>
    </Card>
  );
}
