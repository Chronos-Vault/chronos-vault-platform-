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
  ArrowRightLeft,
  CheckCircle2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Helmet } from "react-helmet";

interface DeployedContract {
  name: string;
  address: string;
  description: string;
  verified: boolean;
  category: 'core' | 'security' | 'bridge' | 'governance' | 'utility';
}

export default function SmartContractsPage() {
  const [activeTab, setActiveTab] = useState("arbitrum");
  const { toast } = useToast();
  
  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    toast({
      title: "Address copied",
      description: "Contract address copied to clipboard",
    });
  };

  const arbitrumContracts: DeployedContract[] = [
    { name: "TrinityConsensusVerifier", address: "0x59396D58Fa856025bD5249E342729d5550Be151C", description: "2-of-3 multi-chain consensus verification", verified: true, category: 'core' },
    { name: "TrinityShieldVerifier", address: "0x2971c0c3139F89808F87b2445e53E5Fb83b6A002", description: "Hardware TEE attestation verification", verified: true, category: 'security' },
    { name: "TrinityShieldVerifierV2", address: "0xf111D291afdf8F0315306F3f652d66c5b061F4e3", description: "Enhanced TEE verification with SGX/SEV support", verified: true, category: 'security' },
    { name: "ChronosVaultOptimized", address: "0xAE408eC592f0f865bA0012C480E8867e12B4F32D", description: "ERC-4626 compliant investment vault", verified: true, category: 'core' },
    { name: "HTLCChronosBridge", address: "0x82C3AbF6036cEE41E151A90FE00181f6b18af8ca", description: "Hash Time-Locked Contract for cross-chain swaps", verified: true, category: 'bridge' },
    { name: "HTLCArbToL1", address: "0xaDDAC5670941416063551c996e169b0fa569B8e1", description: "Arbitrum to L1 HTLC bridge", verified: true, category: 'bridge' },
    { name: "EmergencyMultiSig", address: "0x066A39Af76b625c1074aE96ce9A111532950Fc41", description: "Emergency operations multi-signature wallet", verified: true, category: 'security' },
    { name: "TrinityKeeperRegistry", address: "0xAe9bd988011583D87d6bbc206C19e4a9Bda04830", description: "Validator keeper registration and management", verified: true, category: 'governance' },
    { name: "TrinityGovernanceTimelock", address: "0xf6b9AB802b323f8Be35ca1C733e155D4BdcDb61b", description: "Time-locked governance execution", verified: true, category: 'governance' },
    { name: "CrossChainMessageRelay", address: "0xC6F4f855fc690CB52159eE3B13C9d9Fb8D403E59", description: "Cross-chain message passing relay", verified: true, category: 'bridge' },
    { name: "TrinityExitGateway", address: "0xE6FeBd695e4b5681DCF274fDB47d786523796C04", description: "Secure exit and withdrawal gateway", verified: true, category: 'core' },
    { name: "TrinityFeeSplitter", address: "0x4F777c8c7D3Ea270c7c6D9Db8250ceBe1648A058", description: "Protocol fee distribution", verified: true, category: 'utility' },
    { name: "TrinityRelayerCoordinator", address: "0x4023B7307BF9e1098e0c34F7E8653a435b20e635", description: "Cross-chain relayer coordination", verified: true, category: 'bridge' },
    { name: "TestERC20", address: "0x4567853BE0d5780099E3542Df2e00C5B633E0161", description: "Test token for development", verified: true, category: 'utility' },
  ];

  const solanaPrograms: DeployedContract[] = [
    { name: "Trinity Validator Program", address: "CYaDJYRqm35udQ8vkxoajSER8oaniQUcV8Vvw5BqJyo2", description: "High-frequency validation and monitoring", verified: true, category: 'core' },
    { name: "CVT Token", address: "5g3TkqFxyVe1ismrC5r2QD345CA1YdfWn6s6p4AYNmy4", description: "Chronos Vault Token (SPL)", verified: true, category: 'utility' },
    { name: "Bridge Program", address: "6wo8Gso3uB8M6t9UGiritdGmc4UTPEtM5NhC6vbb9CdK", description: "Cross-chain bridge operations", verified: true, category: 'bridge' },
    { name: "Vesting Program", address: "3dxjcEGP8MurCtodLCJi1V6JBizdRRAYg91nZkhmX1sB", description: "Token vesting with cryptographic time-locks", verified: true, category: 'utility' },
  ];

  const tonContracts: DeployedContract[] = [
    { name: "TrinityConsensus", address: "EQeGlYzwupSROVWGucOmKyUDbSaKmPfIpHHP5mV73odL8", description: "Quantum-resistant consensus with 3-of-3 approval", verified: true, category: 'core' },
    { name: "ChronosVault", address: "EQjUVidQfn4m-Rougn0fol7ECCthba2HV0M6xz9zAfax4", description: "Secure vault with ML-KEM-1024 recovery", verified: true, category: 'core' },
  ];

  const getExplorerUrl = (chain: string, address: string) => {
    switch (chain) {
      case 'arbitrum':
        return `https://sepolia.arbiscan.io/address/${address}`;
      case 'solana':
        return `https://solscan.io/account/${address}?cluster=devnet`;
      case 'ton':
        return `https://testnet.tonscan.org/address/${address}`;
      default:
        return '#';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'core': return 'bg-purple-600';
      case 'security': return 'bg-red-600';
      case 'bridge': return 'bg-cyan-600';
      case 'governance': return 'bg-amber-600';
      case 'utility': return 'bg-gray-600';
      default: return 'bg-gray-600';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  const ContractCard = ({ contract, chain }: { contract: DeployedContract; chain: string }) => (
    <motion.div variants={itemVariants}>
      <Card className="bg-gray-900/50 border-gray-800 hover:border-purple-500/50 transition-colors">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base text-white">{contract.name}</CardTitle>
              {contract.verified && (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              )}
            </div>
            <Badge className={`${getCategoryColor(contract.category)} text-white text-xs`}>
              {contract.category}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-gray-400">{contract.description}</p>
          <div className="flex items-center gap-2 bg-gray-800/50 rounded-lg p-2">
            <code className="text-xs text-purple-300 flex-1 truncate font-mono">
              {contract.address}
            </code>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-gray-400 hover:text-white"
              onClick={() => handleCopyAddress(contract.address)}
              data-testid={`copy-${contract.name.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <Copy className="h-3 w-3" />
            </Button>
            <a
              href={getExplorerUrl(chain, contract.address)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-purple-400"
            >
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <>
      <Helmet>
        <title>Deployed Smart Contracts | Chronos Vault - Trinity Protocol™</title>
        <meta name="description" content="View all 20 deployed smart contracts across Arbitrum Sepolia, Solana Devnet, and TON Testnet. Real contract addresses verified on-chain." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] via-[#121218] to-[#0a0a0f] text-white pb-20">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <PageHeader
              heading="Deployed Smart Contracts"
              description="All contracts are deployed on testnets and verifiable on-chain"
              separator={true}
            />
          </motion.div>

          <motion.div 
            className="mt-10 mb-12 p-6 rounded-xl bg-gradient-to-br from-purple-900/30 to-pink-900/20 border border-purple-500/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] mb-4">
              Trinity Protocol™ - 20 Deployed Contracts
            </h2>
            <p className="text-gray-300 mb-6">
              This isn't a whitepaper project. These are working contracts deployed on 3 blockchains. Verify any address on the respective block explorer.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-[#6B00D7]/20 border border-[#6B00D7]/40 text-center">
                <div className="text-3xl font-bold text-purple-400">14</div>
                <div className="text-sm text-gray-400">Arbitrum Sepolia Contracts</div>
                <div className="text-xs text-purple-300 mt-1">PRIMARY SECURITY</div>
              </div>
              <div className="p-4 rounded-lg bg-cyan-900/20 border border-cyan-500/40 text-center">
                <div className="text-3xl font-bold text-cyan-400">4</div>
                <div className="text-sm text-gray-400">Solana Devnet Programs</div>
                <div className="text-xs text-cyan-300 mt-1">HIGH-FREQUENCY MONITOR</div>
              </div>
              <div className="p-4 rounded-lg bg-blue-900/20 border border-blue-500/40 text-center">
                <div className="text-3xl font-bold text-blue-400">2</div>
                <div className="text-sm text-gray-400">TON Testnet Contracts</div>
                <div className="text-xs text-blue-300 mt-1">QUANTUM-RESISTANT BACKUP</div>
              </div>
            </div>
          </motion.div>

          <Tabs defaultValue="arbitrum" onValueChange={setActiveTab} className="mt-8">
            <TabsList className="grid grid-cols-3 mb-8 bg-gray-900/50 border border-gray-800">
              <TabsTrigger value="arbitrum" className="data-[state=active]:bg-purple-600/30">
                <span className="mr-2">⟠</span> Arbitrum Sepolia (14)
              </TabsTrigger>
              <TabsTrigger value="solana" className="data-[state=active]:bg-cyan-600/30">
                <span className="mr-2">◎</span> Solana Devnet (4)
              </TabsTrigger>
              <TabsTrigger value="ton" className="data-[state=active]:bg-blue-600/30">
                <span className="mr-2">💎</span> TON Testnet (2)
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="arbitrum">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {arbitrumContracts.map((contract) => (
                  <ContractCard key={contract.address} contract={contract} chain="arbitrum" />
                ))}
              </motion.div>
              <div className="mt-6 text-center">
                <a
                  href="https://sepolia.arbiscan.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 text-sm flex items-center justify-center gap-2"
                >
                  View all on Arbiscan <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </TabsContent>
            
            <TabsContent value="solana">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {solanaPrograms.map((contract) => (
                  <ContractCard key={contract.address} contract={contract} chain="solana" />
                ))}
              </motion.div>
              <div className="mt-6 text-center">
                <a
                  href="https://solscan.io/?cluster=devnet"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center justify-center gap-2"
                >
                  View all on Solscan <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </TabsContent>
            
            <TabsContent value="ton">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {tonContracts.map((contract) => (
                  <ContractCard key={contract.address} contract={contract} chain="ton" />
                ))}
              </motion.div>
              <div className="mt-6 text-center">
                <a
                  href="https://testnet.tonscan.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 text-sm flex items-center justify-center gap-2"
                >
                  View all on Tonscan <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </TabsContent>
          </Tabs>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-16"
          >
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="h-5 w-5 text-purple-400" />
                  Security Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h4 className="font-medium text-purple-400 flex items-center gap-2">
                      <Lock className="h-4 w-4" /> 2-of-3 Consensus
                    </h4>
                    <p className="text-sm text-gray-400">
                      All critical operations require verification from at least 2 of 3 independent blockchain validators.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-purple-400 flex items-center gap-2">
                      <Clock className="h-4 w-4" /> HTLC Atomic Swaps
                    </h4>
                    <p className="text-sm text-gray-400">
                      Hash Time-Locked Contracts enable trustless cross-chain swaps with cryptographic guarantees.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-purple-400 flex items-center gap-2">
                      <KeyRound className="h-4 w-4" /> Quantum-Resistant
                    </h4>
                    <p className="text-sm text-gray-400">
                      TON contracts use ML-KEM-1024 and CRYSTALS-Dilithium-5 for post-quantum security.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  );
}
