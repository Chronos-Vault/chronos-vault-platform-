import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { 
  Copy, 
  ExternalLink, 
  Lock, 
  Clock, 
  KeyRound, 
  Users, 
  Shield, 
  Zap,
  LifeBuoy,
  Coins,
  ArrowRightLeft,
  Loader
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SmartContractsPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();
  
  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    toast({
      title: "Address copied",
      description: "Smart contract address copied to clipboard",
    });
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#121212] to-[#1A1A1A] text-white pb-20">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <PageHeader
            heading="Smart Contract Architecture"
            description="The blockchain technology powering Chronos Vault's Triple-Chain Security"
            separator={true}
          />
        </motion.div>

        <motion.div 
          className="mt-10 mb-16 p-6 rounded-xl bg-gradient-to-br from-[#6B00D7]/10 to-[#FF5AF7]/5 border border-[#6B00D7]/20 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]">Triple-Chain Smart Contract Architecture</h2>
          <p className="mt-2 text-gray-300">
            Chronos Vault implements a revolutionary multi-chain approach to secure digital assets through specialized smart contracts on Ethereum, Solana, and TON, with each blockchain serving a distinct role in the security architecture.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="p-4 rounded-lg bg-[#6B00D7]/10 border border-[#6B00D7]/30">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center">
                  <span>Ξ</span>
                </div>
                <h3 className="text-lg font-semibold text-[#FF5AF7]">Ethereum Layer</h3>
              </div>
              <p className="text-sm text-gray-300 mt-2">Primary ownership records and access control through ERC-4626 compliant tokenized vaults</p>
            </div>
            <div className="p-4 rounded-lg bg-[#6B00D7]/10 border border-[#6B00D7]/30">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-purple-700 flex items-center justify-center">
                  <span>◎</span>
                </div>
                <h3 className="text-lg font-semibold text-[#FF5AF7]">Solana Layer</h3>
              </div>
              <p className="text-sm text-gray-300 mt-2">High-frequency monitoring and rapid validation with Solana's high throughput for security events</p>
            </div>
            <div className="p-4 rounded-lg bg-[#6B00D7]/10 border border-[#6B00D7]/30">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                  <span>💎</span>
                </div>
                <h3 className="text-lg font-semibold text-[#FF5AF7]">TON Layer</h3>
              </div>
              <p className="text-sm text-gray-300 mt-2">Backup security system and emergency recovery operations with TON's resilient architecture</p>
            </div>
          </div>
        </motion.div>

        <div className="mt-12">
          <Tabs defaultValue="overview" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 mb-8 bg-[#1A1A1A]">
              <TabsTrigger value="overview" className="data-[state=active]:bg-[#6B00D7]/20 data-[state=active]:text-white">
                Overview
              </TabsTrigger>
              <TabsTrigger value="ethereum" className="data-[state=active]:bg-[#6B00D7]/20 data-[state=active]:text-white">
                Ethereum
              </TabsTrigger>
              <TabsTrigger value="solana" className="data-[state=active]:bg-[#6B00D7]/20 data-[state=active]:text-white">
                Solana
              </TabsTrigger>
              <TabsTrigger value="ton" className="data-[state=active]:bg-[#6B00D7]/20 data-[state=active]:text-white">
                TON
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate={activeTab === "overview" ? "visible" : "hidden"}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <motion.div variants={itemVariants}>
                  <Card className="bg-[#1D1D1D] border-[#333] text-white">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl text-[#FF5AF7] flex items-center">
                          <Lock className="mr-2 h-5 w-5" />
                          Core Security Features
                        </CardTitle>
                        <Badge className="bg-blue-600">All Chains</Badge>
                      </div>
                      <CardDescription className="text-gray-400">
                        Security features implemented across all blockchain networks
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <h4 className="font-medium text-[#FF5AF7] flex items-center"><Clock className="mr-2 h-4 w-4" /> Time-Lock Mechanism</h4>
                        <p className="text-sm text-gray-300">Cryptographically secured time-based access control that prevents premature asset retrieval</p>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium text-[#FF5AF7] flex items-center"><KeyRound className="mr-2 h-4 w-4" /> Multi-Signature Security</h4>
                        <p className="text-sm text-gray-300">Requires multiple authorized parties to approve access to high-value vaults</p>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium text-[#FF5AF7] flex items-center"><Shield className="mr-2 h-4 w-4" /> Quantum-Resistant Encryption</h4>
                        <p className="text-sm text-gray-300">Progressive security levels with post-quantum cryptography for long-term protection</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <Card className="bg-[#1D1D1D] border-[#333] text-white">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl text-[#FF5AF7] flex items-center">
                          <ArrowRightLeft className="mr-2 h-5 w-5" />
                          Cross-Chain Verification
                        </CardTitle>
                        <Badge className="bg-green-600">Core</Badge>
                      </div>
                      <CardDescription className="text-gray-400">
                        How assets are secured across multiple blockchains
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="bg-[#181818] p-4 rounded-md border border-[#333]">
                        <div className="flex items-center space-x-2 mb-3">
                          <div className="w-4 h-4 rounded-full bg-blue-600"></div>
                          <h4 className="font-medium">Ethereum: Primary Verification</h4>
                        </div>
                        <div className="ml-6 border-l-2 border-blue-600 pl-3 py-1 text-sm">
                          Manages primary ownership and access control
                        </div>
                      </div>
                      
                      <div className="bg-[#181818] p-4 rounded-md border border-[#333]">
                        <div className="flex items-center space-x-2 mb-3">
                          <div className="w-4 h-4 rounded-full bg-purple-600"></div>
                          <h4 className="font-medium">Solana: Real-time Monitoring</h4>
                        </div>
                        <div className="ml-6 border-l-2 border-purple-600 pl-3 py-1 text-sm">
                          Provides high-speed transaction validation
                        </div>
                      </div>
                      
                      <div className="bg-[#181818] p-4 rounded-md border border-[#333]">
                        <div className="flex items-center space-x-2 mb-3">
                          <div className="w-4 h-4 rounded-full bg-blue-400"></div>
                          <h4 className="font-medium">TON: Recovery Operations</h4>
                        </div>
                        <div className="ml-6 border-l-2 border-blue-400 pl-3 py-1 text-sm">
                          Manages backup security and recovery processes
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <Card className="bg-[#1D1D1D] border-[#333] text-white">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl text-[#FF5AF7] flex items-center">
                          <Zap className="mr-2 h-5 w-5" />
                          Smart Contract Interaction Flow
                        </CardTitle>
                        <Badge className="bg-yellow-600">Technical</Badge>
                      </div>
                      <CardDescription className="text-gray-400">
                        How the smart contracts communicate across blockchains
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="relative ml-4 pl-6 border-l-2 border-[#6B00D7] my-4">
                        <div className="mb-6 relative">
                          <div className="absolute -left-[29px] top-0 w-5 h-5 rounded-full bg-[#6B00D7]"></div>
                          <h4 className="font-semibold text-sm text-[#FF5AF7] mb-1">Vault Creation</h4>
                          <p className="text-xs text-gray-300">User initiates vault creation on Ethereum, which deploys a new ERC-4626 vault contract</p>
                        </div>
                        
                        <div className="mb-6 relative">
                          <div className="absolute -left-[29px] top-0 w-5 h-5 rounded-full bg-[#6B00D7]"></div>
                          <h4 className="font-semibold text-sm text-[#FF5AF7] mb-1">Cross-Chain Registration</h4>
                          <p className="text-xs text-gray-300">Vault details are registered on Solana and TON through the bridge contracts</p>
                        </div>
                        
                        <div className="mb-6 relative">
                          <div className="absolute -left-[29px] top-0 w-5 h-5 rounded-full bg-[#6B00D7]"></div>
                          <h4 className="font-semibold text-sm text-[#FF5AF7] mb-1">Continuous Monitoring</h4>
                          <p className="text-xs text-gray-300">Solana programs continuously monitor vault status and validate transaction attempts</p>
                        </div>
                        
                        <div className="relative">
                          <div className="absolute -left-[29px] top-0 w-5 h-5 rounded-full bg-[#6B00D7]"></div>
                          <h4 className="font-semibold text-sm text-[#FF5AF7] mb-1">Asset Retrieval</h4>
                          <p className="text-xs text-gray-300">When unlock time is reached, verification must be confirmed across all three chains before assets can be retrieved</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <Card className="bg-[#1D1D1D] border-[#333] text-white">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl text-[#FF5AF7] flex items-center">
                          <LifeBuoy className="mr-2 h-5 w-5" />
                          Recovery & Fallback Systems
                        </CardTitle>
                        <Badge className="bg-red-600">Critical</Badge>
                      </div>
                      <CardDescription className="text-gray-400">
                        How the system handles failures and emergencies
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <h4 className="font-medium text-[#FF5AF7]">Fallback Chain Mechanisms</h4>
                        <div className="bg-[#181818] p-3 rounded-md border border-[#333] text-sm">
                          If transaction fails on Ethereum → retry on Solana → retry on TON → retry on Ethereum
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium text-[#FF5AF7]">Emergency Override</h4>
                        <p className="text-sm text-gray-300">For critical situations, multi-signature emergency access can be granted through a time-delayed recovery process that requires verification from multiple trusted parties</p>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium text-[#FF5AF7]">Cross-Chain Redundancy</h4>
                        <p className="text-sm text-gray-300">Critical vault data is stored redundantly across all three blockchains to ensure no single point of failure</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="ethereum">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate={activeTab === "ethereum" ? "visible" : "hidden"}
              >
                <motion.div variants={itemVariants} className="mb-8">
                  <Card className="bg-[#1D1D1D] border-[#333] text-white overflow-hidden">
                    <div className="h-16 bg-gradient-to-r from-blue-700 to-blue-900"></div>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl text-[#FF5AF7] flex items-center">
                          <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center mr-2">
                            <span>Ξ</span>
                          </div>
                          Ethereum Smart Contracts
                        </CardTitle>
                        <Badge className="bg-blue-700">Primary</Badge>
                      </div>
                      <CardDescription className="text-gray-400">
                        ERC-4626 tokenized vault contracts managing ownership and access control
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-3">Main Contracts</h3>
                        <div className="space-y-4">
                          <div className="bg-[#181818] p-4 rounded-md border border-[#333]">
                            <div className="flex justify-between">
                              <h4 className="font-medium text-[#FF5AF7]">ChronosVault.sol</h4>
                              <div className="flex space-x-2">
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleCopyAddress("0x7C3C7B03264eb55eb464815294c4d8e0D7D1A745")}>
                                  <Copy className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => window.open("https://sepolia.etherscan.io/address/0x7C3C7B03264eb55eb464815294c4d8e0D7D1A745", "_blank")}>
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-sm text-gray-300 mt-2">ERC-4626 compliant tokenized vault with time-lock functionality, implementing the main vault logic</p>
                            <div className="mt-3 flex space-x-2">
                              <Badge className="bg-blue-600/20 text-blue-400">Solidity</Badge>
                              <Badge className="bg-yellow-600/20 text-yellow-400">Sepolia Testnet</Badge>
                            </div>
                          </div>
                          
                          <div className="bg-[#181818] p-4 rounded-md border border-[#333]">
                            <div className="flex justify-between">
                              <h4 className="font-medium text-[#FF5AF7]">CVTBridge.sol</h4>
                              <div className="flex space-x-2">
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleCopyAddress("0x9A3DBca4A2D8F54B6F5226C3F1FaAcAB7F48e41B")}>
                                  <Copy className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => window.open("https://sepolia.etherscan.io/address/0x9A3DBca4A2D8F54B6F5226C3F1FaAcAB7F48e41B", "_blank")}>
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-sm text-gray-300 mt-2">Cross-chain bridge contract for communicating vault status to Solana and TON networks</p>
                            <div className="mt-3 flex space-x-2">
                              <Badge className="bg-blue-600/20 text-blue-400">Solidity</Badge>
                              <Badge className="bg-yellow-600/20 text-yellow-400">Sepolia Testnet</Badge>
                            </div>
                          </div>
                          
                          <div className="bg-[#181818] p-4 rounded-md border border-[#333]">
                            <div className="flex justify-between">
                              <h4 className="font-medium text-[#FF5AF7]">CVTToken.sol</h4>
                              <div className="flex space-x-2">
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleCopyAddress("0x42E579CF5894C0a678F85a4Ed548c525E4Bf2dA8")}>
                                  <Copy className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => window.open("https://sepolia.etherscan.io/address/0x42E579CF5894C0a678F85a4Ed548c525E4Bf2dA8", "_blank")}>
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-sm text-gray-300 mt-2">ERC-20 token contract for the Chronos Vault Token (CVT) with deflationary mechanisms</p>
                            <div className="mt-3 flex space-x-2">
                              <Badge className="bg-blue-600/20 text-blue-400">Solidity</Badge>
                              <Badge className="bg-yellow-600/20 text-yellow-400">Sepolia Testnet</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-3">Key Security Features</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-3 bg-[#181818] rounded-lg border border-[#333]">
                            <h4 className="font-medium text-[#FF5AF7]">Reentrancy Protection</h4>
                            <p className="text-sm text-gray-300 mt-1">ReentrancyGuard implementation to prevent reentrancy attacks</p>
                          </div>
                          
                          <div className="p-3 bg-[#181818] rounded-lg border border-[#333]">
                            <h4 className="font-medium text-[#FF5AF7]">Access Control</h4>
                            <p className="text-sm text-gray-300 mt-1">Role-based access control (RBAC) using OpenZeppelin standards</p>
                          </div>
                          
                          <div className="p-3 bg-[#181818] rounded-lg border border-[#333]">
                            <h4 className="font-medium text-[#FF5AF7]">SafeMath</h4>
                            <p className="text-sm text-gray-300 mt-1">Overflow/underflow protection for all mathematical operations</p>
                          </div>
                          
                          <div className="p-3 bg-[#181818] rounded-lg border border-[#333]">
                            <h4 className="font-medium text-[#FF5AF7]">Pausable</h4>
                            <p className="text-sm text-gray-300 mt-1">Emergency pause functionality for critical security situations</p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Ethereum Vault Creation Example</h3>
                        <div className="bg-[#181818] p-4 rounded-md border border-[#333] font-mono text-xs overflow-x-auto">
                          <pre className="text-gray-300">
{`// Create a new time-locked vault
function createTimeLockedVault(
    address _owner,
    uint256 _unlockTime,
    uint8 _securityLevel
) external returns (address newVault) {
    // Validate parameters
    require(_unlockTime > block.timestamp, "Unlock time must be in the future");
    require(_securityLevel >= 1 && _securityLevel <= 3, "Invalid security level");
    
    // Deploy new vault contract
    ChronosVault vault = new ChronosVault(
        _owner,
        _unlockTime,
        _securityLevel
    );
    
    // Register vault with bridge for cross-chain security
    bridge.registerVault(address(vault), _unlockTime, _securityLevel);
    
    // Emit event
    emit VaultCreated(address(vault), _owner, _unlockTime, _securityLevel);
    
    return address(vault);
}`}
                          </pre>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="solana">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate={activeTab === "solana" ? "visible" : "hidden"}
              >
                <motion.div variants={itemVariants} className="mb-8">
                  <Card className="bg-[#1D1D1D] border-[#333] text-white overflow-hidden">
                    <div className="h-16 bg-gradient-to-r from-purple-700 to-purple-900"></div>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl text-[#FF5AF7] flex items-center">
                          <div className="w-8 h-8 rounded-full bg-purple-700 flex items-center justify-center mr-2">
                            <span>◎</span>
                          </div>
                          Solana Programs
                        </CardTitle>
                        <Badge className="bg-purple-700">Monitoring</Badge>
                      </div>
                      <CardDescription className="text-gray-400">
                        High-throughput monitoring and validation programs on Solana
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-3">Main Programs</h3>
                        <div className="space-y-4">
                          <div className="bg-[#181818] p-4 rounded-md border border-[#333]">
                            <div className="flex justify-between">
                              <h4 className="font-medium text-[#FF5AF7]">chronos_vault.rs</h4>
                              <div className="flex space-x-2">
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleCopyAddress("ChronoSVauLt111111111111111111111111111111111")}>
                                  <Copy className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => window.open("https://explorer.solana.com/address/ChronoSVauLt111111111111111111111111111111111?cluster=devnet", "_blank")}>
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-sm text-gray-300 mt-2">Main vault monitoring program that validates time-lock status and performs high-frequency security checks</p>
                            <div className="mt-3 flex space-x-2">
                              <Badge className="bg-orange-600/20 text-orange-400">Rust</Badge>
                              <Badge className="bg-blue-600/20 text-blue-400">Solana Devnet</Badge>
                            </div>
                          </div>
                          
                          <div className="bg-[#181818] p-4 rounded-md border border-[#333]">
                            <div className="flex justify-between">
                              <h4 className="font-medium text-[#FF5AF7]">cvt_bridge.rs</h4>
                              <div className="flex space-x-2">
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleCopyAddress("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS")}>
                                  <Copy className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => window.open("https://explorer.solana.com/address/Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS?cluster=devnet", "_blank")}>
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-sm text-gray-300 mt-2">Cross-chain bridge implementation that interfaces with Ethereum and TON networks</p>
                            <div className="mt-3 flex space-x-2">
                              <Badge className="bg-orange-600/20 text-orange-400">Rust</Badge>
                              <Badge className="bg-blue-600/20 text-blue-400">Solana Devnet</Badge>
                            </div>
                          </div>
                          
                          <div className="bg-[#181818] p-4 rounded-md border border-[#333]">
                            <div className="flex justify-between">
                              <h4 className="font-medium text-[#FF5AF7]">cvt_token.rs</h4>
                              <div className="flex space-x-2">
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleCopyAddress("CVTKN95UQJa7jJDn9LXfhJKK7JVsZTSH18VBQfZwJUXj")}>
                                  <Copy className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => window.open("https://explorer.solana.com/address/CVTKN95UQJa7jJDn9LXfhJKK7JVsZTSH18VBQfZwJUXj?cluster=devnet", "_blank")}>
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-sm text-gray-300 mt-2">SPL token implementation for the Chronos Vault Token (CVT) on Solana</p>
                            <div className="mt-3 flex space-x-2">
                              <Badge className="bg-orange-600/20 text-orange-400">Rust</Badge>
                              <Badge className="bg-blue-600/20 text-blue-400">Solana Devnet</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-3">Solana-Specific Advantages</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-3 bg-[#181818] rounded-lg border border-[#333]">
                            <h4 className="font-medium text-[#FF5AF7]">High Throughput</h4>
                            <p className="text-sm text-gray-300 mt-1">65,000+ TPS enables real-time security monitoring across all vaults</p>
                          </div>
                          
                          <div className="p-3 bg-[#181818] rounded-lg border border-[#333]">
                            <h4 className="font-medium text-[#FF5AF7]">Low Latency</h4>
                            <p className="text-sm text-gray-300 mt-1">400ms block times provide near-instant security verification</p>
                          </div>
                          
                          <div className="p-3 bg-[#181818] rounded-lg border border-[#333]">
                            <h4 className="font-medium text-[#FF5AF7]">Parallel Processing</h4>
                            <p className="text-sm text-gray-300 mt-1">Sealevel runtime allows simultaneous processing of multiple vault transactions</p>
                          </div>
                          
                          <div className="p-3 bg-[#181818] rounded-lg border border-[#333]">
                            <h4 className="font-medium text-[#FF5AF7]">Proof of History</h4>
                            <p className="text-sm text-gray-300 mt-1">Verifiable delay function provides tamper-proof time attestation</p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Solana Monitoring Example</h3>
                        <div className="bg-[#181818] p-4 rounded-md border border-[#333] font-mono text-xs overflow-x-auto">
                          <pre className="text-gray-300">
{`// Solana program for vault verification
pub fn process_verify_vault_status(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    vault_id: [u8; 32],
    expected_unlock_time: i64,
) -> ProgramResult {
    // Get account information
    let accounts_iter = &mut accounts.iter();
    let vault_account = next_account_info(accounts_iter)?;
    let bridge_account = next_account_info(accounts_iter)?;
    
    // Verify the account is owned by our program
    if vault_account.owner != program_id {
        return Err(ProgramError::IncorrectProgramId);
    }
    
    // Verify vault status
    let vault_data = VaultState::try_from_slice(&vault_account.data.borrow())?;
    
    // Check time lock status
    let clock = Clock::get()?;
    if vault_data.unlock_time != expected_unlock_time {
        // Report discrepancy to bridge
        bridge::report_validation_error(
            bridge_account,
            &vault_id,
            ValidationErrorType::TimeLockMismatch,
        )?;
        return Err(ChronosError::TimeLockMismatch.into());
    }
    
    // Report successful validation
    bridge::report_validation_success(bridge_account, &vault_id)?;
    
    Ok(())
}`}
                          </pre>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="ton">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate={activeTab === "ton" ? "visible" : "hidden"}
              >
                <motion.div variants={itemVariants} className="mb-8">
                  <Card className="bg-[#1D1D1D] border-[#333] text-white overflow-hidden">
                    <div className="h-16 bg-gradient-to-r from-blue-500 to-blue-700"></div>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl text-[#FF5AF7] flex items-center">
                          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center mr-2">
                            <span>💎</span>
                          </div>
                          TON Smart Contracts
                        </CardTitle>
                        <Badge className="bg-blue-500">Backup</Badge>
                      </div>
                      <CardDescription className="text-gray-400">
                        Backup security system and emergency recovery smart contracts on TON
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-3">Main Contracts</h3>
                        <div className="space-y-4">
                          <div className="bg-[#181818] p-4 rounded-md border border-[#333]">
                            <div className="flex justify-between">
                              <h4 className="font-medium text-[#FF5AF7]">ChronosVault.fc</h4>
                              <div className="flex space-x-2">
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleCopyAddress("EQAvDfYmkVV2zFXzC0Hs2e2RGWJyMXHpnMTXH4jnI2W3AwLb")}>
                                  <Copy className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => window.open("https://testnet.tonscan.org/address/EQAvDfYmkVV2zFXzC0Hs2e2RGWJyMXHpnMTXH4jnI2W3AwLb", "_blank")}>
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-sm text-gray-300 mt-2">Main vault contract implementing backup storage and recovery mechanisms</p>
                            <div className="mt-3 flex space-x-2">
                              <Badge className="bg-green-600/20 text-green-400">FunC</Badge>
                              <Badge className="bg-blue-600/20 text-blue-400">TON Testnet</Badge>
                            </div>
                          </div>
                          
                          <div className="bg-[#181818] p-4 rounded-md border border-[#333]">
                            <div className="flex justify-between">
                              <h4 className="font-medium text-[#FF5AF7]">CVT Factory</h4>
                              <div className="flex space-x-2">
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleCopyAddress("EQB0gCDoGJNTfoPUSCgBxLuZ_O-7aYUccU0P1Vj_QdO6rQTf")}>
                                  <Copy className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => window.open("https://testnet.tonscan.org/address/EQB0gCDoGJNTfoPUSCgBxLuZ_O-7aYUccU0P1Vj_QdO6rQTf", "_blank")}>
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-sm text-gray-300 mt-2">Factory contract for deploying new vault instances and managing metadata</p>
                            <div className="mt-3 flex space-x-2">
                              <Badge className="bg-green-600/20 text-green-400">FunC</Badge>
                              <Badge className="bg-blue-600/20 text-blue-400">TON Testnet</Badge>
                            </div>
                          </div>
                          
                          <div className="bg-[#181818] p-4 rounded-md border border-[#333]">
                            <div className="flex justify-between">
                              <h4 className="font-medium text-[#FF5AF7]">CVT Jetton</h4>
                              <div className="flex space-x-2">
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleCopyAddress("EQDi_PSI1WbigxBKCj7vEz2pAvUQfw0IFZz9Sz2aGHUFNpSw")}>
                                  <Copy className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => window.open("https://testnet.tonscan.org/address/EQDi_PSI1WbigxBKCj7vEz2pAvUQfw0IFZz9Sz2aGHUFNpSw", "_blank")}>
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-sm text-gray-300 mt-2">Jetton implementation for the Chronos Vault Token (CVT) on TON</p>
                            <div className="mt-3 flex space-x-2">
                              <Badge className="bg-green-600/20 text-green-400">FunC</Badge>
                              <Badge className="bg-blue-600/20 text-blue-400">TON Testnet</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-3">TON-Specific Features</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-3 bg-[#181818] rounded-lg border border-[#333]">
                            <h4 className="font-medium text-[#FF5AF7]">Asynchronous Contract Calls</h4>
                            <p className="text-sm text-gray-300 mt-1">TON's message-passing architecture enables reliable cross-chain communication</p>
                          </div>
                          
                          <div className="p-3 bg-[#181818] rounded-lg border border-[#333]">
                            <h4 className="font-medium text-[#FF5AF7]">Infinite Sharding</h4>
                            <p className="text-sm text-gray-300 mt-1">TON's dynamic sharding enables unlimited scalability for backup operations</p>
                          </div>
                          
                          <div className="p-3 bg-[#181818] rounded-lg border border-[#333]">
                            <h4 className="font-medium text-[#FF5AF7]">Self-Healing Network</h4>
                            <p className="text-sm text-gray-300 mt-1">TON's reliability makes it ideal for long-term backup of vault data</p>
                          </div>
                          
                          <div className="p-3 bg-[#181818] rounded-lg border border-[#333]">
                            <h4 className="font-medium text-[#FF5AF7]">TVM Architecture</h4>
                            <p className="text-sm text-gray-300 mt-1">TON Virtual Machine is optimized for secure, reliable smart contract execution</p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold mb-3">TON Recovery Example</h3>
                        <div className="bg-[#181818] p-4 rounded-md border border-[#333] font-mono text-xs overflow-x-auto">
                          <pre className="text-gray-300">
{`() handle_recovery_request(slice owner_address, int unlock_time, int security_level) impure {
  ;; Load vault data
  var (vault_owner, vault_unlock_time, vault_security_level, vault_status) = load_vault_data();
  
  ;; Check if it's time to unlock
  int current_time = now();
  throw_unless(701, current_time >= vault_unlock_time);
  
  ;; For security level 3, we need cross-chain verification
  if (vault_security_level == 3) {
    ;; Check if we have confirmation from other chains
    var (ethereum_verified, solana_verified) = load_cross_chain_verification();
    throw_unless(702, ethereum_verified & solana_verified);
  }
  
  ;; Check if the sender is the owner
  slice sender_address = sender_address();
  throw_unless(703, equal_slices(sender_address, vault_owner));
  
  ;; Process recovery
  process_recovery(vault_owner, vault_unlock_time, vault_security_level);
  
  ;; Mark vault as recovered
  store_uint(vault_status, 2, 2); ;; status = 2 (recovered)
  
  ;; Notify bridge contracts on other chains
  send_recovery_notification();
}`}
                          </pre>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
        
        <motion.div 
          className="mt-12 p-5 rounded-xl bg-gradient-to-br from-[#6B00D7]/20 to-[#FF5AF7]/10 border border-[#6B00D7]/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <h2 className="text-xl font-bold flex items-center">
            <Users className="mr-2 h-5 w-5 text-[#FF5AF7]" />
            Smart Contract Development
          </h2>
          <p className="mt-2 text-gray-300">
            Our smart contracts are developed with industry best practices and undergo rigorous security audits before deployment. If you're a developer interested in integrating with our smart contracts, check out our API documentation and SDK access in the Developer section.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button variant="outline" className="bg-[#6B00D7]/20 hover:bg-[#6B00D7]/40 border-[#6B00D7]/50" onClick={() => window.location.href = '/audit-test'}>
              <Shield className="mr-2 h-4 w-4" />
              Contract Audit Tool
            </Button>
            <Button variant="outline" className="bg-[#6B00D7]/20 hover:bg-[#6B00D7]/40 border-[#6B00D7]/50" onClick={() => window.location.href = '/documentation'}>
              <ExternalLink className="mr-2 h-4 w-4" />
              API Documentation
            </Button>
            <Button variant="outline" className="bg-[#6B00D7]/20 hover:bg-[#6B00D7]/40 border-[#6B00D7]/50" onClick={() => window.location.href = '/triple-chain-security-demo'}>
              <Loader className="mr-2 h-4 w-4" />
              Security Demo
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}