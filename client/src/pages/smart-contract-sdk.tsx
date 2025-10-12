import React from "react";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowRight, Download, FileCode, AlertCircle, Info, Shield, CodeXml } from "lucide-react";
import DocumentationLayout from "@/components/layout/DocumentationLayout";

const SmartContractSDK = () => {
  return (
    <DocumentationLayout title="Smart Contract SDK" description="Blockchain smart contract interfaces for Chronos Vault integration">
      <div className="container mx-auto p-4 space-y-8">
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-center justify-between">
            <div className="space-y-4 max-w-2xl">
              <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]">
                Smart Contract Integration
              </h1>
              <p className="text-lg text-gray-200">
                The Chronos Vault Smart Contract SDK provides a comprehensive set of blockchain interfaces 
                for integrating with our multi-chain vault infrastructure. Build secure, time-locked digital 
                vaults directly into your smart contracts across Ethereum, TON, and Solana blockchains.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild className="bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700">
                  <Link href="#contract-interfaces">View Interfaces</Link>
                </Button>
                <Button asChild variant="outline">
                  <a href="https://github.com/chronos-vault/smart-contracts" target="_blank" rel="noopener noreferrer">
                    Visit GitHub Repository
                  </a>
                </Button>
              </div>
            </div>
            <div className="hidden lg:flex w-80 h-80 bg-gradient-to-br from-[#6B00D7]/20 to-[#FF5AF7]/20 rounded-full items-center justify-center">
              <div className="w-72 h-72 bg-gradient-to-br from-[#6B00D7]/30 to-[#FF5AF7]/30 rounded-full flex items-center justify-center">
                <div className="w-64 h-64 bg-gradient-to-br from-[#6B00D7]/40 to-[#FF5AF7]/40 rounded-full flex items-center justify-center">
                  <CodeXml className="w-32 h-32 text-[#FF5AF7]" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <Separator className="my-8 bg-gray-800" />

        <section className="space-y-6">
          <h2 className="text-2xl font-bold">Supported Blockchains</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-black/20 border border-gray-800 hover:border-[#FF5AF7]/50 transition-all group">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <svg className="h-6 w-6 text-[#627EEA]" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z" fill="#627EEA"/>
                    <path d="M16 4V12.87L24 16.22L16 4Z" fill="white" fillOpacity="0.6"/>
                    <path d="M16 4L8 16.22L16 12.87V4Z" fill="white"/>
                    <path d="M16 21.968V27.995L24 17.616L16 21.968Z" fill="white" fillOpacity="0.6"/>
                    <path d="M16 27.995V21.967L8 17.616L16 27.995Z" fill="white"/>
                    <path d="M16 20.573L24 16.221L16 12.872V20.573Z" fill="white" fillOpacity="0.2"/>
                    <path d="M8 16.221L16 20.573V12.872L8 16.221Z" fill="white" fillOpacity="0.6"/>
                  </svg>
                  Ethereum
                </CardTitle>
                <CardDescription>
                  Solidity smart contracts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400">
                  EVM-compatible smart contracts for Ethereum and related chains (Polygon, Arbitrum, Optimism, etc).
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full group-hover:border-[#FF5AF7]/50 group-hover:text-[#FF5AF7] transition-all">
                  <a href="#ethereum-contracts">View Ethereum Contracts</a>
                </Button>
              </CardFooter>
            </Card>

            <Card className="bg-black/20 border border-gray-800 hover:border-[#FF5AF7]/50 transition-all group">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <svg className="h-6 w-6" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.2637 13.5919C16.0019 14.8867 14.6455 16.1175 14.6455 17.5395C14.6455 18.9613 16.2121 19.4675 18.2637 18.2901V13.5919Z" fill="#0098EA"/>
                    <path d="M18.2637 18.2901V13.5919C20.5255 12.2968 21.882 11.0661 21.882 9.64406C21.882 8.22233 20.3154 7.71613 18.2637 8.89353V4.19531C13.4824 6.61736 5.5 10.8328 5.5 17.5393C5.5 24.2457 13.4824 28.4612 18.2637 30.8833V26.1851C16.2121 24.9574 14.6455 24.4515 14.6455 23.0294C14.6455 21.6076 16.001 20.3769 18.2637 19.0817V18.2901Z" fill="#0098EA"/>
                    <path d="M21.882 17.5394C21.882 16.1175 20.5255 14.8868 18.2637 13.5919V18.2901C20.3154 19.4675 21.882 18.9613 21.882 17.5394Z" fill="#0098EA"/>
                    <path d="M18.2637 8.89331V13.5915C20.5255 14.8864 21.882 16.1172 21.882 17.5392C21.882 18.9611 20.3154 19.4673 18.2637 18.2899V19.0815C20.5255 20.3766 21.882 21.6074 21.882 23.0294C21.882 24.4514 20.3154 24.9573 18.2637 23.7851V28.4833C23.045 26.0613 31.0274 21.8458 31.0274 15.1394C31.0274 8.43295 23.045 4.21751 18.2637 1.79541V6.49363C20.3154 7.72131 21.882 8.22722 21.882 9.64916C21.882 11.0709 20.5265 12.3017 18.2637 13.5969V8.89331Z" fill="#0098EA"/>
                  </svg>
                  TON
                </CardTitle>
                <CardDescription>
                  FunC smart contracts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400">
                  TON-compatible smart contracts using FunC language for the fast and scalable TON blockchain.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full group-hover:border-[#FF5AF7]/50 group-hover:text-[#FF5AF7] transition-all">
                  <a href="#ton-contracts">View TON Contracts</a>
                </Button>
              </CardFooter>
            </Card>

            <Card className="bg-black/20 border border-gray-800 hover:border-[#FF5AF7]/50 transition-all group">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <svg className="h-6 w-6" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21.7838 8.65446C21.6512 8.65446 21.5186 8.68736 21.3941 8.75315L10.1279 14.8206C9.63147 15.0809 9.63147 15.7831 10.1279 16.0434L21.3941 22.1108C21.7426 22.3053 22.1736 22.1697 22.3682 21.8211C22.5628 21.4726 22.4272 21.0416 22.0786 20.847L11.9474 15.4319L22.0786 10.0167C22.4272 9.82216 22.5628 9.39117 22.3682 9.04266C22.2394 9.04266 22.0118 8.65446 21.7838 8.65446Z" fill="#14F195"/>
                    <path d="M22.7334 4.00003C27.9373 4.00003 32.1538 8.2165 32.1538 13.4204C32.1538 18.6243 27.9373 22.8408 22.7334 22.8408C21.2743 22.8407 19.8341 22.5008 18.5358 21.8484L20.7181 20.6339C21.3642 20.903 22.0443 21.0408 22.7334 21.0407C26.9441 21.0407 30.3537 17.6312 30.3537 13.4204C30.3537 9.20966 26.9442 5.80009 22.7334 5.80009C18.5227 5.80009 15.1131 9.20959 15.1131 13.4204C15.1131 14.1095 15.2508 14.7896 15.5198 15.4356L14.3095 17.6098C13.6527 16.3069 13.313 14.8666 13.313 13.4204C13.313 8.2165 17.5295 4.00003 22.7334 4.00003Z" fill="#14F195"/>
                    <path d="M10.2536 16.5534L12.7921 15.1782L8.19575 27.9999H5.65723L10.2536 16.5534Z" fill="#14F195"/>
                  </svg>
                  Solana
                </CardTitle>
                <CardDescription>
                  Rust smart contracts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400">
                  Solana programs built with Rust for high performance and low transaction costs.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full group-hover:border-[#FF5AF7]/50 group-hover:text-[#FF5AF7] transition-all">
                  <a href="#solana-contracts">View Solana Contracts</a>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        <Separator className="my-8 bg-gray-800" />

        <section className="space-y-6">
          <h2 className="text-2xl font-bold">Deployed Contract Addresses (Testnet)</h2>
          <p className="text-gray-400">Use these testnet addresses for development and integration testing.</p>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-900/50">
                  <th className="px-4 py-3 text-left text-sm font-semibold border border-gray-800">Blockchain</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold border border-gray-800">Network</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold border border-gray-800">Contract</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold border border-gray-800">Address</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="hover:bg-gray-900/30">
                  <td className="px-4 py-3 border border-gray-800 font-medium">Arbitrum</td>
                  <td className="px-4 py-3 border border-gray-800 text-gray-400">Sepolia Testnet</td>
                  <td className="px-4 py-3 border border-gray-800 text-purple-400">ChronosVault</td>
                  <td className="px-4 py-3 border border-gray-800">
                    <code className="bg-gray-900 px-2 py-1 rounded text-xs">TBD - In Development</code>
                  </td>
                </tr>
                <tr className="hover:bg-gray-900/30">
                  <td className="px-4 py-3 border border-gray-800 font-medium">Arbitrum</td>
                  <td className="px-4 py-3 border border-gray-800 text-gray-400">Sepolia Testnet</td>
                  <td className="px-4 py-3 border border-gray-800 text-purple-400">CVTBridge</td>
                  <td className="px-4 py-3 border border-gray-800">
                    <code className="bg-gray-900 px-2 py-1 rounded text-xs">TBD - In Development</code>
                  </td>
                </tr>
                <tr className="hover:bg-gray-900/30">
                  <td className="px-4 py-3 border border-gray-800 font-medium">Arbitrum</td>
                  <td className="px-4 py-3 border border-gray-800 text-gray-400">Sepolia Testnet</td>
                  <td className="px-4 py-3 border border-gray-800 text-purple-400">CrossChainBridgeV1</td>
                  <td className="px-4 py-3 border border-gray-800">
                    <code className="bg-gray-900 px-2 py-1 rounded text-xs">TBD - In Development</code>
                  </td>
                </tr>
                <tr className="hover:bg-gray-900/30">
                  <td className="px-4 py-3 border border-gray-800 font-medium">Solana</td>
                  <td className="px-4 py-3 border border-gray-800 text-gray-400">Devnet</td>
                  <td className="px-4 py-3 border border-gray-800 text-purple-400">Chronos Vault Program</td>
                  <td className="px-4 py-3 border border-gray-800">
                    <code className="bg-gray-900 px-2 py-1 rounded text-xs">TBD - In Development</code>
                  </td>
                </tr>
                <tr className="hover:bg-gray-900/30">
                  <td className="px-4 py-3 border border-gray-800 font-medium">Solana</td>
                  <td className="px-4 py-3 border border-gray-800 text-gray-400">Devnet</td>
                  <td className="px-4 py-3 border border-gray-800 text-purple-400">Cross-Chain Bridge</td>
                  <td className="px-4 py-3 border border-gray-800">
                    <code className="bg-gray-900 px-2 py-1 rounded text-xs">TBD - In Development</code>
                  </td>
                </tr>
                <tr className="hover:bg-gray-900/30">
                  <td className="px-4 py-3 border border-gray-800 font-medium">TON</td>
                  <td className="px-4 py-3 border border-gray-800 text-gray-400">Testnet</td>
                  <td className="px-4 py-3 border border-gray-800 text-purple-400">ChronosVault</td>
                  <td className="px-4 py-3 border border-gray-800">
                    <code className="bg-gray-900 px-2 py-1 rounded text-xs">EQAvDfYmkVV2zFXzC0Hs2e2RGWJyMXHpnMTXH4jnI2W3AwLb</code>
                  </td>
                </tr>
                <tr className="hover:bg-gray-900/30">
                  <td className="px-4 py-3 border border-gray-800 font-medium">TON</td>
                  <td className="px-4 py-3 border border-gray-800 text-gray-400">Testnet</td>
                  <td className="px-4 py-3 border border-gray-800 text-purple-400">CVTBridge (Jetton)</td>
                  <td className="px-4 py-3 border border-gray-800">
                    <code className="bg-gray-900 px-2 py-1 rounded text-xs">TBD - In Development</code>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <Alert variant="default" className="border-yellow-500 bg-yellow-500/10">
            <AlertCircle className="h-4 w-4 text-yellow-500" />
            <AlertTitle>Testnet Only</AlertTitle>
            <AlertDescription>
              These are testnet addresses for development purposes only. Mainnet contract addresses will be published before production launch. Always verify contract addresses independently.
            </AlertDescription>
          </Alert>
        </section>

        <Separator className="my-8 bg-gray-800" />

        <section id="contract-interfaces" className="space-y-6">
          <h2 className="text-2xl font-bold">Smart Contract Interfaces</h2>
          
          <Alert variant="default" className="border-indigo-500 bg-indigo-500/10">
            <Info className="h-4 w-4 text-indigo-500" />
            <AlertTitle>Triple-Chain Security Architecture</AlertTitle>
            <AlertDescription>
              Our Triple-Chain Security Architecture provides unprecedented security guarantees by 
              leveraging cross-chain verification. Integrate with multiple blockchains to ensure the 
              highest level of protection for your digital assets.
            </AlertDescription>
          </Alert>
          
          <Tabs defaultValue="ethereum">
            <TabsList className="bg-gray-800">
              <TabsTrigger value="ethereum">Ethereum</TabsTrigger>
              <TabsTrigger value="ton">TON</TabsTrigger>
              <TabsTrigger value="solana">Solana</TabsTrigger>
            </TabsList>
            
            <TabsContent value="ethereum" id="ethereum-contracts" className="space-y-4 pt-4">
              <Card className="bg-black/20 border border-gray-800">
                <CardHeader>
                  <CardTitle>Ethereum Vault Contract Interfaces</CardTitle>
                  <CardDescription>
                    Solidity smart contract interfaces for Ethereum and EVM-compatible chains
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-slate-900 text-slate-50 p-4 rounded-md">
                    <pre className="text-sm overflow-x-auto">
                      <code>{`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IChronosVault
 * @dev Interface for the Chronos Vault smart contract
 */
interface IChronosVault {
    /**
     * @dev Vault status enum
     */
    enum VaultStatus {
        PENDING,
        ACTIVE,
        LOCKED,
        RELEASED,
        CLOSED
    }
    
    /**
     * @dev Vault type enum
     */
    enum VaultType {
        TIME_LOCK,
        MULTI_SIG,
        INHERITANCE,
        CONDITIONAL
    }
    
    /**
     * @dev Creates a new vault
     * @param vaultType The type of vault to create
     * @param lockUntil The timestamp until the vault is locked (for time-lock vaults)
     * @param beneficiaries Array of beneficiary addresses (for inheritance vaults)
     * @param requiredSignatures Number of required signatures (for multi-sig vaults)
     * @param customCondition Custom condition contract address (for conditional vaults)
     * @return vaultId The ID of the created vault
     */
    function createVault(
        VaultType vaultType,
        uint256 lockUntil,
        address[] calldata beneficiaries,
        uint8 requiredSignatures,
        address customCondition
    ) external payable returns (bytes32 vaultId);
    
    /**
     * @dev Deposits assets into a vault
     * @param vaultId The ID of the vault
     * @param tokenAddress The address of the token (zero address for native ETH)
     * @param amount The amount to deposit
     */
    function deposit(bytes32 vaultId, address tokenAddress, uint256 amount) external payable;
    
    /**
     * @dev Withdraws assets from a vault
     * @param vaultId The ID of the vault
     * @param tokenAddress The address of the token (zero address for native ETH)
     * @param amount The amount to withdraw
     * @param destination The address to send the funds to
     */
    function withdraw(bytes32 vaultId, address tokenAddress, uint256 amount, address destination) external;
    
    /**
     * @dev Gets the status of a vault
     * @param vaultId The ID of the vault
     * @return status The current status of the vault
     */
    function getVaultStatus(bytes32 vaultId) external view returns (VaultStatus status);
    
    /**
     * @dev Cross-chain verification event
     * @param vaultId The ID of the vault
     * @param action The action being verified (deposit, withdraw, etc.)
     * @param verificationHash The hash of the verification data
     */
    event CrossChainVerification(bytes32 indexed vaultId, string action, bytes32 verificationHash);
}`}</code>
                    </pre>
                  </div>
                  
                  <h3 className="text-xl font-semibold">Cross-Chain Bridge Interface</h3>
                  <div className="bg-slate-900 text-slate-50 p-4 rounded-md">
                    <pre className="text-sm overflow-x-auto">
                      <code>{`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IChronosBridge
 * @dev Interface for the Chronos cross-chain bridge
 */
interface IChronosBridge {
    /**
     * @dev Initiates a cross-chain verification
     * @param targetChain The target blockchain (e.g., "ton", "solana")
     * @param vaultId The ID of the vault
     * @param action The action being verified
     * @param data Additional data for verification
     * @return requestId The ID of the verification request
     */
    function initiateVerification(
        string calldata targetChain,
        bytes32 vaultId,
        string calldata action,
        bytes calldata data
    ) external returns (bytes32 requestId);
    
    /**
     * @dev Finalizes a cross-chain verification
     * @param requestId The ID of the verification request
     * @param sourceChain The source blockchain (e.g., "ethereum", "ton")
     * @param vaultId The ID of the vault
     * @param proofData The proof data for verification
     * @return success Whether the verification was successful
     */
    function finalizeVerification(
        bytes32 requestId,
        string calldata sourceChain,
        bytes32 vaultId,
        bytes calldata proofData
    ) external returns (bool success);
    
    /**
     * @dev Cross-chain verification initiated event
     * @param requestId The ID of the verification request
     * @param vaultId The ID of the vault
     * @param targetChain The target blockchain
     */
    event VerificationInitiated(bytes32 indexed requestId, bytes32 indexed vaultId, string targetChain);
    
    /**
     * @dev Cross-chain verification completed event
     * @param requestId The ID of the verification request
     * @param vaultId The ID of the vault
     * @param sourceChain The source blockchain
     * @param success Whether the verification was successful
     */
    event VerificationCompleted(bytes32 indexed requestId, bytes32 indexed vaultId, string sourceChain, bool success);
}`}</code>
                    </pre>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <Card className="bg-black/30 border border-gray-800">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">ABI Files</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-400">
                          Download ABI files for easy integration with your Ethereum development environment.
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button asChild variant="outline" className="w-full">
                          <a href="#" className="flex items-center gap-2">
                            <Download className="h-4 w-4" /> Download ABI Files
                          </a>
                        </Button>
                      </CardFooter>
                    </Card>
                    
                    <Card className="bg-black/30 border border-gray-800">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Example Projects</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-400">
                          View example projects demonstrating Ethereum contract integration patterns.
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button asChild variant="outline" className="w-full">
                          <a href="#" className="flex items-center gap-2">
                            <FileCode className="h-4 w-4" /> View Examples
                          </a>
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="ton" id="ton-contracts" className="space-y-4 pt-4">
              <Card className="bg-black/20 border border-gray-800">
                <CardHeader>
                  <CardTitle>TON Contract Interfaces</CardTitle>
                  <CardDescription>
                    FunC smart contract interfaces for TON blockchain
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-slate-900 text-slate-50 p-4 rounded-md">
                    <pre className="text-sm overflow-x-auto">
                      <code>{`#pragma version >=0.2.0;

/**
 * @title ChronosVault TON Contract Interface
 * @dev Interface for the TON implementation of Chronos Vault
 */

;; Storage structure
(int vault_id, int vault_type, int lock_until, cell beneficiaries, 
 int required_signatures, int status, cell assets) 
  %= storage::vault_data();

;; Constants
const int STATUS_PENDING = 0;
const int STATUS_ACTIVE = 1;
const int STATUS_LOCKED = 2;
const int STATUS_RELEASED = 3;
const int STATUS_CLOSED = 4;

const int TYPE_TIME_LOCK = 0;
const int TYPE_MULTI_SIG = 1;
const int TYPE_INHERITANCE = 2;
const int TYPE_CONDITIONAL = 3;

;; Messages
message(0x11) CreateVault {
  int vault_type;
  int lock_until;
  cell beneficiaries;
  int required_signatures;
  cell custom_condition;
}

message(0x12) Deposit {
  int vault_id;
  slice token_address;
  int amount;
}

message(0x13) Withdraw {
  int vault_id;
  slice token_address;
  int amount;
  slice destination;
}

message(0x14) GetVaultStatus {
  int vault_id;
}

;; Public methods
() recv_internal(int msg_value, cell in_msg_cell, slice in_msg) impure {
  ;; Deserialize message
  slice cs = in_msg_cell.begin_parse();
  int flags = cs~load_uint(4);
  
  if (flags & 1) { ;; Ignore bounced messages
    return ();
  }
  
  ;; Load message type
  int op = in_msg~load_uint(32);
  
  if (op == 0x11) { ;; CreateVault
    ;; Implementation...
  } elseif (op == 0x12) { ;; Deposit
    ;; Implementation...
  } elseif (op == 0x13) { ;; Withdraw
    ;; Implementation...
  } elseif (op == 0x14) { ;; GetVaultStatus
    ;; Implementation...
  }
}

;; Cross-chain verification interface
cell create_verification_message(int vault_id, slice action, cell data) {
  ;; Implementation...
}

int verify_cross_chain_proof(int request_id, slice source_chain, int vault_id, cell proof_data) {
  ;; Implementation...
}`}</code>
                    </pre>
                  </div>
                  
                  <h3 className="text-xl font-semibold">TON Bridge Interface</h3>
                  <div className="bg-slate-900 text-slate-50 p-4 rounded-md">
                    <pre className="text-sm overflow-x-auto">
                      <code>{`#pragma version >=0.2.0;

/**
 * @title ChronosBridge TON Contract Interface
 * @dev Interface for the TON bridge for cross-chain communication
 */

;; Storage structure
(cell verification_requests, cell completed_verifications) 
  %= storage::bridge_data();

;; Messages
message(0x21) InitiateVerification {
  slice target_chain;
  int vault_id;
  slice action;
  cell data;
}

message(0x22) FinalizeVerification {
  int request_id;
  slice source_chain;
  int vault_id;
  cell proof_data;
}

;; Events
(int) emit_verification_initiated(int request_id, int vault_id, slice target_chain) {
  ;; Implementation...
}

(int) emit_verification_completed(int request_id, int vault_id, slice source_chain, int success) {
  ;; Implementation...
}

;; Public methods
() recv_internal(int msg_value, cell in_msg_cell, slice in_msg) impure {
  ;; Deserialize message
  slice cs = in_msg_cell.begin_parse();
  int flags = cs~load_uint(4);
  
  if (flags & 1) { ;; Ignore bounced messages
    return ();
  }
  
  ;; Load message type
  int op = in_msg~load_uint(32);
  
  if (op == 0x21) { ;; InitiateVerification
    ;; Implementation...
  } elseif (op == 0x22) { ;; FinalizeVerification
    ;; Implementation...
  }
}`}</code>
                    </pre>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <Card className="bg-black/30 border border-gray-800">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Contract Files</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-400">
                          Download TON contract files for integration with the TON blockchain.
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button asChild variant="outline" className="w-full">
                          <a href="#" className="flex items-center gap-2">
                            <Download className="h-4 w-4" /> Download TON Contracts
                          </a>
                        </Button>
                      </CardFooter>
                    </Card>
                    
                    <Card className="bg-black/30 border border-gray-800">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">TON Integration Guide</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-400">
                          Detailed guide for integrating with the TON blockchain using our contracts.
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button asChild variant="outline" className="w-full">
                          <a href="#" className="flex items-center gap-2">
                            <FileCode className="h-4 w-4" /> View Guide
                          </a>
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="solana" id="solana-contracts" className="space-y-4 pt-4">
              <Card className="bg-black/20 border border-gray-800">
                <CardHeader>
                  <CardTitle>Solana Program Interfaces</CardTitle>
                  <CardDescription>
                    Rust programs for the Solana blockchain
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-slate-900 text-slate-50 p-4 rounded-md">
                    <pre className="text-sm overflow-x-auto">
                      <code>{`//! Chronos Vault Solana Program Interface

use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program_error::ProgramError,
    pubkey::Pubkey,
};

/// Program state enum
#[derive(BorshSerialize, BorshDeserialize, Debug, Clone)]
pub enum VaultStatus {
    Pending,
    Active,
    Locked,
    Released,
    Closed,
}

/// Vault type enum
#[derive(BorshSerialize, BorshDeserialize, Debug, Clone)]
pub enum VaultType {
    TimeLock,
    MultiSig,
    Inheritance,
    Conditional,
}

/// Vault data structure
#[derive(BorshSerialize, BorshDeserialize, Debug, Clone)]
pub struct VaultData {
    pub vault_id: [u8; 32],
    pub vault_type: VaultType,
    pub lock_until: u64,
    pub beneficiaries: Vec<Pubkey>,
    pub required_signatures: u8,
    pub status: VaultStatus,
    pub assets: Vec<Asset>,
}

/// Asset structure
#[derive(BorshSerialize, BorshDeserialize, Debug, Clone)]
pub struct Asset {
    pub token_address: Option<Pubkey>, // None for SOL
    pub amount: u64,
}

/// Instruction enum
#[derive(BorshSerialize, BorshDeserialize, Debug, Clone)]
pub enum VaultInstruction {
    /// Creates a new vault
    /// 
    /// Accounts expected:
    /// 0. \`[signer]\` The owner account
    /// 1. \`[writable]\` The vault data account
    /// 2. \`[writable]\` The vault PDA
    /// 3. System program
    CreateVault {
        vault_type: VaultType,
        lock_until: u64,
        beneficiaries: Vec<Pubkey>,
        required_signatures: u8,
        custom_condition: Option<Pubkey>,
    },

    /// Deposits assets into a vault
    /// 
    /// Accounts expected:
    /// 0. \`[signer]\` The depositor account
    /// 1. \`[writable]\` The vault data account
    /// 2. \`[writable]\` The vault PDA
    /// 3. \`[writable]\` The token account (or system program for SOL)
    Deposit {
        vault_id: [u8; 32],
        token_address: Option<Pubkey>,
        amount: u64,
    },

    /// Withdraws assets from a vault
    /// 
    /// Accounts expected:
    /// 0. \`[signer]\` The owner account
    /// 1. \`[writable]\` The vault data account
    /// 2. \`[writable]\` The vault PDA
    /// 3. \`[writable]\` The token account (or system program for SOL)
    /// 4. \`[writable]\` The destination account
    Withdraw {
        vault_id: [u8; 32],
        token_address: Option<Pubkey>,
        amount: u64,
    },

    /// Gets the status of a vault
    /// 
    /// Accounts expected:
    /// 0. \`[]\` The vault data account
    GetVaultStatus {
        vault_id: [u8; 32],
    },
}

// Entrypoint
entrypoint!(process_instruction);

/// Program entrypoint
pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let instruction = VaultInstruction::try_from_slice(instruction_data)?;
    
    match instruction {
        VaultInstruction::CreateVault { .. } => {
            // Implementation...
            Ok(())
        },
        VaultInstruction::Deposit { .. } => {
            // Implementation...
            Ok(())
        },
        VaultInstruction::Withdraw { .. } => {
            // Implementation...
            Ok(())
        },
        VaultInstruction::GetVaultStatus { .. } => {
            // Implementation...
            Ok(())
        },
    }
}`}</code>
                    </pre>
                  </div>
                  
                  <h3 className="text-xl font-semibold">Solana Bridge Program</h3>
                  <div className="bg-slate-900 text-slate-50 p-4 rounded-md">
                    <pre className="text-sm overflow-x-auto">
                      <code>{`//! Chronos Bridge Solana Program Interface

use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::AccountInfo,
    entrypoint,
    entrypoint::ProgramResult,
    pubkey::Pubkey,
};

/// Bridge instruction enum
#[derive(BorshSerialize, BorshDeserialize, Debug, Clone)]
pub enum BridgeInstruction {
    /// Initiates a cross-chain verification
    /// 
    /// Accounts expected:
    /// 0. \`[signer]\` The initiator account
    /// 1. \`[writable]\` The verification request account
    /// 2. System program
    InitiateVerification {
        target_chain: String,
        vault_id: [u8; 32],
        action: String,
        data: Vec<u8>,
    },

    /// Finalizes a cross-chain verification
    /// 
    /// Accounts expected:
    /// 0. \`[signer]\` The authority account
    /// 1. \`[writable]\` The verification request account
    /// 2. \`[writable]\` The vault data account
    FinalizeVerification {
        request_id: [u8; 32],
        source_chain: String,
        vault_id: [u8; 32],
        proof_data: Vec<u8>,
    },
}

// Entrypoint
entrypoint!(process_instruction);

/// Program entrypoint
pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let instruction = BridgeInstruction::try_from_slice(instruction_data)?;
    
    match instruction {
        BridgeInstruction::InitiateVerification { .. } => {
            // Implementation...
            Ok(())
        },
        BridgeInstruction::FinalizeVerification { .. } => {
            // Implementation...
            Ok(())
        },
    }
}`}</code>
                    </pre>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <Card className="bg-black/30 border border-gray-800">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Program Files</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-400">
                          Download Solana program files for integration with the Solana blockchain.
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button asChild variant="outline" className="w-full">
                          <a href="#" className="flex items-center gap-2">
                            <Download className="h-4 w-4" /> Download Solana Programs
                          </a>
                        </Button>
                      </CardFooter>
                    </Card>
                    
                    <Card className="bg-black/30 border border-gray-800">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Client SDKs</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-400">
                          Access client SDKs for easy interaction with Solana programs.
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button asChild variant="outline" className="w-full">
                          <a href="#" className="flex items-center gap-2">
                            <FileCode className="h-4 w-4" /> View Client SDKs
                          </a>
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>
        
        <Separator className="my-8 bg-gray-800" />
        
        <section className="space-y-6">
          <h2 className="text-2xl font-bold">Security Considerations</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-black/20 border border-gray-800">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-indigo-500" />
                  Triple-Chain Security Architecture
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400">
                  Our contracts implement a unique Triple-Chain Security Architecture, which ensures that critical 
                  operations are verified across multiple blockchains before execution. This provides an unprecedented
                  level of security against attacks and blockchain-specific vulnerabilities.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-black/20 border border-gray-800">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                  Security Best Practices
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400">
                  All our smart contracts follow stringent security best practices and have undergone rigorous auditing.
                  Always use the latest contract versions and follow our integration guidelines to ensure maximum security.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Alert variant="destructive" className="border-red-500/50 bg-red-500/10">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Important Security Note</AlertTitle>
            <AlertDescription>
              Always thoroughly test your integrations in testnet environments before deploying to 
              production. Use our test suite to verify that your implementation correctly handles
              all edge cases and security scenarios.
            </AlertDescription>
          </Alert>
        </section>
        
        <Separator className="my-8 bg-gray-800" />
        
        <section className="space-y-6">
          <h2 className="text-2xl font-bold">Getting Started</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-black/20 border border-gray-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">1. Clone Repository</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-black/40 p-3 rounded-md font-mono text-xs mb-2 overflow-x-auto">
                  <code>git clone https://github.com/chronos-vault/smart-contracts.git</code>
                </div>
                <p className="text-sm text-gray-400">
                  Clone our repository to get started with the full contract code.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-black/20 border border-gray-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">2. Install Dependencies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-black/40 p-3 rounded-md font-mono text-xs mb-2 overflow-x-auto">
                  <code>npm install # For Ethereum
cargo build # For Solana</code>
                </div>
                <p className="text-sm text-gray-400">
                  Install the necessary dependencies for your blockchain of choice.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-black/20 border border-gray-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">3. Run Tests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-black/40 p-3 rounded-md font-mono text-xs mb-2 overflow-x-auto">
                  <code>npm test # For Ethereum
cargo test # For Solana</code>
                </div>
                <p className="text-sm text-gray-400">
                  Run the test suite to verify your environment is set up correctly.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex justify-center mt-6">
            <Button asChild className="bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700">
              <Link href="/integration-guide" className="flex items-center gap-2">
                Read Full Integration Guide <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </DocumentationLayout>
  );
};

export default SmartContractSDK;