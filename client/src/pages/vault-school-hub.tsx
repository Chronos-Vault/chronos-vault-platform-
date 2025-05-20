import React from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';
import { Shield, Lock, Users, GitBranch, Clock, Globe, FileImage, Brain, Heart, Target, Milestone, Zap, Key, Gift, FileText, Navigation } from 'lucide-react';

const VaultSchoolHubPage: React.FC = () => {
  const vaultTypes = [
    {
      id: 'multi-signature-vault',
      title: 'Multi-Signature Vault',
      description: 'Enhanced security requiring multiple approvals for asset access',
      icon: <Users className="h-10 w-10 text-purple-500" />,
      color: 'from-purple-600 to-pink-600'
    },
    {
      id: 'bitcoin-halving-vault',
      title: 'Bitcoin Halving Vault',
      description: 'Timed releases aligned with Bitcoin halving events',
      icon: <Shield className="h-10 w-10 text-orange-500" />,
      color: 'from-orange-500 to-yellow-500'
    },
    {
      id: 'time-locked-memory-vault',
      title: 'Time-Locked Memory Vault',
      description: 'Secure digital legacy with timed multimedia releases',
      icon: <Clock className="h-10 w-10 text-blue-500" />,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'quantum-resistant-vault',
      title: 'Quantum-Resistant Vault',
      description: 'Future-proof security against quantum computing threats',
      icon: <Shield className="h-10 w-10 text-emerald-500" />,
      color: 'from-emerald-600 to-green-500'
    },
    {
      id: 'cross-chain-fragment-vault',
      title: 'Cross-Chain Fragment Vault',
      description: 'Distributed security across multiple blockchains',
      icon: <GitBranch className="h-10 w-10 text-indigo-500" />,
      color: 'from-indigo-600 to-blue-600'
    },
    {
      id: 'geo-location-vault',
      title: 'Geo-Location Vault',
      description: 'Location-based security for physical presence authentication',
      icon: <Globe className="h-10 w-10 text-emerald-500" />,
      color: 'from-emerald-500 to-teal-500'
    },
    {
      id: 'nft-powered-vault',
      title: 'NFT-Powered Vault',
      description: 'Digital asset security tied to NFT ownership',
      icon: <FileImage className="h-10 w-10 text-fuchsia-500" />,
      color: 'from-fuchsia-500 to-purple-500'
    },
    {
      id: 'ai-assisted-investment-vault',
      title: 'AI-Assisted Investment Vault',
      description: 'Intelligent investment optimization with AI',
      icon: <Brain className="h-10 w-10 text-violet-500" />,
      color: 'from-violet-600 to-purple-500'
    },
    {
      id: 'family-heritage-vault',
      title: 'Family Heritage Vault',
      description: 'Generational wealth transfer with multi-level access',
      icon: <Heart className="h-10 w-10 text-red-500" />,
      color: 'from-red-500 to-pink-500'
    },
    {
      id: 'investment-discipline-vault',
      title: 'Investment Discipline Vault',
      description: 'Structured investment strategies with time-based controls',
      icon: <Target className="h-10 w-10 text-sky-500" />,
      color: 'from-sky-500 to-blue-500'
    },
    {
      id: 'milestone-based-vault',
      title: 'Milestone-Based Vault',
      description: 'Conditional releases based on achievements or events',
      icon: <Milestone className="h-10 w-10 text-amber-500" />,
      color: 'from-amber-500 to-orange-500'
    },
    {
      id: 'sovereign-fortress-vault',
      title: 'Sovereign Fortress Vault™',
      description: 'Ultimate all-in-one vault with supreme security flexibility',
      icon: <Shield className="h-10 w-10 text-slate-700" />,
      color: 'from-slate-700 to-gray-900'
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto py-10 px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#FF5AF7] to-[#8F75FF]">
            Vault School Hub
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore our comprehensive documentation on each vault type to understand their unique capabilities, security features, and use cases.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vaultTypes.map((vault) => (
            <Card key={vault.id} className="overflow-hidden border border-transparent hover:border-[#FF5AF7]/20 transition-all duration-300 hover:shadow-lg hover:shadow-[#FF5AF7]/5">
              <CardHeader className={`bg-gradient-to-r ${vault.color}`}>
                <div className="flex justify-center items-center h-28">
                  {vault.icon}
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <CardTitle className="text-xl mb-2">{vault.title}</CardTitle>
                <CardDescription className="text-base">{vault.description}</CardDescription>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full hover:bg-[#FF5AF7]/10 hover:text-[#FF5AF7]">
                  <Link href={`/documentation/${vault.id}`}>
                    Learn More
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <Button asChild className="bg-gradient-to-r from-[#FF5AF7] to-[#8F75FF] hover:opacity-90">
            <Link href="/vault-types">
              Explore Vault Types
            </Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default VaultSchoolHubPage;