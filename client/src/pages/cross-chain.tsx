import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import CrossChainTransfer from '@/components/cross-chain/CrossChainTransfer';
import SecurityDashboard from '@/components/cross-chain/SecurityDashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeftRight, Shield, Users, Database } from 'lucide-react';
import { useAuthContext } from '@/contexts/auth-context';
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

const CrossChainPage: React.FC = () => {
  const { isAuthenticated } = useAuthContext();
  const [activeTab, setActiveTab] = useState('transfer');

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#121212] to-[#1A1A1A] text-white">
      <Header />
      <main className="flex-1 pb-20">
        <Helmet>
          <title>Cross-Chain Operations | Chronos Vault</title>
          <meta name="description" content="Secure cross-chain asset transfers and operations with Chronos Vault" />
        </Helmet>
        
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8 text-center">
              <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]">
                Cross-Chain Operations
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Securely transfer assets across multiple blockchains with industry-leading security and efficiency
              </p>
            </div>
            
            <Tabs
              defaultValue="transfer"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-3 mb-8">
                <TabsTrigger value="transfer" className="py-3">
                  <ArrowLeftRight className="mr-2 h-5 w-5" />
                  Transfer Assets
                </TabsTrigger>
                <TabsTrigger value="security" className="py-3">
                  <Shield className="mr-2 h-5 w-5" />
                  Security Dashboard
                </TabsTrigger>
                <TabsTrigger value="advanced" className="py-3">
                  <Database className="mr-2 h-5 w-5" />
                  Advanced Operations
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="transfer" className="p-1">
                <CrossChainTransfer />
              </TabsContent>
              
              <TabsContent value="security" className="p-1">
                <SecurityDashboard address={isAuthenticated ? "current-user-address" : undefined} />
              </TabsContent>
              
              <TabsContent value="advanced" className="p-1">
                <div className="bg-gray-800/50 rounded-xl p-8 text-center">
                  <Users className="h-16 w-16 mx-auto mb-4 text-purple-400" />
                  <h3 className="text-2xl font-bold mb-2">Multi-Signature Operations</h3>
                  <p className="text-gray-400 mb-6">
                    Set up multi-signature wallets, approve transactions, and manage advanced security settings
                  </p>
                  
                  <div className="max-w-md mx-auto p-6 bg-gray-900/50 rounded-lg border border-purple-900/30">
                    <p className="text-amber-400 mb-4">
                      Advanced operations require connecting your wallet
                    </p>
                    
                    <button className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] text-white rounded-lg px-6 py-3">
                      Connect Wallet
                    </button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CrossChainPage;