import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Layout from '@/components/layout/Layout';
import { 
  Shield, Lock, Users, GitBranch, Clock, Globe, FileImage, Brain, 
  Heart, Target, Milestone, Zap, Key, Gift, FileText, Navigation,
  Cpu, Atom, Bitcoin, MapPin, Image, Bot, Home, TrendingUp, 
  Trophy, Fingerprint, Link2, Eye, Gem, RefreshCw, Castle,
  AlertCircle
} from 'lucide-react';

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

const getIconComponent = (iconEmoji: string, gradientColors: string) => {
  const iconClass = `h-10 w-10 text-white`;
  
  switch (iconEmoji) {
    case '🔒': return <Lock className={iconClass} />;
    case '📱': return <Fingerprint className={iconClass} />;
    case '🌐': return <Globe className={iconClass} />;
    case '🧩': return <GitBranch className={iconClass} />;
    case '⏰': return <Clock className={iconClass} />;
    case '⚛️': return <Atom className={iconClass} />;
    case '📈': return <TrendingUp className={iconClass} />;
    case '₿': return <Bitcoin className={iconClass} />;
    case '📍': return <MapPin className={iconClass} />;
    case '📸': return <Image className={iconClass} />;
    case '🎨': return <FileImage className={iconClass} />;
    case '🤖': return <Bot className={iconClass} />;
    case '👨‍👩‍👧‍👦': return <Home className={iconClass} />;
    case '📊': return <Target className={iconClass} />;
    case '🏆': return <Trophy className={iconClass} />;
    case '📜': return <FileText className={iconClass} />;
    case '🕶️': return <Eye className={iconClass} />;
    case '💎': return <Gem className={iconClass} />;
    case '🤝': return <RefreshCw className={iconClass} />;
    case '🏰': return <Castle className={iconClass} />;
    case '⚡': return <Zap className={iconClass} />;
    case '📘': return <FileText className={iconClass} />;
    default: return <Shield className={iconClass} />;
  }
};

const getCategoryInfo = (category: string) => {
  switch (category) {
    case 'security':
      return { label: 'Security', color: 'bg-purple-600', icon: <Shield className="h-4 w-4" /> };
    case 'blockchain':
      return { label: 'Blockchain', color: 'bg-blue-600', icon: <Link2 className="h-4 w-4" /> };
    case 'investment':
      return { label: 'Investment', color: 'bg-green-600', icon: <TrendingUp className="h-4 w-4" /> };
    case 'legacy':
      return { label: 'Legacy', color: 'bg-amber-600', icon: <Clock className="h-4 w-4" /> };
    case 'premium':
      return { label: 'Premium', color: 'bg-gradient-to-r from-yellow-500 to-orange-500', icon: <Zap className="h-4 w-4" /> };
    default:
      return { label: category, color: 'bg-gray-600', icon: null };
  }
};

