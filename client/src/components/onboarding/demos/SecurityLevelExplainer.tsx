import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, User, Users, Clock, Lock, Key, Network } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface SecurityLevel {
  id: number;
  name: string;
  description: string;
  features: string[];
  icon: JSX.Element;
  color: string;
  strength: number;
}

export const SecurityLevelExplainer = ({ onInteract }: { onInteract: () => void }) => {
  const [securityLevel, setSecurityLevel] = useState(1);
  const [hasInteracted, setHasInteracted] = useState(false);
  
  const handleInteraction = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
      onInteract();
    }
  };
  
  const securityLevels: SecurityLevel[] = [
    {
      id: 1,
      name: "Basic Protection",
      description: "Standard time-lock security for personal assets",
      features: [
        "Time-lock mechanism",
        "Single-chain verification",
        "Basic encryption"
      ],
      icon: <Clock className="h-8 w-8" />,
      color: "bg-blue-500",
      strength: 33
    },
    {
      id: 2,
      name: "Enhanced Security",
      description: "Advanced protection with access controls",
      features: [
        "Time-lock mechanism",
        "Dual-chain verification",
        "Access key requirement",
        "Authorized retrievers"
      ],
      icon: <Key className="h-8 w-8" />,
      color: "bg-purple-500",
      strength: 66
    },
    {
      id: 3,
      name: "Maximum Protection",
      description: "Military-grade security for high-value assets",
      features: [
        "Time-lock mechanism",
        "Triple-chain verification",
        "Multi-signature requirement",
        "Quantum-resistant encryption",
        "Zero-knowledge privacy"
      ],
      icon: <Shield className="h-8 w-8" />,
      color: "bg-[#FF5AF7]",
      strength: 100
    }
  ];
  
  const currentLevel = securityLevels[securityLevel - 1];

  return (
    <div className="security-level-explainer p-4">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/3">
          <h3 className="text-lg font-bold mb-4">Security Level</h3>
          <div className="mb-6">
            <Slider
              value={[securityLevel]}
              min={1}
              max={3}
              step={1}
              onValueChange={(values) => {
                setSecurityLevel(values[0]);
                handleInteraction();
              }}
            />
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>Basic</span>
              <span>Enhanced</span>
              <span>Maximum</span>
            </div>
          </div>
          
          <div className={`p-4 rounded-lg ${currentLevel.color} bg-opacity-10 border border-${currentLevel.color} border-opacity-30 mb-4`}>
            <div className="flex items-center mb-3">
              <div className={`w-12 h-12 rounded-full ${currentLevel.color} text-white flex items-center justify-center mr-3`}>
                {currentLevel.icon}
              </div>
              <div>
                <h3 className="font-bold">{currentLevel.name}</h3>
                <p className="text-sm text-muted-foreground">{currentLevel.description}</p>
              </div>
            </div>
            
            <div className="mt-3">
              <div className="w-full bg-muted rounded-full h-3 mb-2">
                <div
                  className={`h-3 rounded-full ${currentLevel.color}`}
                  style={{ width: `${currentLevel.strength}%` }}
                />
              </div>
              <div className="text-right text-xs font-medium">
                {currentLevel.strength}% Protection
              </div>
            </div>
          </div>
          
          <Button 
            onClick={handleInteraction}
            className="w-full"
            variant={securityLevel === 3 ? "default" : "outline"}
          >
            Select This Level
          </Button>
        </div>
        
        <div className="w-full md:w-2/3">
          <h3 className="text-lg font-bold mb-4">Security Features</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <motion.div
              key={`feature-timelock-${securityLevel}`}
              className="p-4 bg-muted/50 rounded-lg flex items-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Clock className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
              <div>
                <h4 className="font-medium">Time-Lock Mechanism</h4>
                <p className="text-sm text-muted-foreground">
                  Assets are locked until a predetermined future date
                </p>
              </div>
            </motion.div>
            
            <motion.div
              key={`feature-chain-${securityLevel}`}
              className="p-4 bg-muted/50 rounded-lg flex items-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Network className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
              <div>
                <h4 className="font-medium">
                  {securityLevel === 1 ? "Single-Chain Verification" : 
                   securityLevel === 2 ? "Dual-Chain Verification" : 
                   "Triple-Chain Verification"}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {securityLevel === 1 ? "Security validated on a single blockchain" : 
                   securityLevel === 2 ? "Security validated across two blockchains" : 
                   "Maximum security with verification across three blockchains"}
                </p>
              </div>
            </motion.div>
            
            {(securityLevel >= 2) && (
              <motion.div
                key={`feature-access-${securityLevel}`}
                className="p-4 bg-muted/50 rounded-lg flex items-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Key className="h-5 w-5 text-amber-500 mr-3 mt-0.5" />
                <div>
                  <h4 className="font-medium">Access Key Requirement</h4>
                  <p className="text-sm text-muted-foreground">
                    Secondary cryptographic key required for vault access
                  </p>
                </div>
              </motion.div>
            )}
            
            {(securityLevel >= 2) && (
              <motion.div
                key={`feature-retrievers-${securityLevel}`}
                className="p-4 bg-muted/50 rounded-lg flex items-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <Users className="h-5 w-5 text-blue-400 mr-3 mt-0.5" />
                <div>
                  <h4 className="font-medium">Authorized Retrievers</h4>
                  <p className="text-sm text-muted-foreground">
                    Specify approved addresses that can access the vault
                  </p>
                </div>
              </motion.div>
            )}
            
            {(securityLevel >= 3) && (
              <motion.div
                key={`feature-multisig-${securityLevel}`}
                className="p-4 bg-muted/50 rounded-lg flex items-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <Users className="h-5 w-5 text-purple-500 mr-3 mt-0.5" />
                <div>
                  <h4 className="font-medium">Multi-Signature Requirement</h4>
                  <p className="text-sm text-muted-foreground">
                    Multiple authorized signatures required to access vault
                  </p>
                </div>
              </motion.div>
            )}
            
            {(securityLevel >= 3) && (
              <motion.div
                key={`feature-quantum-${securityLevel}`}
                className="p-4 bg-muted/50 rounded-lg flex items-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
              >
                <Shield className="h-5 w-5 text-[#FF5AF7] mr-3 mt-0.5" />
                <div>
                  <h4 className="font-medium">Quantum-Resistant Encryption</h4>
                  <p className="text-sm text-muted-foreground">
                    Protection against future quantum computing attacks
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};