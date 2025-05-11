import { useState } from 'react';
import { motion } from 'framer-motion';
import { useOnboarding } from '@/contexts/onboarding-context';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check, Clock, Lock, Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export const ConceptIntroduction = () => {
  const { completeCurrentStep } = useOnboarding();
  const [activeCard, setActiveCard] = useState(0);
  
  const concepts = [
    {
      id: 'time-lock',
      title: 'Time-Locked Security',
      description: 'Lock your digital assets until a specific date in the future. Perfect for long-term hodling, inheritance planning, or preventing emotional trading.',
      icon: <Clock className="h-8 w-8 text-pink-400" />,
      color: 'pink'
    },
    {
      id: 'vault',
      title: 'Digital Vaults',
      description: 'Military-grade security for your crypto assets. Our vaults are built on immutable smart contracts that cannot be altered once deployed.',
      icon: <Lock className="h-8 w-8 text-purple-400" />,
      color: 'purple'
    },
    {
      id: 'multi-chain',
      title: 'Triple-Chain Security',
      description: 'We leverage the security of multiple blockchains (TON, Ethereum, and Solana) to create unbreakable vaults with cross-chain verification.',
      icon: <Shield className="h-8 w-8 text-blue-400" />,
      color: 'blue'
    }
  ];
  
  const handleCardClick = (index: number) => {
    setActiveCard(index);
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };
  
  return (
    <div className="min-h-screen flex flex-col justify-between p-6 bg-background">
      <div className="flex-1 flex flex-col items-center justify-center">
        <motion.div
          className="w-full max-w-4xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="mb-10 text-center">
            <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary mb-4">
              Key Concepts
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Explore the core technologies that power the Chronos Vault platform
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={containerVariants}
          >
            {concepts.map((concept, index) => (
              <motion.div key={concept.id} variants={itemVariants}>
                <Card 
                  className={`cursor-pointer transition-all duration-300 h-full border ${
                    activeCard === index 
                      ? `border-${concept.color}-500 shadow-md shadow-${concept.color}-500/10` 
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => handleCardClick(index)}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-full bg-${concept.color}-500/10 flex-shrink-0`}>
                        {concept.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">{concept.title}</h3>
                        <p className="text-muted-foreground text-sm">{concept.description}</p>
                      </div>
                    </div>
                    
                    {activeCard === index && (
                      <div className="mt-4 flex justify-end">
                        <Check className={`h-5 w-5 text-${concept.color}-500`} />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
      
      <motion.div 
        className="mt-10 flex justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
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
  );
};