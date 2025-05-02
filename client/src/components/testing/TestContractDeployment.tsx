import React, { useState } from 'react';
import { BlockchainType, useMultiChain } from '@/contexts/multi-chain-context';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from '@/hooks/use-toast';
import { AlertCircle, Check, Code, Loader2, Power, Shield, Upload, Wallet } from 'lucide-react';
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

const defaultTonContract = `;; ChronosVault.fc
;; TON Smart Contract for Chronos Vault - Implements backup and recovery functionality

#include "imports/stdlib.fc";

;; Storage variables
global int vault_id;          ;; Unique vault identifier
global int unlock_time;       ;; Unix timestamp when vault unlocks
global int is_locked;         ;; 1 if locked, 0 if unlocked
global int recovery_mode;     ;; 1 if recovery mode enabled, 0 otherwise
global int backup_height;     ;; Last backup height for cross-chain verification
global slice owner_address;   ;; Address of the vault owner
global slice backup_data;     ;; Serialized backup data
global cell beneficiaries;    ;; Dictionary of beneficiary addresses and shares

;; Error codes
const int ERROR_NOT_OWNER = 101;
const int ERROR_VAULT_LOCKED = 102;
const int ERROR_RECOVERY_DISABLED = 103;
const int ERROR_INVALID_SIGNATURE = 104;
const int ERROR_INVALID_TIME = 105;
const int ERROR_INVALID_PROOF = 106;
const int ERROR_VAULT_UNLOCKED = 107;
const int ERROR_COOLDOWN_PERIOD = 108;

;; Load storage function
() load_data() impure {
    var ds = get_data().begin_parse();
    vault_id = ds~load_uint(64);
    unlock_time = ds~load_uint(64);
    is_locked = ds~load_uint(1);
    recovery_mode = ds~load_uint(1);
    backup_height = ds~load_uint(64);
    owner_address = ds~load_msg_addr();
    backup_data = ds~load_ref().begin_parse();
    beneficiaries = ds~load_dict();
    ds.end_parse();
}

;; Save storage function
() save_data() impure {
    set_data(begin_cell()
        .store_uint(vault_id, 64)
        .store_uint(unlock_time, 64)
        .store_uint(is_locked, 1)
        .store_uint(recovery_mode, 1)
        .store_uint(backup_height, 64)
        .store_slice(owner_address)
        .store_ref(begin_cell().store_slice(backup_data).end_cell())
        .store_dict(beneficiaries)
        .end_cell());
}

;; Verify Ethereum signature for cross-chain verification
int verify_ethereum_signature(slice signature, slice message_hash, slice public_key) method_id {
    ;; In real implementation, this would use ECDSA verification
    ;; For the prototype, we'll simulate a successful verification
    return 1; ;; 1 means valid
}

;; Verify Solana signature for cross-chain verification
int verify_solana_signature(slice signature, slice message_hash, slice public_key) method_id {
    ;; In real implementation, this would use ED25519 verification
    ;; For the prototype, we'll simulate a successful verification
    return 1; ;; 1 means valid
}

;; Check if vault is unlocked based on time
int is_unlocked_by_time() method_id {
    return now() >= unlock_time;
}

;; Verify cross-chain proof from Ethereum
int verify_ethereum_proof(slice proof_data) method_id {
    var ds = proof_data.begin_parse();
    var eth_block_hash = ds~load_uint(256);
    var eth_tx_hash = ds~load_uint(256);
    var eth_vault_id = ds~load_uint(64);
    var eth_unlock_time = ds~load_uint(64);
    
    ;; Check if the vault data matches
    if (eth_vault_id != vault_id) {
        return 0;
    }
    
    if (eth_unlock_time != unlock_time) {
        return 0;
    }
    
    ;; In a real implementation, we would verify the Ethereum block and transaction
    ;; For the prototype, we'll simulate verification success
    return 1;
}

;; Contract entry point for receiving internal messages
() recv_internal(int msg_value, cell in_msg_cell, slice in_msg) impure {
    ;; Check if this is a bounced message
    slice cs = in_msg_cell.begin_parse();
    int flags = cs~load_uint(4);
    if (flags & 1) { ;; Ignore bounced messages
        return ();
    }
    
    load_data();
    
    ;; Parse the message op code
    int op = in_msg~load_uint(32);
    
    ;; Sender address
    slice sender_address = in_msg~load_msg_addr();
    
    ;; Handle operations
    if (op == 1) { ;; Unlock request
        if (equal_slices(sender_address, owner_address)) {
            unlock_vault();
        } else {
            throw(ERROR_NOT_OWNER);
        }
    }
    
    if (op == 2) { ;; Backup state request
        if (equal_slices(sender_address, owner_address)) {
            backup_vault_state();
        } else {
            throw(ERROR_NOT_OWNER);
        }
    }
}

;; Unlock the vault function
() unlock_vault() impure {
    ;; Check if already unlocked
    if (~ is_locked) {
        throw(ERROR_VAULT_UNLOCKED);
    }
    
    ;; Check if natural unlock time has passed
    if (is_unlocked_by_time()) {
        is_locked = 0;
        save_data();
        return ();
    }
    
    ;; Otherwise, only owner can initiate emergency unlock
    throw(ERROR_VAULT_LOCKED);
}

;; Create a backup of the vault state
() backup_vault_state() impure {
    ;; Record current blockchain height
    backup_height = block.height;
    
    ;; Serialize vault state
    backup_data = begin_cell()
        .store_uint(vault_id, 64)
        .store_uint(unlock_time, 64)
        .store_uint(is_locked, 1)
        .store_uint(now(), 64)  ;; Backup timestamp
        .store_slice(owner_address)
        .store_dict(beneficiaries)
    .end_cell().begin_parse();
    
    save_data();
}

;; Public getter for vault details
(int, int, int, int, int, slice) get_vault_details() method_id {
    load_data();
    return (vault_id, unlock_time, is_locked, recovery_mode, backup_height, owner_address);
}
`;

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
  const multiChain = useMultiChain();
  const { chainStatus } = multiChain;
  const [activeChain, setActiveChain] = useState<BlockchainType>(BlockchainType.ETHEREUM);
  const [contractCode, setContractCode] = useState<string>(getSampleCode(BlockchainType.ETHEREUM));
  const [isCompiling, setIsCompiling] = useState<boolean>(false);
  const [isDeploying, setIsDeploying] = useState<boolean>(false);
  const [compileResult, setCompileResult] = useState<{success: boolean; message: string; compiledCode?: string} | null>(null);
  const [deployResult, setDeployResult] = useState<{success: boolean; address?: string; message: string} | null>(null);
  
  // Check if a chain is on testnet
  const checkIsTestnet = (chain: BlockchainType): boolean => {
    return chainStatus[chain]?.isTestnet !== false;
  };
  
  const handleVerify = async () => {
    if (!deployResult?.success || !deployResult.address) {
      toast({
        title: "Verification Error",
        description: "No successful deployment to verify",
        variant: "destructive"
      });
      return;
    }
    
    try {
      if (activeChain === BlockchainType.TON) {
        const { tonCompilerService } = await import('@/lib/ton/ton-compiler-service');
        const verificationResult = await tonCompilerService.verifyContract(deployResult.address);
        
        if (verificationResult.success) {
          toast({
            title: "Verification Successful",
            description: `Contract verified! Status: ${verificationResult.status}, Balance: ${verificationResult.balance} TON`,
            variant: "default"
          });
          
          // Add verification details to deployment result
          setDeployResult(prev => ({
            ...prev!,
            message: `${prev!.message}\nVerified: ${verificationResult.status}, Balance: ${verificationResult.balance} TON`
          }));
        } else {
          toast({
            title: "Verification Failed",
            description: verificationResult.error || "Unknown error",
            variant: "destructive"
          });
        }
      } else {
        // For other chains
        toast({
          title: "Feature Unavailable",
          description: "Contract verification for this chain is not fully implemented yet.",
          variant: "default"
        });
      }
    } catch (error: any) {
      console.error('Verification error:', error);
      toast({
        title: "Verification Error",
        description: error.message || "Unknown error",
        variant: "destructive"
      });
    }
  };
  
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
  
  const handleCompile = async () => {
    setIsCompiling(true);
    setCompileResult(null);
    
    try {
      if (activeChain === BlockchainType.TON) {
        // For TON, use our implemented compiler service
        const { tonCompilerService } = await import('@/lib/ton/ton-compiler-service');
        
        // Call the compileFunC method
        const result = await tonCompilerService.compileFunC(contractCode);
        
        if (result.success) {
          setCompileResult({
            success: true,
            message: 'Contract compiled successfully. Ready for deployment on TON testnet.',
            compiledCode: result.boc
          });
        } else {
          setCompileResult({
            success: false,
            message: result.error || 'Compilation failed with unknown error'
          });
        }
      } else {
        // For other chains, still simulate compilation for now
        // In a real application, we would call the respective service
        setTimeout(() => {
          // Simulate success
          setCompileResult({
            success: true,
            message: `Contract compiled successfully on ${activeChain} testnet (simulated)`
          });
        }, 2000);
      }
    } catch (error: any) {
      console.error('Compilation error:', error);
      setCompileResult({
        success: false,
        message: `Compilation error: ${error.message || 'Unknown error'}`
      });
    } finally {
      setIsCompiling(false);
    }
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

          // Call our new compiler service first, then deploy
          const { tonCompilerService } = await import('@/lib/ton/ton-compiler-service');
          
          // Use the result from compilation (or recompile if needed)
          const compiledCode = compileResult?.compiledCode;
          
          // Deploy using the compiler service
          let finalCompiledCode: string = compiledCode || '';
          if (!finalCompiledCode) {
            // If we don't have compiled code, compile it now
            const compileResult = await tonCompilerService.compileFunC(contractCode);
            finalCompiledCode = compileResult.success ? compileResult.boc || '' : '';
          }
          
          const result = await tonCompilerService.deployContract(finalCompiledCode,
            {
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
  const isWalletReady = chainStatus[activeChain]?.isConnected && checkIsTestnet(activeChain);
  
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
            {!chainStatus[activeChain]?.isConnected ? (
              <div className="space-y-4">
                <Alert variant="destructive" className="mb-4 bg-red-950/30 border-red-700/50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Wallet Not Connected</AlertTitle>
                  <AlertDescription>
                    You need to connect your {activeChain} wallet to compile and deploy contracts.
                  </AlertDescription>
                </Alert>
                
                <div className="flex justify-center">
                  <Button 
                    onClick={() => {
                      try {
                        multiChain.connectChain(activeChain);
                      } catch (error) {
                        console.error(`Error connecting to ${activeChain}:`, error);
                      }
                    }}
                    className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#7B10E7] hover:to-[#FF6AF7] text-white"
                  >
                    <Wallet className="h-4 w-4 mr-2" />
                    Connect {activeChain} Wallet
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between bg-[#121212]/40 border border-[#6B00D7]/20 rounded-lg p-3 mb-4">
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-sm text-green-300">{activeChain.charAt(0).toUpperCase() + activeChain.slice(1)} Wallet Connected</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    try {
                      multiChain.disconnectChain(activeChain);
                    } catch (error) {
                      console.error(`Error disconnecting from ${activeChain}:`, error);
                    }
                  }}
                  className="text-gray-400 hover:text-white hover:bg-red-900/30"
                >
                  <Power className="h-4 w-4 mr-1" />
                  Disconnect
                </Button>
              </div>
            )}
            
            {chainStatus[activeChain]?.isConnected && !checkIsTestnet(activeChain) && (
              <Alert variant="destructive" className="mb-4 bg-orange-950/30 border-orange-700/50">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Mainnet Detected</AlertTitle>
                <AlertDescription>
                  Test deployments can only be executed on testnets. Please switch to a testnet network.
                </AlertDescription>
              </Alert>
            )}
            
            <div>
              <Label className="text-sm font-medium text-white">Contract Code</Label>
              <Textarea 
                value={contractCode}
                onChange={handleCodeChange}
                className="mt-2 h-80 font-mono text-xs bg-[#121212] border-[#6B00D7]/30"
                placeholder={`// Enter your ${activeChain} contract code here`}
              />
            </div>
            
            {/* Deployment Parameters Form */}
            {compileResult?.success && activeChain === BlockchainType.TON && (
              <div className="border border-[#6B00D7]/30 rounded-lg p-3 mb-4 bg-[#121212]/40">
                <h3 className="text-sm font-medium text-white mb-2">Vault Configuration</h3>
                <div className="space-y-2">
                  <div>
                    <Label className="text-xs text-gray-300">Unlock Time</Label>
                    <div className="flex items-center">
                      <Input 
                        type="datetime-local" 
                        min={new Date().toISOString().slice(0, 16)}
                        defaultValue={new Date(Date.now() + 86400000).toISOString().slice(0, 16)} 
                        className="bg-[#121212] border-[#6B00D7]/20 text-xs mt-1" 
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-300">Security Level</Label>
                    <Select defaultValue="3">
                      <SelectTrigger className="bg-[#121212] border-[#6B00D7]/20 text-xs mt-1">
                        <SelectValue placeholder="Select security level" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#121212] border-[#6B00D7]/50">
                        <SelectItem value="1">Basic (TON Only)</SelectItem>
                        <SelectItem value="2">Enhanced (TON + ETH)</SelectItem>
                        <SelectItem value="3">Triple-Chain (TON + ETH + SOL)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-300">TON to Lock</Label>
                    <Input 
                      type="number" 
                      defaultValue="0.1" 
                      min="0.05" 
                      step="0.01" 
                      className="bg-[#121212] border-[#6B00D7]/20 text-xs mt-1" 
                    />
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex gap-3">
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

              {deployResult?.success && (
                <Button
                  onClick={handleVerify}
                  className="bg-gradient-to-r from-[#6B00D7]/90 to-[#37B9F1]/90 hover:from-[#7B10E7] hover:to-[#47C9FF] text-white"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Verify Contract
                </Button>
              )}
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
