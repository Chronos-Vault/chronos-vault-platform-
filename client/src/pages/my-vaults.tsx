import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import VaultCard from "@/components/vault/vault-card";
import { 
  Card, 
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusCircle } from "lucide-react";

const MyVaults = () => {
  const [activeTab, setActiveTab] = useState("all");
  
  // Mocked user ID for demo purposes
  const userId = 1;
  
  const { data: vaults, isLoading, error } = useQuery({
    queryKey: [`/api/vaults/user/${userId}`],
  });
  
  // Sample vault data for display in case the API isn't ready
  const sampleVaults = [
    {
      id: 1,
      userId: 1,
      name: "My Legacy Vault",
      description: "Securing assets for my family's future",
      vaultType: "legacy",
      assetType: "ETH",
      assetAmount: "10.5",
      timeLockPeriod: 730, // 2 years
      createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 days ago
      unlockDate: new Date(Date.now() + 640 * 24 * 60 * 60 * 1000), // ~1.75 years from now
      isLocked: true
    },
    {
      id: 2,
      userId: 1,
      name: "BTC Holdings",
      description: "Long-term investment strategy for Bitcoin",
      vaultType: "investment",
      assetType: "BTC",
      assetAmount: "1.2",
      timeLockPeriod: 365, // 1 year
      createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000), // 120 days ago
      unlockDate: new Date(Date.now() + 245 * 24 * 60 * 60 * 1000), // ~245 days from now
      isLocked: true
    },
    {
      id: 3,
      userId: 1,
      name: "DAO Treasury",
      description: "Collective funds for our decentralized project",
      vaultType: "project",
      assetType: "USDC",
      assetAmount: "25000",
      timeLockPeriod: 180, // 6 months
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
      unlockDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000), // ~120 days from now
      isLocked: true
    }
  ];
  
  const userVaults = vaults || sampleVaults;
  
  const filteredVaults = activeTab === "all" 
    ? userVaults 
    : userVaults.filter(vault => vault.vaultType === activeTab);
  
  return (
    <section className="py-16 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div>
            <h1 className="font-poppins font-bold text-3xl mb-2">My Vaults</h1>
            <p className="text-gray-400">Manage and monitor your time-locked assets</p>
          </div>
          
          <Link href="/create-vault">
            <Button className="mt-4 md:mt-0 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] text-white">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Vault
            </Button>
          </Link>
        </div>
        
        <Tabs defaultValue="all" onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="all">All Vaults</TabsTrigger>
            <TabsTrigger value="legacy">Legacy</TabsTrigger>
            <TabsTrigger value="investment">Investment</TabsTrigger>
            <TabsTrigger value="project">Project</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-0">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="overflow-hidden">
                    <Skeleton className="h-48 w-full" />
                    <CardContent className="p-6">
                      <Skeleton className="h-6 w-3/4 mb-4" />
                      <Skeleton className="h-4 w-full mb-3" />
                      <Skeleton className="h-4 w-full mb-3" />
                      <Skeleton className="h-10 w-full mt-6" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : error ? (
              <Card className="bg-red-500/10 border-red-500/30">
                <CardHeader>
                  <CardTitle>Error Loading Vaults</CardTitle>
                  <CardDescription>
                    We encountered an issue while loading your vaults. Please try again.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" onClick={() => window.location.reload()}>
                    Retry
                  </Button>
                </CardContent>
              </Card>
            ) : filteredVaults.length === 0 ? (
              <Card className="bg-[#1E1E1E] border border-[#333333]">
                <CardHeader>
                  <CardTitle>No Vaults Found</CardTitle>
                  <CardDescription>
                    You don't have any {activeTab !== 'all' ? activeTab : ''} vaults yet. Create one to get started.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/create-vault">
                    <Button className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] text-white">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Create Your First Vault
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredVaults.map((vault) => (
                  <VaultCard
                    key={vault.id}
                    vault={vault}
                    variant={vault.vaultType as any}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default MyVaults;
