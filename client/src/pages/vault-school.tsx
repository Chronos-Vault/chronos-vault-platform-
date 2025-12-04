import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight, Filter, BookOpen, Shield, Coins, Clock, Crown, Code, AlertCircle, CheckCircle, Zap, Lock, Globe, TrendingUp, Link2 } from "lucide-react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface VaultType {
  id: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  category: 'security' | 'blockchain' | 'investment' | 'legacy' | 'premium';
  features: string[];
  primaryChains: string[];
  securityLevel: number;
  documentationPath: string;
  tags: string[];
  status: 'beta' | 'ga' | 'coming-soon';
  icon: string;
  gradientColors: string;
  securityProtocols: string[];
}

interface VaultCatalogResponse {
  success: boolean;
  totalVaults: number;
  categories: {
    security: number;
    blockchain: number;
    investment: number;
    legacy: number;
    premium: number;
  };
  vaultTypes: VaultType[];
}

const categories = {
  all: {
    name: "All Vaults",
    description: "Explore our complete collection of specialized vault types",
    icon: <BookOpen className="w-5 h-5" />,
    color: "bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]",
  },
  security: {
    name: "Security Vaults",
    description: "Vaults with advanced security features and authentication methods",
    icon: <Shield className="w-5 h-5" />,
    color: "bg-gradient-to-r from-[#6B00D7] to-[#3B82F6]",
  },
  blockchain: {
    name: "Blockchain Vaults",
    description: "Vaults leveraging multi-chain and smart contract technologies",
    icon: <Code className="w-5 h-5" />,
    color: "bg-gradient-to-r from-[#3B82F6] to-[#06B6D4]",
  },
  investment: {
    name: "Investment Strategy Vaults",
    description: "Vaults designed to enforce investment discipline and strategies",
    icon: <Coins className="w-5 h-5" />,
    color: "bg-gradient-to-r from-[#10B981] to-[#6EE7B7]",
  },
  legacy: {
    name: "Legacy & Inheritance Vaults",
    description: "Vaults for estate planning and preserving digital memories",
    icon: <Clock className="w-5 h-5" />,
    color: "bg-gradient-to-r from-[#F59E0B] to-[#FBBF24]",
  },
  premium: {
    name: "Premium Vaults",
    description: "Our most advanced all-in-one vault solutions",
    icon: <Crown className="w-5 h-5" />,
    color: "bg-gradient-to-r from-[#FF5AF7] to-[#FFB86C]",
  },
};

