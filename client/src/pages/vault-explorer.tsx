import React, { useState } from "react";
import { Helmet } from "react-helmet";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ExternalLink,
  Search,
  ChevronRight,
  Shield,
  Clock,
  Wallet,
  AlertTriangle,
} from "lucide-react";
import {
  BlockchainType,
  ChainExplorerInfo,
  VaultStatus,
} from "@/lib/cross-chain/types";
import { useChainExplorer } from "@/hooks/use-chain-explorer";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";

type VaultInfo = {
  id: string;
  name: string;
  owner: string;
  blockchain: BlockchainType;
  status: VaultStatus;
  unlockDate: Date | null;
  value: string;
  txHash?: string;
  securityLevel: "standard" | "enhanced" | "maximum";
  createdAt: Date;
}

const VaultExplorer = () => {
  const [searchParams, setSearchParams] = useState({
    vaultId: "",
    blockchain: "ETH" as BlockchainType,
    address: "",
    txHash: "",
  });
  const [activeTab, setActiveTab] = useState<"find" | "recent">("find");
  const [searchResults, setSearchResults] = useState<VaultInfo[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { getExplorerUrl } = useChainExplorer();
  const { toast } = useToast();

  const searchMutation = useMutation({
    mutationFn: async (searchData: any) => {
      const res = await apiRequest("GET", `/api/vaults/search?${new URLSearchParams(searchData).toString()}`);
      if (!res.ok) {
        throw new Error("Failed to search vaults");
      }
      return await res.json();
    },
    onSuccess: (data) => {
      setSearchResults(data);
      if (data.length === 0) {
        toast({
          title: "No vaults found",
          description: "No vaults match your search criteria.",
          variant: "destructive",
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Search failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSearch = () => {
    // Validate search parameters
    if (!searchParams.vaultId && !searchParams.address && !searchParams.txHash) {
      toast({
        title: "Search criteria required",
        description: "Please enter a vault ID, wallet address, or transaction hash to search",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    searchMutation.mutate(searchParams);
  };

  const handleSelectBlockchain = (value: string) => {
    setSearchParams({ ...searchParams, blockchain: value as BlockchainType });
  };

  const getVaultStatusColor = (status: VaultStatus) => {
    switch (status) {
      case "active":
        return "text-green-500";
      case "pending":
        return "text-yellow-500";
      case "locked":
        return "text-blue-500";
      case "unlocked":
        return "text-purple-500";
      default:
        return "text-gray-500";
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const openExplorer = (blockchain: BlockchainType, type: "address" | "transaction", value: string) => {
    const url = getExplorerUrl(blockchain, type, value);
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      toast({
        title: "Explorer not available",
        description: `No explorer available for ${blockchain}`,
        variant: "destructive",
      });
    }
  };

  // Sample recent vaults - in a real implementation, these would come from an API
  const recentVaults: VaultInfo[] = [
    {
      id: "vault-001",
      name: "ETH Timelock Reserve",
      owner: "0x1234...5678",
      blockchain: "ETH",
      status: "locked",
      unlockDate: new Date("2025-12-31"),
      value: "5.2 ETH",
      txHash: "0x9876543210abcdef",
      securityLevel: "maximum",
      createdAt: new Date("2023-10-15"),
    },
    {
      id: "vault-002",
      name: "SOL Emergency Fund",
      owner: "Sol12...34",
      blockchain: "SOL",
      status: "active",
      unlockDate: new Date("2026-06-15"),
      value: "120 SOL",
      txHash: "4xzT9...W2f",
      securityLevel: "enhanced",
      createdAt: new Date("2023-11-22"),
    },
    {
      id: "vault-003",
      name: "TON Family Savings",
      owner: "UQDr...zxy",
      blockchain: "TON",
      status: "unlocked",
      unlockDate: null,
      value: "450 TON",
      txHash: "tTx67...8mn",
      securityLevel: "standard",
      createdAt: new Date("2023-09-01"),
    },
  ];

  return (
    <>
      <Helmet>
        <title>Blockchain Vault Explorer | Chronos Vault</title>
      </Helmet>
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] text-transparent bg-clip-text">
            Multi-Chain Vault Explorer
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Search and track vaults across Ethereum, Solana, and TON blockchains with our unified explorer interface.
          </p>
        </div>

        <Card className="border border-[#6B00D7]/20 bg-black/60 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle>Blockchain Vault Explorer</CardTitle>
            <CardDescription>
              Search for vaults by ID, wallet address, or transaction hash across multiple blockchains
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "find" | "recent")} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="find" className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Find Vaults
                </TabsTrigger>
                <TabsTrigger value="recent" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Recent Vaults
                </TabsTrigger>
              </TabsList>

              <TabsContent value="find" className="p-0 border-0">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <label className="block text-sm font-medium text-gray-300">Blockchain Network</label>
                      <Select value={searchParams.blockchain} onValueChange={handleSelectBlockchain}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select blockchain" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Networks</SelectLabel>
                            <SelectItem value="ETH">Ethereum</SelectItem>
                            <SelectItem value="SOL">Solana</SelectItem>
                            <SelectItem value="TON">TON</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-4">
                      <label className="block text-sm font-medium text-gray-300">Vault ID</label>
                      <Input
                        placeholder="Enter vault ID"
                        value={searchParams.vaultId}
                        onChange={(e) => setSearchParams({ ...searchParams, vaultId: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <label className="block text-sm font-medium text-gray-300">Wallet Address</label>
                      <Input
                        placeholder="Enter wallet address"
                        value={searchParams.address}
                        onChange={(e) => setSearchParams({ ...searchParams, address: e.target.value })}
                      />
                    </div>

                    <div className="space-y-4">
                      <label className="block text-sm font-medium text-gray-300">Transaction Hash</label>
                      <Input
                        placeholder="Enter transaction hash"
                        value={searchParams.txHash}
                        onChange={(e) => setSearchParams({ ...searchParams, txHash: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="flex justify-center pt-4">
                    <Button
                      onClick={handleSearch}
                      disabled={isSearching}
                      className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:opacity-90 text-white py-2 px-8"
                    >
                      {isSearching ? "Searching..." : "Search Across Blockchains"}
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="recent" className="p-0 border-0">
                <div className="space-y-2">
                  {recentVaults.map((vault) => (
                    <VaultCard
                      key={vault.id}
                      vault={vault}
                      openExplorer={openExplorer}
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {searchResults.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Search Results</h2>
            <div className="space-y-4">
              {searchResults.map((vault) => (
                <VaultCard
                  key={vault.id}
                  vault={vault}
                  openExplorer={openExplorer}
                />
              ))}
            </div>
          </div>
        )}

        <Card className="border border-[#6B00D7]/20 bg-black/60 backdrop-blur-sm mt-12">
          <CardHeader>
            <CardTitle>Explorer Features</CardTitle>
            <CardDescription>
              Our unified explorer provides seamless access to vault information across multiple blockchains
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center text-center space-y-3 p-4 rounded-lg border border-[#6B00D7]/20 bg-black/30">
                <Shield className="h-12 w-12 text-[#FF5AF7]" />
                <h3 className="text-lg font-semibold">Multi-Chain Verification</h3>
                <p className="text-sm text-gray-400">
                  Verify vault integrity across Ethereum, Solana, and TON networks simultaneously
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center space-y-3 p-4 rounded-lg border border-[#6B00D7]/20 bg-black/30">
                <Wallet className="h-12 w-12 text-[#FF5AF7]" />
                <h3 className="text-lg font-semibold">Direct Explorer Integration</h3>
                <p className="text-sm text-gray-400">
                  Jump directly to native blockchain explorers for detailed transaction information
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center space-y-3 p-4 rounded-lg border border-[#6B00D7]/20 bg-black/30">
                <AlertTriangle className="h-12 w-12 text-[#FF5AF7]" />
                <h3 className="text-lg font-semibold">Security Status Monitoring</h3>
                <p className="text-sm text-gray-400">
                  Real-time monitoring of vault security status and cross-chain verification
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

interface VaultCardProps {
  vault: VaultInfo;
  openExplorer: (blockchain: BlockchainType, type: "address" | "transaction", value: string) => void;
}

const VaultCard: React.FC<VaultCardProps> = ({ vault, openExplorer }) => {
  const getBlockchainIcon = (blockchain: BlockchainType) => {
    switch (blockchain) {
      case "ETH":
        return "⟠"; // Ethereum symbol
      case "SOL":
        return "◎"; // Solana symbol
      case "TON":
        return "💎"; // TON symbol
      default:
        return "🔗"; // Generic blockchain symbol
    }
  };

  const getSecurityLevelColor = (level: string) => {
    switch (level) {
      case "standard":
        return "text-blue-500";
      case "enhanced":
        return "text-yellow-500";
      case "maximum":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <Card className="border border-[#6B00D7]/10 bg-black/50 backdrop-blur-sm hover:border-[#6B00D7]/40 transition-all">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">{getBlockchainIcon(vault.blockchain)}</span>
              <h3 className="text-lg font-bold">{vault.name}</h3>
              <span className={`text-sm px-2 py-0.5 rounded-full border ${getVaultStatusColor(vault.status)} border-current`}>
                {vault.status}
              </span>
            </div>
            <p className="text-sm text-gray-400">ID: {vault.id}</p>
            <p className="text-sm">
              <span className="text-gray-400">Security Level: </span>
              <span className={getSecurityLevelColor(vault.securityLevel)}>
                {vault.securityLevel.charAt(0).toUpperCase() + vault.securityLevel.slice(1)}
              </span>
            </p>
          </div>

          <div className="space-y-2 text-right">
            <p className="text-lg font-bold">{vault.value}</p>
            {vault.unlockDate && (
              <p className="text-sm">
                <span className="text-gray-400">Unlock Date: </span>
                {new Date(vault.unlockDate).toLocaleDateString()}
              </p>
            )}
            <p className="text-sm text-gray-400">Created: {new Date(vault.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4 justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            className="border-[#6B00D7]/30 text-xs"
            onClick={() => openExplorer(vault.blockchain, "address", vault.owner)}
          >
            View Address <ExternalLink className="ml-1 h-3 w-3" />
          </Button>
          
          {vault.txHash && (
            <Button 
              variant="outline" 
              size="sm" 
              className="border-[#6B00D7]/30 text-xs"
              onClick={() => openExplorer(vault.blockchain, "transaction", vault.txHash!)}
            >
              Transaction <ExternalLink className="ml-1 h-3 w-3" />
            </Button>
          )}
          
          <Button 
            size="sm" 
            className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:opacity-90 text-white text-xs"
          >
            Vault Details <ChevronRight className="ml-1 h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VaultExplorer;