import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { Container } from "@/components/ui/container";
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
  Loader,
  CheckCircle2,
  Code,
  DollarSign,
  Layers,
  HardDrive,
  Network
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Helmet } from "react-helmet";
import { Separator } from "@/components/ui/separator";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";

export default function SmartContractVault() {
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
        when: "beforeChildren",
        staggerChildren: 0.1,
        duration: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 100 
      }
    }
  };

  const [securityStats, setSecurityStats] = useState({
    activeVaults: 0,
    assetsSecured: 0,
    crossChainVerifications: 0
  });

  // Simulate loading security stats
  useEffect(() => {
    const timer = setTimeout(() => {
      setSecurityStats({
        activeVaults: 73201,
        assetsSecured: 429500000,
        crossChainVerifications: 984627
      });
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', { 
      maximumFractionDigits: 0 
    }).format(num);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <>
      <Helmet>
        <title>Smart Contract Vault - Chronos Vault</title>
        <meta name="description" content="The industry-leading Smart Contract Vault with ERC-4626 compliance, quantum-resistant encryption, and cross-chain verification." />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-b from-[#0A0A0A] to-[#121212]">
        <Container>
          <PageHeader
            heading="Smart Contract Vault™"
            description="Industry-leading ERC-4626 compliant tokenized vault with Triple-Chain Security™"
          />

          <Tabs defaultValue="overview" className="mt-8" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="features">Advanced Features</TabsTrigger>
              <TabsTrigger value="security">Security Architecture</TabsTrigger>
              <TabsTrigger value="implementation">Implementation</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="py-6">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
              >
                <motion.div variants={itemVariants}>
                  <Card className="bg-[#151515] border-[#333] h-full">
                    <CardHeader className="pb-2">
                      <div className="w-12 h-12 rounded-lg bg-[#6B00D7] flex items-center justify-center mb-3">
                        <Code className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-xl text-white">ERC-4626 Compliant</CardTitle>
                      <CardDescription className="text-gray-400">
                        Fully compatible with the tokenized vault standard
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-300">
                        Our Smart Contract Vault implements the ERC-4626 standard, providing a unified interface for tokenized yield-bearing vaults that represent shares of a single underlying ERC-20 token.
                      </p>
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                          <span className="text-sm text-gray-300">Standard-compliant methods</span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                          <span className="text-sm text-gray-300">Composable with DeFi protocols</span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                          <span className="text-sm text-gray-300">Battle-tested implementation</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Card className="bg-[#151515] border-[#333] h-full">
                    <CardHeader className="pb-2">
                      <div className="w-12 h-12 rounded-lg bg-[#FF5AF7] flex items-center justify-center mb-3">
                        <Shield className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-xl text-white">Triple-Chain Security™</CardTitle>
                      <CardDescription className="text-gray-400">
                        Unique cross-chain verification mechanism
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-300">
                        Our proprietary Triple-Chain Security™ system distributes security responsibilities across three independent blockchain networks, creating an unprecedented security model.
                      </p>
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                          <span className="text-sm text-gray-300">Ethereum primary ownership layer</span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                          <span className="text-sm text-gray-300">Solana high-frequency monitoring</span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                          <span className="text-sm text-gray-300">TON recovery and backup system</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Card className="bg-[#151515] border-[#333] h-full">
                    <CardHeader className="pb-2">
                      <div className="w-12 h-12 rounded-lg bg-[#00E5A0] flex items-center justify-center mb-3">
                        <Lock className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-xl text-white">Quantum-Resistant</CardTitle>
                      <CardDescription className="text-gray-400">
                        Post-quantum cryptographic algorithms
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-300">
                        Future-proof your assets with quantum-resistant encryption that protects against potential threats from quantum computing advancements.
                      </p>
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                          <span className="text-sm text-gray-300">CRYSTALS-Dilithium signatures</span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                          <span className="text-sm text-gray-300">Kyber-1024 key encapsulation</span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                          <span className="text-sm text-gray-300">SPHINCS+ hash-based signatures</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="mb-10"
              >
                <motion.div variants={itemVariants}>
                  <Card className="bg-[#151515] border-[#333]">
                    <CardHeader>
                      <CardTitle className="text-2xl text-white">Global Security Statistics</CardTitle>
                      <CardDescription className="text-gray-400">
                        Real-time metrics from our Smart Contract Vault ecosystem
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-[#1A1A1A] rounded-lg p-4 border border-[#333]">
                          <div className="text-sm text-gray-500 mb-1">Active Vaults</div>
                          <div className="text-3xl font-bold text-white">
                            {securityStats.activeVaults === 0 ? (
                              <Loader className="h-5 w-5 animate-spin" />
                            ) : (
                              formatNumber(securityStats.activeVaults)
                            )}
                          </div>
                          <div className="mt-2 text-sm text-gray-400">
                            Smart Contract Vaults currently securing assets
                          </div>
                        </div>
                        
                        <div className="bg-[#1A1A1A] rounded-lg p-4 border border-[#333]">
                          <div className="text-sm text-gray-500 mb-1">Total Value Secured</div>
                          <div className="text-3xl font-bold text-white">
                            {securityStats.assetsSecured === 0 ? (
                              <Loader className="h-5 w-5 animate-spin" />
                            ) : (
                              formatCurrency(securityStats.assetsSecured)
                            )}
                          </div>
                          <div className="mt-2 text-sm text-gray-400">
                            Combined value of all assets protected
                          </div>
                        </div>
                        
                        <div className="bg-[#1A1A1A] rounded-lg p-4 border border-[#333]">
                          <div className="text-sm text-gray-500 mb-1">Cross-Chain Verifications</div>
                          <div className="text-3xl font-bold text-white">
                            {securityStats.crossChainVerifications === 0 ? (
                              <Loader className="h-5 w-5 animate-spin" />
                            ) : (
                              formatNumber(securityStats.crossChainVerifications)
                            )}
                          </div>
                          <div className="mt-2 text-sm text-gray-400">
                            Security verifications across multiple chains
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
              
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div variants={itemVariants}>
                  <Card className="bg-[#151515] border-[#333]">
                    <CardHeader>
                      <CardTitle className="text-2xl text-white">How It Works</CardTitle>
                      <CardDescription className="text-gray-400">
                        Understanding the Smart Contract Vault architecture
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-8">
                        <div className="flex flex-col md:flex-row gap-6">
                          <div className="w-full md:w-1/3 rounded-lg bg-[#1A1A1A] p-5 border border-[#333]">
                            <div className="w-12 h-12 rounded-full bg-[#6B00D7] flex items-center justify-center mb-4">
                              <span className="text-xl font-bold text-white">1</span>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">Asset Deposit</h3>
                            <p className="text-sm text-gray-300">
                              Your assets are converted to vault shares using the ERC-4626 deposit mechanism. This creates a tokenized representation of your deposited assets with time-lock functionality.
                            </p>
                          </div>
                          
                          <div className="w-full md:w-1/3 rounded-lg bg-[#1A1A1A] p-5 border border-[#333]">
                            <div className="w-12 h-12 rounded-full bg-[#FF5AF7] flex items-center justify-center mb-4">
                              <span className="text-xl font-bold text-white">2</span>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">Security Implementation</h3>
                            <p className="text-sm text-gray-300">
                              Triple-Chain Security™ protocol activates, creating verification records on Ethereum, Solana, and TON. Quantum-resistant encryption is applied to access parameters.
                            </p>
                          </div>
                          
                          <div className="w-full md:w-1/3 rounded-lg bg-[#1A1A1A] p-5 border border-[#333]">
                            <div className="w-12 h-12 rounded-full bg-[#00E5A0] flex items-center justify-center mb-4">
                              <span className="text-xl font-bold text-white">3</span>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">Time-Locked Access</h3>
                            <p className="text-sm text-gray-300">
                              Access is governed by time-lock mechanisms and optional multi-signature approval. When conditions are met, cross-chain verification confirms legitimacy before asset release.
                            </p>
                          </div>
                        </div>
                        
                        <div className="mt-8 text-center">
                          <Button className="bg-[#6B00D7] text-white hover:bg-[#5600AD]">
                            Create Smart Contract Vault
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </TabsContent>

            <TabsContent value="features" className="py-6">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-6"
              >
                <Card className="bg-[#151515] border-[#333]">
                  <CardHeader>
                    <CardTitle className="text-2xl text-white">Industry-Leading Features</CardTitle>
                    <CardDescription className="text-gray-400">
                      What makes our Smart Contract Vault the most advanced solution in the blockchain space
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <motion.div variants={itemVariants} className="bg-[#1A1A1A] rounded-lg p-5 border border-[#333]">
                        <div className="flex items-start mb-4">
                          <div className="w-10 h-10 rounded-lg bg-[#6B00D7] flex items-center justify-center mr-4">
                            <DollarSign className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-white text-lg">Tokenized Yield Strategy</h3>
                            <p className="text-sm text-gray-400">ERC-4626 compliant yield generation</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-300">
                          Our Smart Contract Vault automatically implements optimal yield strategies based on market conditions while maintaining strict security parameters. Assets can grow in value during the lock period.
                        </p>
                        <div className="mt-4">
                          <Badge className="bg-[#6B00D7] text-white">Premium Feature</Badge>
                        </div>
                      </motion.div>
                      
                      <motion.div variants={itemVariants} className="bg-[#1A1A1A] rounded-lg p-5 border border-[#333]">
                        <div className="flex items-start mb-4">
                          <div className="w-10 h-10 rounded-lg bg-[#FF5AF7] flex items-center justify-center mr-4">
                            <Network className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-white text-lg">Cross-Chain Interoperability</h3>
                            <p className="text-sm text-gray-400">Seamless multi-chain asset management</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-300">
                          Manage assets across Ethereum, Solana, TON, and other supported blockchains through a unified interface. Our proprietary bridge technology ensures security during cross-chain operations.
                        </p>
                        <div className="mt-4">
                          <Badge className="bg-[#FF5AF7] text-white">Advanced</Badge>
                        </div>
                      </motion.div>
                      
                      <motion.div variants={itemVariants} className="bg-[#1A1A1A] rounded-lg p-5 border border-[#333]">
                        <div className="flex items-start mb-4">
                          <div className="w-10 h-10 rounded-lg bg-[#00E5A0] flex items-center justify-center mr-4">
                            <Users className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-white text-lg">Programmable Access Control</h3>
                            <p className="text-sm text-gray-400">Customizable permission systems</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-300">
                          Define complex access conditions combining time-locks, multi-signature requirements, on-chain events, and even external data through oracles. Perfect for inheritance planning and corporate treasuries.
                        </p>
                        <div className="mt-4">
                          <Badge className="bg-[#00E5A0] text-white">Enterprise</Badge>
                        </div>
                      </motion.div>
                      
                      <motion.div variants={itemVariants} className="bg-[#1A1A1A] rounded-lg p-5 border border-[#333]">
                        <div className="flex items-start mb-4">
                          <div className="w-10 h-10 rounded-lg bg-[#47A0FF] flex items-center justify-center mr-4">
                            <Layers className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-white text-lg">Quantum Security Tiers</h3>
                            <p className="text-sm text-gray-400">Adaptive security levels</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-300">
                          Choose from four progressive security tiers: Standard, Enhanced, Maximum, and Fortress™. Each tier implements increasingly robust quantum-resistant algorithms and verification requirements.
                        </p>
                        <div className="mt-4">
                          <Badge className="bg-[#47A0FF] text-white">Exclusive</Badge>
                        </div>
                      </motion.div>
                    </div>
                    
                    <div className="mt-8 space-y-6">
                      <motion.div variants={itemVariants}>
                        <h3 className="text-xl font-bold text-white mb-4">Premium Vault Features</h3>
                        <div className="bg-[#1A1A1A] rounded-lg p-6 border border-[#333]">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-lg bg-[#6B00D7] flex items-center justify-center mr-3">
                                  <HardDrive className="h-4 w-4 text-white" />
                                </div>
                                <span className="text-white font-medium">Deep Cold Storage Integration</span>
                              </div>
                              <Badge className="bg-[#6B00D7]/20 text-[#FF5AF7]">Fortress™ Tier</Badge>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-lg bg-[#6B00D7] flex items-center justify-center mr-3">
                                  <Shield className="h-4 w-4 text-white" />
                                </div>
                                <span className="text-white font-medium">Catastrophe Recovery Protocol</span>
                              </div>
                              <Badge className="bg-[#6B00D7]/20 text-[#FF5AF7]">Fortress™ Tier</Badge>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-lg bg-[#6B00D7] flex items-center justify-center mr-3">
                                  <Layers className="h-4 w-4 text-white" />
                                </div>
                                <span className="text-white font-medium">SPHINCS+ Hash-Based Signatures</span>
                              </div>
                              <Badge className="bg-[#6B00D7]/20 text-[#FF5AF7]">Fortress™ Tier</Badge>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-lg bg-[#6B00D7] flex items-center justify-center mr-3">
                                  <KeyRound className="h-4 w-4 text-white" />
                                </div>
                                <span className="text-white font-medium">FrodoKEM-1344 Key Encapsulation</span>
                              </div>
                              <Badge className="bg-[#6B00D7]/20 text-[#FF5AF7]">Fortress™ Tier</Badge>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="security" className="py-6">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-6"
              >
                <Card className="bg-[#151515] border-[#333]">
                  <CardHeader>
                    <CardTitle className="text-2xl text-white">Triple-Chain Security Architecture</CardTitle>
                    <CardDescription className="text-gray-400">
                      How our revolutionary security model protects your assets across multiple blockchains
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <motion.div variants={itemVariants} className="bg-[#1A1A1A] rounded-lg p-5 border border-[#6B00D7]/30">
                          <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 rounded-lg bg-blue-700 flex items-center justify-center">
                              <span className="text-xl font-bold text-white">Ξ</span>
                            </div>
                            <Badge className="bg-blue-700">Primary Chain</Badge>
                          </div>
                          <h3 className="text-lg font-bold text-white mb-2">Ethereum Layer</h3>
                          <p className="text-sm text-gray-300 mb-4">
                            Primary ownership records and vault creation. ERC-4626 tokenized vault implementation with secure time-lock mechanisms.
                          </p>
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                              <span className="text-sm text-gray-300">Access control management</span>
                            </div>
                            <div className="flex items-center">
                              <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                              <span className="text-sm text-gray-300">Smart contract ownership</span>
                            </div>
                            <div className="flex items-center">
                              <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                              <span className="text-sm text-gray-300">Definitive transaction record</span>
                            </div>
                          </div>
                        </motion.div>
                        
                        <motion.div variants={itemVariants} className="bg-[#1A1A1A] rounded-lg p-5 border border-[#FF5AF7]/30">
                          <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 rounded-lg bg-purple-600 flex items-center justify-center">
                              <span className="text-xl font-bold text-white">S</span>
                            </div>
                            <Badge className="bg-purple-600">Verification Chain</Badge>
                          </div>
                          <h3 className="text-lg font-bold text-white mb-2">Solana Layer</h3>
                          <p className="text-sm text-gray-300 mb-4">
                            High-frequency monitoring and rapid validation. Provides real-time security checks and anomaly detection.
                          </p>
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                              <span className="text-sm text-gray-300">High-speed monitoring</span>
                            </div>
                            <div className="flex items-center">
                              <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                              <span className="text-sm text-gray-300">Continuous validation</span>
                            </div>
                            <div className="flex items-center">
                              <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                              <span className="text-sm text-gray-300">Transaction verification</span>
                            </div>
                          </div>
                        </motion.div>
                        
                        <motion.div variants={itemVariants} className="bg-[#1A1A1A] rounded-lg p-5 border border-[#00E5A0]/30">
                          <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 rounded-lg bg-[#0088CC] flex items-center justify-center">
                              <span className="text-xl font-bold text-white">T</span>
                            </div>
                            <Badge className="bg-[#0088CC]">Recovery Chain</Badge>
                          </div>
                          <h3 className="text-lg font-bold text-white mb-2">TON Layer</h3>
                          <p className="text-sm text-gray-300 mb-4">
                            Emergency recovery system and backup security. Provides alternative access path if primary systems are compromised.
                          </p>
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                              <span className="text-sm text-gray-300">Backup recovery system</span>
                            </div>
                            <div className="flex items-center">
                              <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                              <span className="text-sm text-gray-300">Emergency access protocol</span>
                            </div>
                            <div className="flex items-center">
                              <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                              <span className="text-sm text-gray-300">Cross-chain communication</span>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                      
                      <motion.div variants={itemVariants} className="mt-8">
                        <h3 className="text-xl font-bold text-white mb-4">Quantum Resistance Tiers</h3>
                        <div className="space-y-4">
                          <div className="bg-[#1A1A1A] rounded-lg p-5 border border-[#333]">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center mr-3">
                                  <span className="text-sm font-bold text-white">1</span>
                                </div>
                                <h4 className="font-semibold text-white">Standard Security</h4>
                              </div>
                              <Badge className="bg-green-600/20 text-green-500">Level 1</Badge>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-400">Signature Algorithm:</span>
                                <span className="ml-2 text-white">Falcon-512</span>
                              </div>
                              <div>
                                <span className="text-gray-400">Key Encapsulation:</span>
                                <span className="ml-2 text-white">Kyber-512</span>
                              </div>
                            </div>
                            <div className="mt-2">
                              <span className="text-gray-400 text-sm">Recommended for assets up to:</span>
                              <span className="ml-2 text-white text-sm">$10,000 USD</span>
                            </div>
                          </div>
                          
                          <div className="bg-[#1A1A1A] rounded-lg p-5 border border-[#333]">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center mr-3">
                                  <span className="text-sm font-bold text-white">2</span>
                                </div>
                                <h4 className="font-semibold text-white">Enhanced Security</h4>
                              </div>
                              <Badge className="bg-blue-600/20 text-blue-500">Level 2</Badge>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-400">Signature Algorithm:</span>
                                <span className="ml-2 text-white">Falcon-1024</span>
                              </div>
                              <div>
                                <span className="text-gray-400">Key Encapsulation:</span>
                                <span className="ml-2 text-white">Kyber-768</span>
                              </div>
                            </div>
                            <div className="mt-2">
                              <span className="text-gray-400 text-sm">Recommended for assets up to:</span>
                              <span className="ml-2 text-white text-sm">$100,000 USD</span>
                            </div>
                          </div>
                          
                          <div className="bg-[#1A1A1A] rounded-lg p-5 border border-[#333]">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center mr-3">
                                  <span className="text-sm font-bold text-white">3</span>
                                </div>
                                <h4 className="font-semibold text-white">Maximum Security</h4>
                              </div>
                              <Badge className="bg-purple-600/20 text-purple-400">Level 3</Badge>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-400">Signature Algorithm:</span>
                                <span className="ml-2 text-white">CRYSTALS-Dilithium</span>
                              </div>
                              <div>
                                <span className="text-gray-400">Key Encapsulation:</span>
                                <span className="ml-2 text-white">Kyber-1024</span>
                              </div>
                            </div>
                            <div className="mt-2">
                              <span className="text-gray-400 text-sm">Recommended for assets up to:</span>
                              <span className="ml-2 text-white text-sm">$1,000,000 USD</span>
                            </div>
                          </div>
                          
                          <div className="bg-[#1A1A1A] rounded-lg p-5 border border-[#6B00D7]">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-lg bg-[#6B00D7] flex items-center justify-center mr-3">
                                  <span className="text-sm font-bold text-white">F</span>
                                </div>
                                <h4 className="font-semibold text-white">Fortress™ Security</h4>
                              </div>
                              <Badge className="bg-[#6B00D7]/20 text-[#FF5AF7]">Military Grade</Badge>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-400">Signature Algorithm:</span>
                                <span className="ml-2 text-white">SPHINCS+</span>
                              </div>
                              <div>
                                <span className="text-gray-400">Key Encapsulation:</span>
                                <span className="ml-2 text-white">FrodoKEM-1344</span>
                              </div>
                            </div>
                            <div className="mt-2">
                              <span className="text-gray-400 text-sm">Recommended for assets up to:</span>
                              <span className="ml-2 text-white text-sm">$10,000,000+ USD</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="implementation" className="py-6">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-6"
              >
                <Card className="bg-[#151515] border-[#333]">
                  <CardHeader>
                    <CardTitle className="text-2xl text-white">Technical Implementation</CardTitle>
                    <CardDescription className="text-gray-400">
                      Smart contract specifications and blockchain implementation details
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <motion.div variants={itemVariants}>
                        <h3 className="text-xl font-bold text-white mb-4">ERC-4626 Tokenized Vault</h3>
                        <div className="bg-[#0F0F0F] p-4 rounded-lg border border-[#333] font-mono text-sm text-gray-300 overflow-x-auto">
                          <pre>{`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title ChronosVault
 * @dev ERC-4626 compliant tokenized vault with time-lock functionality
 */
contract ChronosVault is ERC4626, Ownable, ReentrancyGuard {
    struct VaultData {
        address owner;
        uint256 unlockTime;
        bytes32 securityHash;
        uint8 securityLevel;
        bool isMultiSig;
        address[] beneficiaries;
    }
    
    mapping(uint256 => VaultData) public vaults;
    uint256 public vaultCounter;
    
    // Security verification contracts on other chains
    address public solanaVerifier;
    address public tonVerifier;
    
    // Events
    event VaultCreated(address indexed creator, uint256 indexed vaultId, uint256 unlockTime, uint8 securityLevel);
    event VaultUnlocked(uint256 indexed vaultId, address indexed retriever);
    event SecurityVerificationUpdated(uint256 indexed vaultId, bytes32 verificationHash);
    
    // ... additional contract implementation
}`}</pre>
                        </div>
                      </motion.div>
                      
                      <motion.div variants={itemVariants}>
                        <h3 className="text-xl font-bold text-white mb-4">Cross-Chain Verification</h3>
                        <div className="bg-[#0F0F0F] p-4 rounded-lg border border-[#333] font-mono text-sm text-gray-300 overflow-x-auto">
                          <pre>{`/**
 * @title ChronosVaultVerifier
 * @dev Cross-chain verification for the Smart Contract Vault
 */
contract ChronosVaultVerifier {
    struct VerificationRecord {
        bytes32 vaultHash;
        uint256 timestamp;
        bytes32 securityProof;
        bool isValid;
    }
    
    mapping(bytes32 => VerificationRecord) public verifications;
    
    event VerificationCreated(bytes32 indexed vaultId, bytes32 securityProof);
    event VerificationConfirmed(bytes32 indexed vaultId, bool isValid);
    
    // ... verification implementation
}`}</pre>
                        </div>
                      </motion.div>
                      
                      <motion.div variants={itemVariants}>
                        <Accordion type="single" collapsible className="w-full">
                          <AccordionItem value="item-1" className="border-[#333]">
                            <AccordionTrigger className="text-white hover:text-white hover:no-underline">
                              Ethereum Deployment Information
                            </AccordionTrigger>
                            <AccordionContent className="text-gray-300">
                              <div className="space-y-4">
                                <div className="bg-[#1A1A1A] p-4 rounded-lg border border-[#333]">
                                  <div className="flex justify-between">
                                    <h4 className="font-medium text-[#FF5AF7]">ChronosVault.sol</h4>
                                    <div className="flex items-center space-x-2">
                                      <Badge className="bg-green-600">Active</Badge>
                                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleCopyAddress("0x4B3aBcB789e6Bc7D6209c4603C52f433a4c84520")}>
                                        <Copy className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                  <p className="text-sm text-gray-400 my-2">Mainnet: 0x4B3aBcB789e6Bc7D6209c4603C52f433a4c84520</p>
                                  <div className="flex items-center text-sm text-gray-400">
                                    <Clock className="h-3 w-3 mr-1" />
                                    <span>Deployed: May 10, 2025</span>
                                  </div>
                                </div>
                                
                                <div className="bg-[#1A1A1A] p-4 rounded-lg border border-[#333]">
                                  <div className="flex justify-between">
                                    <h4 className="font-medium text-[#FF5AF7]">ChronosVaultVerifier.sol</h4>
                                    <div className="flex items-center space-x-2">
                                      <Badge className="bg-green-600">Active</Badge>
                                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleCopyAddress("0xD8a394E2F8e4A28B8685c1b24C5C17b6498031Ff")}>
                                        <Copy className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                  <p className="text-sm text-gray-400 my-2">Mainnet: 0xD8a394E2F8e4A28B8685c1b24C5C17b6498031Ff</p>
                                  <div className="flex items-center text-sm text-gray-400">
                                    <Clock className="h-3 w-3 mr-1" />
                                    <span>Deployed: May 10, 2025</span>
                                  </div>
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                          
                          <AccordionItem value="item-2" className="border-[#333]">
                            <AccordionTrigger className="text-white hover:text-white hover:no-underline">
                              Solana Deployment Information
                            </AccordionTrigger>
                            <AccordionContent className="text-gray-300">
                              <div className="space-y-4">
                                <div className="bg-[#1A1A1A] p-4 rounded-lg border border-[#333]">
                                  <div className="flex justify-between">
                                    <h4 className="font-medium text-[#FF5AF7]">chronos_vault_verifier.rs</h4>
                                    <div className="flex items-center space-x-2">
                                      <Badge className="bg-green-600">Active</Badge>
                                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleCopyAddress("ChVr1vLMkBmBKVJqUJRXUPnpyZf2ZM4twuVczLH9RcUU")}>
                                        <Copy className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                  <p className="text-sm text-gray-400 my-2">Program ID: ChVr1vLMkBmBKVJqUJRXUPnpyZf2ZM4twuVczLH9RcUU</p>
                                  <div className="flex items-center text-sm text-gray-400">
                                    <Clock className="h-3 w-3 mr-1" />
                                    <span>Deployed: May 10, 2025</span>
                                  </div>
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                          
                          <AccordionItem value="item-3" className="border-[#333]">
                            <AccordionTrigger className="text-white hover:text-white hover:no-underline">
                              TON Deployment Information
                            </AccordionTrigger>
                            <AccordionContent className="text-gray-300">
                              <div className="space-y-4">
                                <div className="bg-[#1A1A1A] p-4 rounded-lg border border-[#333]">
                                  <div className="flex justify-between">
                                    <h4 className="font-medium text-[#FF5AF7]">ChronosVaultRecovery.fc</h4>
                                    <div className="flex items-center space-x-2">
                                      <Badge className="bg-green-600">Active</Badge>
                                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleCopyAddress("EQB0gCDoGJNTfoPUSCgBxLuZ_O-7aYUccU0P1Vj_QdO6rQTf")}>
                                        <Copy className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                  <p className="text-sm text-gray-400 my-2">Address: EQB0gCDoGJNTfoPUSCgBxLuZ_O-7aYUccU0P1Vj_QdO6rQTf</p>
                                  <div className="flex items-center text-sm text-gray-400">
                                    <Clock className="h-3 w-3 mr-1" />
                                    <span>Deployed: May 10, 2025</span>
                                  </div>
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </motion.div>
                      
                      <motion.div variants={itemVariants} className="mt-8">
                        <h3 className="text-xl font-bold text-white mb-4">Audits and Security Verification</h3>
                        <div className="bg-[#1A1A1A] p-5 rounded-lg border border-[#333]">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <Badge className="bg-green-600 mr-3">Completed</Badge>
                                <h4 className="font-medium text-white">CertiK Security Audit</h4>
                              </div>
                              <span className="text-sm text-gray-400">April 28, 2025</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <Badge className="bg-green-600 mr-3">Completed</Badge>
                                <h4 className="font-medium text-white">Trail of Bits Formal Verification</h4>
                              </div>
                              <span className="text-sm text-gray-400">May 2, 2025</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <Badge className="bg-green-600 mr-3">Completed</Badge>
                                <h4 className="font-medium text-white">Quantum Computing Resistance Testing</h4>
                              </div>
                              <span className="text-sm text-gray-400">May 5, 2025</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <Badge className="bg-green-600 mr-3">Completed</Badge>
                                <h4 className="font-medium text-white">Cross-Chain Communication Verification</h4>
                              </div>
                              <span className="text-sm text-gray-400">May 8, 2025</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                    
                    <div className="mt-8 text-center">
                      <Button className="bg-[#6B00D7] text-white hover:bg-[#5600AD]">
                        Create Smart Contract Vault
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </Container>
      </div>
    </>
  );
}