const getCategoryInfo = (category: string) => {
  switch (category) {
    case 'security':
      return { label: 'Security', color: 'text-purple-400', bgColor: 'bg-purple-600/20', icon: <Shield className="h-4 w-4" /> };
    case 'blockchain':
      return { label: 'Blockchain', color: 'text-blue-400', bgColor: 'bg-blue-600/20', icon: <Link2 className="h-4 w-4" /> };
    case 'investment':
      return { label: 'Investment', color: 'text-green-400', bgColor: 'bg-green-600/20', icon: <TrendingUp className="h-4 w-4" /> };
    case 'legacy':
      return { label: 'Legacy', color: 'text-amber-400', bgColor: 'bg-amber-600/20', icon: <Clock className="h-4 w-4" /> };
    case 'premium':
      return { label: 'Premium', color: 'text-orange-400', bgColor: 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20', icon: <Zap className="h-4 w-4" /> };
    default:
      return { label: category, color: 'text-gray-400', bgColor: 'bg-gray-600/20', icon: null };
  }
};

export default function VaultSchool() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [expandedVault, setExpandedVault] = useState<string | null>(null);

  const { data: catalogData, isLoading, error } = useQuery<VaultCatalogResponse>({
    queryKey: ['/api/vault-catalog'],
    refetchInterval: 60000,
  });

  const filteredVaults = catalogData?.vaultTypes?.filter(
    vault => selectedCategory === "all" || vault.category === selectedCategory
  ) || [];

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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  const renderVaultCard = (vault: VaultType) => {
    const categoryInfo = getCategoryInfo(vault.category);
    const isExpanded = expandedVault === vault.id;

    return (
      <motion.div
        key={vault.id}
        variants={itemVariants}
        className="group"
        data-testid={`vault-card-${vault.id}`}
      >
        <Card 
          className={`h-full transition-all duration-300 border-transparent hover:border-[#FF5AF7]/30 cursor-pointer ${
            isExpanded ? 'ring-2 ring-[#FF5AF7]/50' : ''
          }`}
          onClick={() => setExpandedVault(isExpanded ? null : vault.id)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{vault.icon}</span>
                <div>
                  <CardTitle className="text-lg group-hover:text-[#FF5AF7] transition-colors">
                    {vault.name}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={`${categoryInfo.bgColor} ${categoryInfo.color} text-xs`}>
                      {categoryInfo.label}
                    </Badge>
                    {vault.status === 'beta' && (
                      <Badge variant="outline" className="border-yellow-500 text-yellow-500 text-xs">
                        Beta
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs">
                      Level {vault.securityLevel}
                    </Badge>
                  </div>
                </div>
              </div>
              <ChevronRight className={`h-5 w-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <CardDescription className="text-sm mb-3">
              {vault.shortDescription}
            </CardDescription>
            
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 space-y-4"
              >
                <div>
                  <p className="text-sm text-gray-300 mb-3">{vault.longDescription}</p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-2 text-[#FF5AF7]">Features</h4>
                  <ul className="space-y-1">
                    {vault.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-400">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-2 text-[#FF5AF7]">Security Protocols</h4>
                  <div className="flex flex-wrap gap-1">
                    {vault.securityProtocols.map((protocol, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs border-purple-500/50 text-purple-400">
                        {protocol}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-2 text-[#FF5AF7]">Supported Chains</h4>
                  <div className="flex flex-wrap gap-1">
                    {vault.primaryChains.map((chain, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs capitalize">
                        {chain}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button asChild size="sm" className="bg-gradient-to-r from-[#FF5AF7] to-[#8F75FF]">
                    <Link href={vault.documentationPath}>
                      View Documentation
                    </Link>
                  </Button>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const renderSkeletons = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[...Array(8)].map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-lg bg-gray-800" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-48 bg-gray-800" />
                <Skeleton className="h-4 w-24 bg-gray-800" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2 bg-gray-800" />
            <Skeleton className="h-4 w-3/4 bg-gray-800" />
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0D0D15] to-black">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#FF5AF7] to-[#8F75FF]">
            Vault School
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-6">
            Master the art of digital asset protection. Explore our comprehensive vault types designed for every security need.
          </p>
          {catalogData && (
            <div className="flex justify-center items-center gap-4">
              <Badge className="bg-purple-600 text-white px-4 py-1.5 text-sm">
                {catalogData.totalVaults} Vault Types Available
              </Badge>
              <Badge variant="outline" className="border-green-500 text-green-400 px-4 py-1.5 text-sm">
                <CheckCircle className="h-4 w-4 mr-1" /> All Production Ready
              </Badge>
            </div>
          )}
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-[#FF5AF7]" />
            <span className="text-sm font-medium">Filter by Category</span>
          </div>
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <TabsList className="grid grid-cols-6 w-full bg-gray-900/50">
              {Object.entries(categories).map(([key, cat]) => (
                <TabsTrigger 
                  key={key} 
                  value={key}
                  className="flex items-center gap-2 data-[state=active]:bg-[#FF5AF7]/20 data-[state=active]:text-[#FF5AF7]"
                  data-testid={`category-${key}`}
                >
                  {cat.icon}
                  <span className="hidden md:inline">{cat.name.split(' ')[0]}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          
          {selectedCategory !== 'all' && (
            <div className="mt-4 p-4 rounded-lg bg-gray-900/30 border border-gray-800">
              <div className="flex items-center gap-2">
                {categories[selectedCategory as keyof typeof categories]?.icon}
                <span className="font-semibold">{categories[selectedCategory as keyof typeof categories]?.name}</span>
              </div>
              <p className="text-sm text-gray-400 mt-1">
                {categories[selectedCategory as keyof typeof categories]?.description}
              </p>
            </div>
          )}
        </div>

        {isLoading ? (
          renderSkeletons()
        ) : error ? (
          <div className="text-center py-16">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Failed to Load Vault Catalog</h3>
            <p className="text-gray-400">Please try again later.</p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {filteredVaults.map(vault => renderVaultCard(vault))}
          </motion.div>
        )}

        {!isLoading && filteredVaults.length === 0 && !error && (
          <div className="text-center py-16">
            <BookOpen className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Vaults Found</h3>
            <p className="text-gray-400">No vaults match the selected category.</p>
          </div>
        )}

        <div className="mt-16">
          <div className="bg-gradient-to-r from-[#1A1A1A] to-[#111] border border-[#333] rounded-xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-purple-600/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Trinity Protocol</h3>
                <p className="text-sm text-gray-400">
                  2-of-3 multi-chain consensus across Arbitrum, Solana, and TON
                </p>
              </div>
              <div className="text-center">
                <div className="bg-blue-600/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="h-8 w-8 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Mathematical Security</h3>
                <p className="text-sm text-gray-400">
                  Attack probability &lt;10⁻¹⁸ with formal verification
                </p>
              </div>
              <div className="text-center">
                <div className="bg-green-600/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="h-8 w-8 text-green-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Cross-Chain Ready</h3>
                <p className="text-sm text-gray-400">
                  Seamless operation across multiple blockchain networks
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <div className="flex justify-center gap-4 flex-wrap">
            <Button asChild className="bg-gradient-to-r from-[#FF5AF7] to-[#8F75FF]">
              <Link href="/vault-school-hub">
                Vault School Hub
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-[#FF5AF7] text-[#FF5AF7] hover:bg-[#FF5AF7]/10">
              <Link href="/military-grade-security">
                Security Architecture
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/smart-contract-sdk">
                Developer SDK
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