const VaultSchoolHubPage: React.FC = () => {
  const { data: catalogData, isLoading, error } = useQuery<VaultCatalogResponse>({
    queryKey: ['/api/vault-catalog'],
    refetchInterval: 60000,
  });

  const renderVaultCard = (vault: VaultType) => {
    const categoryInfo = getCategoryInfo(vault.category);
    
    return (
      <Card 
        key={vault.id} 
        className="overflow-hidden border border-transparent hover:border-[#FF5AF7]/20 transition-all duration-300 hover:shadow-lg hover:shadow-[#FF5AF7]/5"
        data-testid={`vault-card-${vault.id}`}
      >
        <CardHeader className={`bg-gradient-to-r ${vault.gradientColors}`}>
          <div className="flex justify-between items-start">
            <Badge className={`${categoryInfo.color} text-white text-xs`}>
              {categoryInfo.label}
            </Badge>
            {vault.status === 'beta' && (
              <Badge variant="outline" className="border-yellow-500 text-yellow-500 text-xs">
                Beta
              </Badge>
            )}
          </div>
          <div className="flex justify-center items-center h-20 mt-2">
            {getIconComponent(vault.icon, vault.gradientColors)}
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <CardTitle className="text-lg mb-2">{vault.name}</CardTitle>
          <CardDescription className="text-sm mb-3">{vault.shortDescription}</CardDescription>
          <div className="flex flex-wrap gap-1 mb-2">
            {vault.primaryChains.slice(0, 3).map(chain => (
              <Badge key={chain} variant="outline" className="text-xs capitalize">
                {chain}
              </Badge>
            ))}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Shield className="h-3 w-3" />
            <span>Security Level: {vault.securityLevel}/5</span>
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <Button asChild variant="outline" className="w-full hover:bg-[#FF5AF7]/10 hover:text-[#FF5AF7]" data-testid={`learn-more-${vault.id}`}>
            <Link href={vault.documentationPath}>
              Learn More
            </Link>
          </Button>
        </CardFooter>
      </Card>
    );
  };

  const renderSkeletons = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(12)].map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <CardHeader>
            <Skeleton className="h-24 w-full bg-gray-800" />
          </CardHeader>
          <CardContent className="pt-4">
            <Skeleton className="h-6 w-3/4 mb-2 bg-gray-800" />
            <Skeleton className="h-4 w-full mb-2 bg-gray-800" />
            <Skeleton className="h-4 w-2/3 bg-gray-800" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-full bg-gray-800" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );

  return (
    <Layout>
      <div className="container mx-auto py-10 px-4 max-w-7xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#FF5AF7] to-[#8F75FF]">
            Vault School Hub
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-4">
            Explore our comprehensive documentation on each vault type to understand their unique capabilities, security features, and use cases.
          </p>
          {catalogData && (
            <div className="flex justify-center gap-4 flex-wrap">
              <Badge className="bg-purple-600 text-white px-4 py-1">
                {catalogData.totalVaults} Vault Types
              </Badge>
              <Badge variant="outline" className="border-purple-500 text-purple-400 px-4 py-1">
                {catalogData.categories.security} Security
              </Badge>
              <Badge variant="outline" className="border-blue-500 text-blue-400 px-4 py-1">
                {catalogData.categories.blockchain} Blockchain
              </Badge>
              <Badge variant="outline" className="border-green-500 text-green-400 px-4 py-1">
                {catalogData.categories.investment} Investment
              </Badge>
              <Badge variant="outline" className="border-amber-500 text-amber-400 px-4 py-1">
                {catalogData.categories.legacy} Legacy
              </Badge>
              <Badge variant="outline" className="border-orange-500 text-orange-400 px-4 py-1">
                {catalogData.categories.premium} Premium
              </Badge>
            </div>
          )}
        </div>

        {isLoading ? (
          renderSkeletons()
        ) : error ? (
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-400">Failed to load vault catalog. Please try again later.</p>
          </div>
        ) : catalogData?.vaultTypes ? (
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid grid-cols-6 w-full mb-8 bg-gray-900/50">
              <TabsTrigger value="all" data-testid="tab-all">All ({catalogData.totalVaults})</TabsTrigger>
              <TabsTrigger value="security" data-testid="tab-security">Security ({catalogData.categories.security})</TabsTrigger>
              <TabsTrigger value="blockchain" data-testid="tab-blockchain">Blockchain ({catalogData.categories.blockchain})</TabsTrigger>
              <TabsTrigger value="investment" data-testid="tab-investment">Investment ({catalogData.categories.investment})</TabsTrigger>
              <TabsTrigger value="legacy" data-testid="tab-legacy">Legacy ({catalogData.categories.legacy})</TabsTrigger>
              <TabsTrigger value="premium" data-testid="tab-premium">Premium ({catalogData.categories.premium})</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {catalogData.vaultTypes.map(vault => renderVaultCard(vault))}
              </div>
            </TabsContent>

            {['security', 'blockchain', 'investment', 'legacy', 'premium'].map(category => (
              <TabsContent key={category} value={category}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {catalogData.vaultTypes
                    .filter(v => v.category === category)
                    .map(vault => renderVaultCard(vault))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        ) : null}
        
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-[#1A1A1A] to-[#111] border border-[#333] rounded-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Trinity Protocol Security</h3>
            <p className="text-gray-400 mb-6">
              All vault types are protected by our 2-of-3 multi-chain consensus mechanism across Arbitrum, Solana, and TON. 
              Mathematical security with attack probability &lt;10⁻¹⁸.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Button asChild className="bg-gradient-to-r from-[#FF5AF7] to-[#8F75FF] hover:opacity-90">
                <Link href="/vault-school">
                  Deep Dive: Vault School
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-[#FF5AF7] text-[#FF5AF7] hover:bg-[#FF5AF7]/10">
                <Link href="/military-grade-security">
                  Security Architecture
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default VaultSchoolHubPage;
