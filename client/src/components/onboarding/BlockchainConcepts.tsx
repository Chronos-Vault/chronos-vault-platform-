import { useState } from 'react';
import { motion } from 'framer-motion';
import { useOnboarding } from '@/contexts/onboarding-context';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Metaphor components import
import { VaultMetaphor } from './metaphors/VaultMetaphor';
import { TimeLockMetaphor } from './metaphors/TimeLockMetaphor';
import { MultiChainMetaphor } from './metaphors/MultiChainMetaphor';

export const BlockchainConcepts = () => {
  const { completeCurrentStep } = useOnboarding();
  const [activeTab, setActiveTab] = useState('vault');
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  return (
    <div className="min-h-screen flex flex-col p-6 bg-background overflow-hidden">
      <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary mb-4">
            Blockchain Technology in Action
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            See how Chronos Vault leverages cutting-edge blockchain technologies to create secure, future-proof digital vaults
          </p>
        </motion.div>
        
        <motion.div
          className="flex-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Tabs
            defaultValue="vault"
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList className="grid grid-cols-3 mb-10">
              <TabsTrigger 
                value="vault"
                className={activeTab === 'vault' ? 'bg-gradient-to-r from-purple-700/20 to-purple-800/20 text-purple-400' : ''}
              >
                Digital Vaults
              </TabsTrigger>
              <TabsTrigger 
                value="timelock"
                className={activeTab === 'timelock' ? 'bg-gradient-to-r from-pink-700/20 to-pink-800/20 text-pink-400' : ''}
              >
                Time-Lock Mechanism
              </TabsTrigger>
              <TabsTrigger 
                value="crosschain"
                className={activeTab === 'crosschain' ? 'bg-gradient-to-r from-blue-700/20 to-blue-800/20 text-blue-400' : ''}
              >
                Triple-Chain Security
              </TabsTrigger>
            </TabsList>
            
            <div className="relative min-h-[400px] md:min-h-[500px] border rounded-lg p-4 overflow-hidden bg-background/50 border-border">
              <TabsContent value="vault" className="mt-0 h-full">
                <VaultMetaphor />
              </TabsContent>
              
              <TabsContent value="timelock" className="mt-0 h-full">
                <TimeLockMetaphor />
              </TabsContent>
              
              <TabsContent value="crosschain" className="mt-0 h-full">
                <MultiChainMetaphor />
              </TabsContent>
            </div>
          </Tabs>
        </motion.div>
        
        <motion.div
          className="mt-10 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Button
            size="lg"
            onClick={completeCurrentStep}
            className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
          >
            Continue <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
};