import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import DocumentationLayout from "@/components/layout/DocumentationLayout";
import { 
  ImageIcon, 
  Shield, 
  Lock, 
  Key, 
  Layers, 
  Paintbrush, 
  CheckCircle, 
  AlertTriangle, 
  FileText, 
  Code, 
  HelpCircle,
  Repeat
} from "lucide-react";

const NFTPoweredVaultDocumentation = () => {
  return (
    <DocumentationLayout>
      <div className="container mx-auto py-10 px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
              NFT-Powered Vault
            </h1>
            <p className="text-xl text-muted-foreground mb-4">
              Innovative security using digital art and collectibles as authentication keys
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button asChild className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
              <Link href="/vault-types">View All Vault Types</Link>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-5 w-full mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="technical">Technical</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-6 w-6 text-purple-500" />
                  NFT Authentication Technology
                </CardTitle>
                <CardDescription>
                  Discover how digital assets can function as secure vault keys
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 p-6 border border-purple-100 dark:from-purple-950/20 dark:to-pink-950/20 dark:border-purple-900/50">
                  <p className="text-lg mb-4">
                    NFT-Powered Vaults represent a revolutionary approach to digital asset security by transforming non-fungible tokens from collectibles into functional authentication keys. This innovative system creates a direct link between ownership of specific NFTs and access to secured assets.
                  </p>
                  
                  <h3 className="text-xl font-semibold mb-2 text-purple-700 dark:text-purple-400">Authentication Through Ownership</h3>
                  <p className="mb-4">
                    Unlike traditional authentication methods that rely on passwords or biometrics, NFT-Powered Vaults verify access rights through blockchain-validated ownership of specific NFTs. This creates a uniquely powerful security model where vault access becomes a transferable right directly tied to digital asset ownership on the blockchain.
                  </p>
                  
                  <h3 className="text-xl font-semibold mb-2 text-purple-700 dark:text-purple-400">Configurable Security Requirements</h3>
                  <p className="mb-4">
                    The vault can be configured to require ownership of a single specific NFT, multiple NFTs from different collections, or even combinations of NFT types to enable access. This allows for sophisticated multi-factor authentication through various collectible combinations, creating highly customizable security profiles.
                  </p>
                  
                  <h3 className="text-xl font-semibold mb-2 text-purple-700 dark:text-purple-400">Transferable Access Control</h3>
                  <p>
                    One of the most powerful aspects of NFT-Powered Vaults is the ability to transfer access rights simply by transferring the authentication NFT. This creates unprecedented flexibility for managing vault access across users without complex permission systems, enabling secure and verifiable transfer of vault ownership through standard NFT marketplace mechanisms.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="justify-between border-t p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ImageIcon className="h-4 w-4" />
                  Transform digital collectibles into powerful security keys
                </div>
                <Button variant="outline" asChild>
                  <Link href="/nft-powered-vault">Create NFT-Powered Vault</Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="features">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-6 w-6 text-purple-500" />
                  Key Features
                </CardTitle>
                <CardDescription>
                  Explore the unique capabilities of NFT-Powered Vaults
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="rounded-lg border bg-card shadow p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <ImageIcon className="h-8 w-8 text-purple-500" />
                      <h3 className="text-xl font-semibold">NFT-Based Authentication</h3>
                    </div>
                    <p>
                      Authenticate vault access through verifiable ownership of specific non-fungible tokens on the blockchain. The system validates real-time ownership before granting access, creating a cryptographically secure authentication mechanism tied directly to blockchain-verified assets instead of traditional credentials.
                    </p>
                  </div>
                  
                  <div className="rounded-lg border bg-card shadow p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Paintbrush className="h-8 w-8 text-purple-500" />
                      <h3 className="text-xl font-semibold">Cross-Collection Support</h3>
                    </div>
                    <p>
                      Configure access requirements using NFTs from virtually any collection across supported blockchains. The system supports major NFT standards including ERC-721, ERC-1155 on Ethereum, SPL tokens on Solana, and TRC-721 on TON, allowing for diverse authentication options regardless of where your digital collectibles reside.
                    </p>
                  </div>
                  
                  <div className="rounded-lg border bg-card shadow p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Repeat className="h-8 w-8 text-purple-500" />
                      <h3 className="text-xl font-semibold">Transferable Access Rights</h3>
                    </div>
                    <p>
                      Transfer vault access privileges seamlessly by transferring the authentication NFT. This creates a frictionless mechanism for changing vault ownership or granting access to new users without complex permission changes. Access rights move automatically with NFT ownership, creating a self-enforcing security model.
                    </p>
                  </div>
                  
                  <div className="rounded-lg border bg-card shadow p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Layers className="h-8 w-8 text-purple-500" />
                      <h3 className="text-xl font-semibold">Tiered Access Levels</h3>
                    </div>
                    <p>
                      Implement differentiated permission levels based on specific NFTs or combinations. Configure the vault to grant basic access with one NFT type while requiring additional specific NFTs for higher-level operations. This creates a natural hierarchy of access privileges tied directly to collectible ownership.
                    </p>
                  </div>
                  
                  <div className="rounded-lg border bg-card shadow p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Lock className="h-8 w-8 text-purple-500" />
                      <h3 className="text-xl font-semibold">Trait-Based Requirements</h3>
                    </div>
                    <p>
                      Specify access requirements based on NFT metadata and traits, not just ownership of any token in a collection. Configure the vault to require NFTs with specific characteristics, rarity levels, or attribute combinations, creating highly granular control over which exact NFTs can serve as authentication keys.
                    </p>
                  </div>
                  
                  <div className="rounded-lg border bg-card shadow p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Shield className="h-8 w-8 text-purple-500" />
                      <h3 className="text-xl font-semibold">Composable Security Rules</h3>
                    </div>
                    <p>
                      Create complex authentication requirements using boolean logic operations (AND, OR, NOT) for NFT combinations. Configure vault access to require specific combinations like "CryptoPunk AND Bored Ape" or "Any Doodle OR Any Azuki" for flexible, sophisticated security policies that can evolve with your NFT collection.
                    </p>
                  </div>
                </div>
                
                <div className="mt-8 p-6 border rounded-lg bg-purple-50 dark:bg-purple-950/20">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-purple-700 dark:text-purple-400">
                    <CheckCircle className="h-5 w-5" />
                    Advanced Functionality
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3 bg-white dark:bg-black/20 rounded-lg shadow-sm">
                      <p className="text-sm font-medium">Temporary Access Delegation</p>
                      <p className="text-xs text-muted-foreground mt-1">NFT staking for time-limited vault access</p>
                    </div>
                    <div className="p-3 bg-white dark:bg-black/20 rounded-lg shadow-sm">
                      <p className="text-sm font-medium">Multi-Chain Verification</p>
                      <p className="text-xs text-muted-foreground mt-1">Support for NFTs across multiple blockchains</p>
                    </div>
                    <div className="p-3 bg-white dark:bg-black/20 rounded-lg shadow-sm">
                      <p className="text-sm font-medium">Transaction Tracing</p>
                      <p className="text-xs text-muted-foreground mt-1">Comprehensive audit trail of NFT-based access</p>
                    </div>
                    <div className="p-3 bg-white dark:bg-black/20 rounded-lg shadow-sm">
                      <p className="text-sm font-medium">Custom Key Minting</p>
                      <p className="text-xs text-muted-foreground mt-1">Create dedicated access-key NFTs for your vault</p>
                    </div>
                    <div className="p-3 bg-white dark:bg-black/20 rounded-lg shadow-sm">
                      <p className="text-sm font-medium">Fallback Authentication</p>
                      <p className="text-xs text-muted-foreground mt-1">Secondary access methods when needed</p>
                    </div>
                    <div className="p-3 bg-white dark:bg-black/20 rounded-lg shadow-sm">
                      <p className="text-sm font-medium">DAO Integration</p>
                      <p className="text-xs text-muted-foreground mt-1">Community-governed vault access control</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-6 w-6 text-purple-500" />
                  Security Architecture
                </CardTitle>
                <CardDescription>
                  How NFT-based authentication secures your digital assets
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-purple-700 dark:text-purple-400">NFT Ownership Verification</h3>
                  <p className="text-muted-foreground">
                    The NFT-Powered Vault implements a robust, multi-layered verification system to confirm authentic ownership of required NFTs before granting access, ensuring that only legitimate owners can access the vault's contents.
                  </p>
                  
                  <div className="rounded-lg border p-4 bg-slate-50 dark:bg-slate-900 mb-6">
                    <h4 className="font-medium mb-2 flex items-center">
                      <Shield className="h-4 w-4 mr-2 text-purple-500" />
                      Real-Time Blockchain Verification
                    </h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      When authentication is requested, the system performs real-time checks across multiple verification layers:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="bg-white dark:bg-black/20 p-3 rounded border">
                        <span className="font-medium text-purple-700 dark:text-purple-400">On-Chain Verification</span>
                        <ul className="mt-1 space-y-1 text-muted-foreground">
                          <li>• Direct blockchain queries</li>
                          <li>• Smart contract validation</li>
                          <li>• Transaction confirmation</li>
                        </ul>
                      </div>
                      <div className="bg-white dark:bg-black/20 p-3 rounded border">
                        <span className="font-medium text-purple-700 dark:text-purple-400">Authentication Protocol</span>
                        <ul className="mt-1 space-y-1 text-muted-foreground">
                          <li>• Challenge-response verification</li>
                          <li>• Cryptographic signatures</li>
                          <li>• Wallet address verification</li>
                        </ul>
                      </div>
                      <div className="bg-white dark:bg-black/20 p-3 rounded border">
                        <span className="font-medium text-purple-700 dark:text-purple-400">Fraud Prevention</span>
                        <ul className="mt-1 space-y-1 text-muted-foreground">
                          <li>• Anti-phishing protections</li>
                          <li>• Transaction analysis</li>
                          <li>• Duplicate detection</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="rounded-lg border p-4 bg-slate-50 dark:bg-slate-900 mb-6">
                    <h4 className="font-medium mb-2 flex items-center">
                      <Lock className="h-4 w-4 mr-2 text-purple-500" />
                      Cryptographic Authentication Flow
                    </h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      The system uses a sophisticated multi-step process to validate NFT ownership:
                    </p>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start">
                        <span className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">1</span>
                        <span><strong>Wallet Connection</strong> - User connects their blockchain wallet to the vault interface. The system captures the wallet address but does not request full wallet access, maintaining security separation.</span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">2</span>
                        <span><strong>Ownership Challenge</strong> - The system generates a unique, time-sensitive cryptographic challenge that must be signed with the private keys corresponding to the wallet containing the required NFTs.</span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">3</span>
                        <span><strong>Blockchain Validation</strong> - Once the challenge is signed, the system verifies current ownership of the required NFT(s) through direct blockchain queries and/or indexed APIs, confirming that the connected wallet currently possesses the authentication tokens.</span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">4</span>
                        <span><strong>Access Token Generation</strong> - After successful verification, a temporary, encrypted access token is generated with appropriate permissions based on the verified NFTs, allowing access to the vault while maintaining continuous verification.</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="rounded-lg border p-4 bg-slate-50 dark:bg-slate-900">
                    <h4 className="font-medium mb-2 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-2 text-purple-500" />
                      Anti-Fraud Protections
                    </h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Comprehensive safeguards against common attack vectors:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border rounded-lg p-3">
                        <h5 className="font-medium text-sm mb-1">Transaction Monitoring</h5>
                        <p className="text-xs text-muted-foreground">
                          Continuous monitoring of NFT transfer transactions related to authentication tokens, with automatic access revocation upon transfer detection. The system maintains a near real-time awareness of ownership changes across all supported blockchains.
                        </p>
                      </div>
                      <div className="border rounded-lg p-3">
                        <h5 className="font-medium text-sm mb-1">Flash Loan Protection</h5>
                        <p className="text-xs text-muted-foreground">
                          Advanced safeguards against flash loan attacks and other temporary ownership exploits, including ownership duration verification and historical transaction analysis to prevent momentary ownership claims from being used for authentication.
                        </p>
                      </div>
                      <div className="border rounded-lg p-3">
                        <h5 className="font-medium text-sm mb-1">Signature Verification</h5>
                        <p className="text-xs text-muted-foreground">
                          Cryptographic challenge-response protocols requiring valid signatures from the wallet containing the authentication NFTs, preventing replay attacks and ensuring the user actually controls the private keys associated with the wallet.
                        </p>
                      </div>
                      <div className="border rounded-lg p-3">
                        <h5 className="font-medium text-sm mb-1">Metadata Validation</h5>
                        <p className="text-xs text-muted-foreground">
                          For trait-based authentication, comprehensive validation of NFT metadata through multiple sources, including both on-chain data and verified API endpoints, to prevent falsified metadata from being used to gain unauthorized access.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-purple-700 dark:text-purple-400 mt-6">Backup Security Mechanisms</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border rounded-lg p-4 text-center">
                      <p className="font-medium">Social Recovery</p>
                      <p className="text-sm text-muted-foreground">Emergency access through trusted contacts</p>
                    </div>
                    <div className="border rounded-lg p-4 text-center">
                      <p className="font-medium">Multi-Chain Verification</p>
                      <p className="text-sm text-muted-foreground">Fallback verification across blockchains</p>
                    </div>
                    <div className="border rounded-lg p-4 text-center">
                      <p className="font-medium">Secondary Authentication</p>
                      <p className="text-sm text-muted-foreground">Alternative methods if NFT access unavailable</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="technical">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-6 w-6 text-purple-500" />
                  Technical Specifications
                </CardTitle>
                <CardDescription>
                  Advanced implementation details for technical users
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="rounded-lg border-2 border-dashed border-muted-foreground/20 p-6">
                    <h3 className="text-xl font-semibold mb-4 text-purple-700 dark:text-purple-400">NFT Authentication Framework</h3>
                    <p className="mb-6">
                      The NFT-Powered Vault implements a sophisticated cross-chain authentication system that verifies NFT ownership across multiple blockchain networks while maintaining high security standards, privacy protection, and a seamless user experience.
                    </p>
                    
                    <h4 className="text-lg font-medium mb-2">Supported NFT Standards</h4>
                    <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 mb-6">
                      <h5 className="font-medium mb-2">Blockchain Compatibility</h5>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                          <thead className="bg-gray-100 dark:bg-gray-800">
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Blockchain</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">NFT Standards</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Implementation</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Verification Method</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                            <tr>
                              <td className="px-4 py-2 text-sm">Ethereum</td>
                              <td className="px-4 py-2 text-sm">ERC-721, ERC-1155</td>
                              <td className="px-4 py-2 text-sm">Full & Optimized</td>
                              <td className="px-4 py-2 text-sm">Direct contract verification, indexed validation</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-2 text-sm">Solana</td>
                              <td className="px-4 py-2 text-sm">Metaplex NFTs, SPL tokens</td>
                              <td className="px-4 py-2 text-sm">Full integration</td>
                              <td className="px-4 py-2 text-sm">On-chain verification, metadata validation</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-2 text-sm">TON</td>
                              <td className="px-4 py-2 text-sm">TRC-721, Jettons</td>
                              <td className="px-4 py-2 text-sm">Primary support</td>
                              <td className="px-4 py-2 text-sm">Cell-based verification, native validation</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-2 text-sm">Other EVM chains</td>
                              <td className="px-4 py-2 text-sm">ERC-721, ERC-1155 equivalents</td>
                              <td className="px-4 py-2 text-sm">Extended compatibility</td>
                              <td className="px-4 py-2 text-sm">RPC-based verification, cross-chain oracles</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    
                    <h4 className="text-lg font-medium mb-2">Authentication Technology</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
                        <h5 className="font-medium mb-2">Verification Protocols</h5>
                        <ul className="text-sm space-y-1 text-muted-foreground">
                          <li><span className="font-mono text-xs bg-slate-200 dark:bg-slate-700 px-1 rounded">EIP-712</span> - Typed structured data signing</li>
                          <li><span className="font-mono text-xs bg-slate-200 dark:bg-slate-700 px-1 rounded">TokenProof</span> - NFT ownership verification protocol</li>
                          <li><span className="font-mono text-xs bg-slate-200 dark:bg-slate-700 px-1 rounded">SIWE</span> - Sign-In With Ethereum standard</li>
                          <li><span className="font-mono text-xs bg-slate-200 dark:bg-slate-700 px-1 rounded">SIWS</span> - Sign-In With Solana implementation</li>
                          <li><span className="font-mono text-xs bg-slate-200 dark:bg-slate-700 px-1 rounded">zkSNARK</span> - Zero-knowledge verification for privacy</li>
                        </ul>
                      </div>
                      <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
                        <h5 className="font-medium mb-2">System Architecture</h5>
                        <ul className="text-sm space-y-1 text-muted-foreground">
                          <li><span className="font-mono text-xs bg-slate-200 dark:bg-slate-700 px-1 rounded">NFTAuth</span> - Core authentication service</li>
                          <li><span className="font-mono text-xs bg-slate-200 dark:bg-slate-700 px-1 rounded">ChainMonitor</span> - Real-time transaction monitor</li>
                          <li><span className="font-mono text-xs bg-slate-200 dark:bg-slate-700 px-1 rounded">MetaTrust</span> - Verified metadata validation</li>
                          <li><span className="font-mono text-xs bg-slate-200 dark:bg-slate-700 px-1 rounded">CrossVerify</span> - Multi-chain verification protocol</li>
                          <li><span className="font-mono text-xs bg-slate-200 dark:bg-slate-700 px-1 rounded">AccessBridge</span> - Temporary token generation</li>
                        </ul>
                      </div>
                    </div>
                    
                    <h4 className="text-lg font-medium mb-2">Implementation Details</h4>
                    <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 mb-6">
                      <p className="text-sm text-muted-foreground mb-3">
                        The NFT verification system includes several advanced technical components:
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="border rounded-lg p-3 bg-white dark:bg-gray-900">
                          <h6 className="font-medium mb-1">Smart Contract Framework</h6>
                          <ul className="space-y-1 text-muted-foreground">
                            <li>• Multi-chain verification contracts</li>
                            <li>• Solidity, Rust, and FunC implementations</li>
                            <li>• Blockchain-specific optimizations</li>
                            <li>• Gas-efficient verification methods</li>
                          </ul>
                        </div>
                        <div className="border rounded-lg p-3 bg-white dark:bg-gray-900">
                          <h6 className="font-medium mb-1">NFT Indexing System</h6>
                          <ul className="space-y-1 text-muted-foreground">
                            <li>• High-performance data indexing</li>
                            <li>• Real-time ownership tracking</li>
                            <li>• Low-latency verification (less than 200ms)</li>
                            <li>• Cross-chain data normalization</li>
                          </ul>
                        </div>
                        <div className="border rounded-lg p-3 bg-white dark:bg-gray-900">
                          <h6 className="font-medium mb-1">Metadata Validation</h6>
                          <ul className="space-y-1 text-muted-foreground">
                            <li>• On-chain metadata verification</li>
                            <li>• IPFS/Arweave content addressing</li>
                            <li>• Trait-based validation system</li>
                            <li>• Cryptographic integrity verification</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <h4 className="text-lg font-medium mb-2">Advanced Features</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border rounded-lg p-4">
                        <h5 className="font-medium mb-1">Attribute-Based Access Control</h5>
                        <p className="text-sm text-muted-foreground">
                          The system supports granular access policies based on specific NFT attributes. Configure security rules using boolean logic against NFT metadata, enabling extremely precise access control policies that evaluate NFT traits, rarity scores, and other on-chain properties to determine access levels.
                        </p>
                      </div>
                      <div className="border rounded-lg p-4">
                        <h5 className="font-medium mb-1">Time-Locked Delegation</h5>
                        <p className="text-sm text-muted-foreground">
                          Enables temporary NFT-based access through a cryptographic delegation system. Users can grant time-limited vault access to other wallets without transferring their NFTs by using special delegation contracts that create verifiable, time-bound access tokens while preserving the security of the original authorization NFTs.
                        </p>
                      </div>
                      <div className="border rounded-lg p-4">
                        <h5 className="font-medium mb-1">Cross-Chain Verification</h5>
                        <p className="text-sm text-muted-foreground">
                          Advanced protocol for verifying NFT ownership across multiple blockchains simultaneously. The system uses a combination of direct RPC calls, specialized indexers, and cross-chain oracles to create a unified verification layer that maintains high performance while supporting diverse blockchain networks.
                        </p>
                      </div>
                      <div className="border rounded-lg p-4">
                        <h5 className="font-medium mb-1">Custom Key Minting</h5>
                        <p className="text-sm text-muted-foreground">
                          Integrated functionality for creating and distributing custom access-key NFTs specifically designed for vault authentication. These tokens can include embedded vault metadata, access level encoding, and visual designs that clearly communicate their function while maintaining all the transferability benefits of standard NFTs.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="faq">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-6 w-6 text-purple-500" />
                  Frequently Asked Questions
                </CardTitle>
                <CardDescription>
                  Common questions about NFT-Powered Vaults
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-medium mb-2">What happens if I lose or sell my authentication NFT?</h3>
                    <p className="text-muted-foreground">
                      If you sell or transfer your authentication NFT, access to the vault will automatically transfer to the new owner. This is a fundamental feature of NFT-Powered Vaults, where vault access follows NFT ownership. If your NFT is lost (for example, sent to an inaccessible wallet), the vault has optional backup authentication methods that can be configured during setup. These include social recovery through trusted contacts, backup authentication through multi-signature requirements, or secondary recovery NFTs. Without such backup methods, a lost authentication NFT would result in permanently lost vault access, so we strongly recommend configuring at least one backup method.
                    </p>
                  </div>
                  
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-medium mb-2">Can I use any NFT as an authentication key?</h3>
                    <p className="text-muted-foreground">
                      Yes, the NFT-Powered Vault supports virtually any NFT across our supported blockchains (Ethereum, Solana, TON, and other EVM chains). You can configure your vault to use popular collections like CryptoPunks, Bored Apes, Azuki, Doodles, or any other NFTs you own. However, we recommend considering factors like the NFT's value, liquidity, and your intention to hold it long-term when selecting authentication tokens. Higher-value NFTs may provide greater security through economic disincentives for theft, while less liquid NFTs may reduce the risk of accidental sales leading to unexpected access transfers. You can also use multiple NFTs with different characteristics to create layered security requirements.
                    </p>
                  </div>
                  
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-medium mb-2">How does the system verify NFT ownership?</h3>
                    <p className="text-muted-foreground">
                      The system uses a multi-layered verification approach. When you attempt to access your vault, you'll connect your blockchain wallet to the interface. The system then performs a real-time blockchain query to verify current ownership of the required NFT(s). This includes direct smart contract interactions or API calls to verify the NFT actually resides in your connected wallet. Additionally, you'll sign a cryptographic challenge with your wallet to prove you control the private keys. For trait-based requirements, the system also verifies NFT metadata against trusted sources. All verification happens in real-time, ensuring that only the current owner of the specified NFT(s) can access the vault, with verification typically completing in under 1 second.
                    </p>
                  </div>
                  
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-medium mb-2">Can I require multiple NFTs for authentication?</h3>
                    <p className="text-muted-foreground">
                      Yes, the NFT-Powered Vault supports sophisticated multi-NFT authentication requirements. You can configure your vault to require ownership of several specific NFTs simultaneously using AND logic (e.g., "must own both CryptoPunk #1234 AND Bored Ape #5678"). You can also implement OR conditions (e.g., "must own any Doodle OR any Azuki") or combine these approaches for complex requirements. Furthermore, you can create tiered access levels where basic vault access might require one NFT, while performing certain high-value transactions requires additional NFTs. These combinations can span multiple collections and even different blockchains, allowing for extremely flexible and powerful authentication policies.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">What happens if the NFT collection or marketplace has issues?</h3>
                    <p className="text-muted-foreground">
                      The NFT-Powered Vault operates independently of any specific NFT marketplace or collection infrastructure. Since verification happens through direct blockchain interactions, issues with third-party services like OpenSea, Magic Eden, or collection websites do not affect vault functionality. The system only requires the underlying blockchain networks to be operational. In the extremely unlikely scenario of a critical vulnerability being discovered in a specific NFT standard or collection contract, the vault includes backup authentication methods that can be enabled in an emergency. We continuously monitor the security landscape and would notify users if any vulnerabilities were identified in NFT collections being used for authentication, with recommendations for appropriate security measures.
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t p-4">
                <div className="w-full">
                  <p className="text-sm text-muted-foreground mb-4">
                    Have more questions about NFT-Powered Vaults? Our team is available to provide detailed information and assist with configuring your NFT authentication requirements.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button variant="outline" className="flex-1">
                      Contact Support
                    </Button>
                    <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 flex-1" asChild>
                      <Link href="/nft-powered-vault">Create NFT-Powered Vault</Link>
                    </Button>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DocumentationLayout>
  );
};

export default NFTPoweredVaultDocumentation;