import React from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft, Users, Globe, Coins, Calendar, Lock, LockKeyhole, Fingerprint, Brain, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Layout } from '@/components/layout';

type VaultTypeCardProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  premium?: boolean;
  onClick: () => void;
};

const VaultTypeCard: React.FC<VaultTypeCardProps> = ({ 
  title, 
  description, 
  icon, 
  features, 
  premium = false, 
  onClick 
}) => (
  <Card 
    className="border-[#6B00D7]/30 bg-gradient-to-br from-black/40 to-[#6B00D7]/5 hover:from-black/50 hover:to-[#6B00D7]/10 cursor-pointer transition-all duration-300 overflow-hidden"
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
          {premium && (
            <span className="inline-flex items-center mt-1 rounded-md bg-[#FF5AF7]/20 px-2 py-0.5 text-xs font-medium text-[#FF5AF7]">
              Premium Features
            </span>
          )}
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
);

const VaultTypesSelector: React.FC = () => {
  const [, setLocation] = useLocation();
  
  const navigateToVaultCreation = (type: string) => {
    setLocation(`/create-vault-enhanced?type=${type}`);
  };
  
  return (
    <Layout>
      <div className="container max-w-7xl py-10">
        <div className="flex justify-between items-center mb-6">
          <Button 
            variant="ghost" 
            className="gap-2" 
            onClick={() => setLocation('/my-vaults')}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to My Vaults
          </Button>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold tracking-tight mb-4">Choose Your Vault Type</h1>
          <p className="text-gray-400 max-w-3xl">
            Chronos Vault offers various specialized vault types to meet your needs. Each vault type comes with different security features and unlocking mechanisms.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Standard Vault */}
          <VaultTypeCard
            title="Standard Vault"
            description="A secure time-locked vault with basic security features and time-based unlocking."
            icon={<Lock className="h-6 w-6 text-[#6B00D7]" />}
            features={["Time-Based", "Single Signature", "Basic Security"]}
            onClick={() => navigateToVaultCreation('standard')}
          />
          
          {/* MultiSig Vault */}
          <VaultTypeCard
            title="MultiSig Vault"
            description="Enhanced security vault requiring multiple authorized signers to approve operations."
            icon={<Users className="h-6 w-6 text-[#6B00D7]" />}
            features={["Multi-Signature", "Weighted Approvals", "Enhanced Security"]}
            premium
            onClick={() => navigateToVaultCreation('multisig')}
          />
          
          {/* Geolocation Vault */}
          <VaultTypeCard
            title="Geolocation Vault"
            description="Location-secured vault requiring physical presence in designated safe zones."
            icon={<Globe className="h-6 w-6 text-[#6B00D7]" />}
            features={["Location-Based", "Safe Zones", "Physical Security"]}
            premium
            onClick={() => navigateToVaultCreation('geolocation')}
          />
          
          {/* Time-Lock Vault */}
          <VaultTypeCard
            title="Time-Lock Vault"
            description="Advanced time-based vault with precise unlocking schedules and extended security."
            icon={<Calendar className="h-6 w-6 text-[#6B00D7]" />}
            features={["Scheduled Unlock", "Calendar Integration", "Deadline Protection"]}
            onClick={() => navigateToVaultCreation('timelock')}
          />
          
          {/* Biometric Vault */}
          <VaultTypeCard
            title="Biometric Vault"
            description="Highest level of personal authentication using biometric verification for access."
            icon={<Fingerprint className="h-6 w-6 text-[#6B00D7]" />}
            features={["Biometric Auth", "Personal Identity", "Maximum Security"]}
            premium
            onClick={() => navigateToVaultCreation('biometric')}
          />
          
          {/* Cross-Chain Vault */}
          <VaultTypeCard
            title="Cross-Chain Vault"
            description="Advanced vault with security distributed across multiple blockchains for ultimate protection."
            icon={<Shield className="h-6 w-6 text-[#6B00D7]" />}
            features={["Triple-Chain Security", "Cross-Chain Validation", "CVT Staking"]}
            premium
            onClick={() => navigateToVaultCreation('cross-chain')}
          />
          
          {/* AI-Powered Intent-Based Inheritance Vault */}
          <VaultTypeCard
            title="AI Intent Vault"
            description="Revolutionary vault that interprets natural language inheritance instructions using advanced AI."
            icon={<Brain className="h-6 w-6 text-[#FF5AF7]" />}
            features={["Natural Language", "Adaptive Inheritance", "AI Verification"]}
            premium
            onClick={() => navigateToVaultCreation('intent-inheritance')}
          />
        </div>
      </div>
    </Layout>
  );
};

export default VaultTypesSelector;
