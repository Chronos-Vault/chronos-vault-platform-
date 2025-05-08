import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, ArrowLeft, Users, Globe, Coins, Calendar, Lock, 
  LockKeyhole, Fingerprint, Brain, Sparkles, Clock, 
  BarChart3, Share2, BrainCircuit, ShieldAlert, PanelLeftClose, PanelLeftOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Layout } from '@/components/layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type VaultTypeCardProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  premium?: boolean;
  new?: boolean;
  onClick: () => void;
};

const VaultTypeCard: React.FC<VaultTypeCardProps> = ({ 
  title, 
  description, 
  icon, 
  features, 
  premium = false,
  new: isNew = false,
  onClick 
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.95 }}
    transition={{ duration: 0.2 }}
    whileHover={{ scale: 1.02 }}
  >
    <Card 
      className="border-[#6B00D7]/30 bg-gradient-to-br from-black/40 to-[#6B00D7]/5 hover:from-black/50 hover:to-[#6B00D7]/10 cursor-pointer transition-all duration-300 overflow-hidden h-full"
      onClick={onClick}
    >
      <div className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 bg-[#6B00D7]/10 rounded-full blur-2xl opacity-30"></div>
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="h-10 w-10 rounded-lg bg-[#6B00D7]/20 flex items-center justify-center">
            {icon}
          </div>
          <div className="flex flex-col">
            {title}
            <div className="flex gap-2">
              {premium && (
                <span className="inline-flex items-center mt-1 rounded-md bg-[#FF5AF7]/20 px-2 py-0.5 text-xs font-medium text-[#FF5AF7]">
                  Premium
                </span>
              )}
              {isNew && (
                <span className="inline-flex items-center mt-1 rounded-md bg-green-500/20 px-2 py-0.5 text-xs font-medium text-green-400">
                  New
                </span>
              )}
            </div>
          </div>
        </CardTitle>
        <CardDescription className="text-gray-400">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {features.map((feature, i) => (
            <Badge key={i} variant="outline" className="bg-[#6B00D7]/10 border-[#6B00D7]/30">
              {feature}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full bg-[#6B00D7] hover:bg-[#6B00D7]/80">
          Create {title} Vault
        </Button>
      </CardFooter>
    </Card>
  </motion.div>
);

// Define the categories and their vault types
const vaultCategories = {
  basic: [
    {
      id: 'standard',
      title: "Standard Vault",
      description: "A secure time-locked vault with basic security features and time-based unlocking.",
      icon: <Lock className="h-6 w-6 text-[#6B00D7]" />,
      features: ["Time-Based", "Single Signature", "Basic Security"]
    },
    {
      id: 'timelock',
      title: "Time-Lock Vault",
      description: "Advanced time-based vault with precise unlocking schedules and extended security.",
      icon: <Calendar className="h-6 w-6 text-[#6B00D7]" />,
      features: ["Scheduled Unlock", "Calendar Integration", "Deadline Protection"]
    }
  ],
  advanced: [
    {
      id: 'multisig',
      title: "MultiSig Vault",
      description: "Enhanced security vault requiring multiple authorized signers to approve operations.",
      icon: <Users className="h-6 w-6 text-[#6B00D7]" />,
      features: ["Multi-Signature", "Weighted Approvals", "Enhanced Security"],
      premium: true
    },
    {
      id: 'cross-chain',
      title: "Cross-Chain Vault",
      description: "Advanced vault with security distributed across multiple blockchains for ultimate protection.",
      icon: <Shield className="h-6 w-6 text-[#6B00D7]" />,
      features: ["Triple-Chain Security", "Cross-Chain Validation", "CVT Staking"],
      premium: true
    },
    {
      id: 'biometric',
      title: "Biometric Vault",
      description: "Highest level of personal authentication using biometric verification for access.",
      icon: <Fingerprint className="h-6 w-6 text-[#6B00D7]" />,
      features: ["Biometric Auth", "Personal Identity", "Maximum Security"],
      premium: true
    }
  ],
  specialized: [
    {
      id: 'intent-inheritance',
      title: "AI Intent Vault",
      description: "Revolutionary vault that interprets natural language inheritance instructions using advanced AI.",
      icon: <Brain className="h-6 w-6 text-[#FF5AF7]" />,
      features: ["Natural Language", "Adaptive Inheritance", "AI Verification"],
      premium: true,
      new: true
    },
    {
      id: 'geolocation',
      title: "Geolocation Vault",
      description: "Location-secured vault requiring physical presence in designated safe zones.",
      icon: <Globe className="h-6 w-6 text-[#6B00D7]" />,
      features: ["Location-Based", "Safe Zones", "Physical Security"],
      premium: true
    },
    {
      id: 'halving',
      title: "Bitcoin Halving Vault",
      description: "Special vault that unlocks according to Bitcoin halving events, ideal for long-term HODLers.",
      icon: <Coins className="h-6 w-6 text-[#6B00D7]" />,
      features: ["Halving-Based", "Bitcoin Native", "Long-Term Storage"],
      premium: true
    }
  ]
};

const VaultTypesSelector: React.FC = () => {
  const [, setLocation] = useLocation();
  const [activeCategory, setActiveCategory] = useState<string>('specialized');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const navigateToVaultCreation = (type: string) => {
    setLocation(`/create-vault-enhanced?type=${type}`);
  };
  
  return (
    <Layout>
      <div className="py-10 min-h-screen">
        <div className="container max-w-7xl px-4 mx-auto">
          <div className="flex justify-between items-center mb-6">
            <Button 
              variant="ghost" 
              className="gap-2" 
              onClick={() => setLocation('/my-vaults')}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to My Vaults
            </Button>
            
            <Button
              variant="outline"
              className="md:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
            </Button>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold tracking-tight mb-2 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] bg-clip-text text-transparent">Choose Your Vault Type</h1>
            <p className="text-gray-400 max-w-3xl">
              Chronos Vault offers various specialized vault types to meet your needs. Each vault type comes with different security features and unlocking mechanisms.
            </p>
          </motion.div>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar Categories */}
            <AnimatePresence>
              {sidebarOpen && (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="md:w-64 w-full"
                >
                  <Card className="border-[#6B00D7]/30 bg-gradient-to-br from-[#0A0A0A] to-[#111111]">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-xl">Vault Categories</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button 
                        variant={activeCategory === 'specialized' ? "default" : "outline"}
                        className={`w-full justify-start ${activeCategory === 'specialized' ? 'bg-[#6B00D7]' : 'bg-transparent'}`}
                        onClick={() => setActiveCategory('specialized')}
                      >
                        <BrainCircuit className="mr-2 h-4 w-4" />
                        Specialized Vaults
                        {activeCategory === 'specialized' && (
                          <span className="ml-auto bg-white/20 rounded-full px-2 py-0.5 text-xs">
                            {vaultCategories.specialized.length}
                          </span>
                        )}
                      </Button>
                      
                      <Button 
                        variant={activeCategory === 'advanced' ? "default" : "outline"}
                        className={`w-full justify-start ${activeCategory === 'advanced' ? 'bg-[#6B00D7]' : 'bg-transparent'}`}
                        onClick={() => setActiveCategory('advanced')}
                      >
                        <ShieldAlert className="mr-2 h-4 w-4" />
                        Advanced Security
                        {activeCategory === 'advanced' && (
                          <span className="ml-auto bg-white/20 rounded-full px-2 py-0.5 text-xs">
                            {vaultCategories.advanced.length}
                          </span>
                        )}
                      </Button>
                      
                      <Button 
                        variant={activeCategory === 'basic' ? "default" : "outline"}
                        className={`w-full justify-start ${activeCategory === 'basic' ? 'bg-[#6B00D7]' : 'bg-transparent'}`}
                        onClick={() => setActiveCategory('basic')}
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        Basic Time Vaults
                        {activeCategory === 'basic' && (
                          <span className="ml-auto bg-white/20 rounded-full px-2 py-0.5 text-xs">
                            {vaultCategories.basic.length}
                          </span>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Vault Grid */}
            <motion.div 
              key={activeCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-grow"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {vaultCategories[activeCategory as keyof typeof vaultCategories].map((vault) => (
                  <VaultTypeCard
                    key={vault.id}
                    title={vault.title}
                    description={vault.description}
                    icon={vault.icon}
                    features={vault.features}
                    premium={vault.premium}
                    new={vault.new}
                    onClick={() => navigateToVaultCreation(vault.id)}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default VaultTypesSelector;
