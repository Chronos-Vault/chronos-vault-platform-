import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Shield, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

type ChainStatus = 'active' | 'verifying' | 'failed' | 'inactive';

interface Chain {
  id: string;
  name: string;
  status: ChainStatus;
  color: string;
  role: string;
}

export const MultiChainMetaphor = () => {
  const [chains, setChains] = useState<Chain[]>([
    {
      id: 'ethereum',
      name: 'Ethereum',
      status: 'inactive',
      color: '#627EEA',
      role: 'Primary Vault'
    },
    {
      id: 'solana',
      name: 'Solana',
      status: 'inactive',
      color: '#9945FF',
      role: 'Monitoring'
    },
    {
      id: 'ton',
      name: 'TON',
      status: 'inactive',
      color: '#0098EA',
      role: 'Recovery'
    }
  ]);
  
  const [attackSimulation, setAttackSimulation] = useState<boolean>(false);
  const [isInteractive, setIsInteractive] = useState<boolean>(false);
  const [step, setStep] = useState<number>(0);
  
  // Auto-animate the visualization on first render
  useEffect(() => {
    const activateEthereum = setTimeout(() => {
      updateChainStatus('ethereum', 'active');
      setStep(1);
    }, 1000);
    
    const activateSolana = setTimeout(() => {
      updateChainStatus('solana', 'active');
      setStep(2);
    }, 2000);
    
    const activateTon = setTimeout(() => {
      updateChainStatus('ton', 'active');
      setStep(3);
      setIsInteractive(true);
    }, 3000);
    
    return () => {
      clearTimeout(activateEthereum);
      clearTimeout(activateSolana);
      clearTimeout(activateTon);
    };
  }, []);
  
  // Update a chain's status
  const updateChainStatus = (id: string, status: ChainStatus) => {
    setChains(chains.map(chain => 
      chain.id === id ? { ...chain, status } : chain
    ));
  };
  
  // Handle simulated attack
  const simulateAttack = () => {
    // Start attack sequence
    setAttackSimulation(true);
    
    // Simulate failure of Ethereum chain
    updateChainStatus('ethereum', 'verifying');
    
    setTimeout(() => {
      updateChainStatus('ethereum', 'failed');
      
      // Solana detects the issue
      updateChainStatus('solana', 'verifying');
      
      setTimeout(() => {
        // TON begins recovery
        updateChainStatus('ton', 'verifying');
        
        setTimeout(() => {
          // System recovers
          updateChainStatus('ethereum', 'active');
          updateChainStatus('solana', 'active');
          updateChainStatus('ton', 'active');
          
          // End attack simulation
          setAttackSimulation(false);
        }, 2000);
      }, 1500);
    }, 1500);
  };
  
  // Reset the simulation
  const resetSimulation = () => {
    chains.forEach(chain => {
      updateChainStatus(chain.id, 'inactive');
    });
    
    setStep(0);
    setAttackSimulation(false);
    
    // Restart the animation sequence
    setTimeout(() => {
      updateChainStatus('ethereum', 'active');
      setStep(1);
      
      setTimeout(() => {
        updateChainStatus('solana', 'active');
        setStep(2);
        
        setTimeout(() => {
          updateChainStatus('ton', 'active');
          setStep(3);
        }, 1000);
      }, 1000);
    }, 1000);
  };
  
  // Get status icon for a chain
  const getStatusIcon = (status: ChainStatus) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'verifying':
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Shield className="h-5 w-5 text-amber-500" />
          </motion.div>
        );
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'inactive':
        return <div className="h-5 w-5 rounded-full border border-muted" />;
    }
  };
  
  return (
    <div className="multi-chain-metaphor relative h-64 w-full flex flex-col items-center justify-center">
      {/* Security status indicator */}
      <div className={`security-status mb-6 flex items-center gap-2 px-4 py-2 rounded-full ${
        step === 3 && !attackSimulation
          ? 'bg-green-500/10 text-green-500 border border-green-500/30'
          : attackSimulation
            ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30'
            : 'bg-muted text-muted-foreground'
      }`}>
        {step === 3 && !attackSimulation ? (
          <>
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Triple-Chain Protection Active</span>
          </>
        ) : attackSimulation ? (
          <>
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm font-medium">Security Response In Progress</span>
          </>
        ) : (
          <>
            <Shield className="h-4 w-4" />
            <span className="text-sm font-medium">Initializing Protection ({step}/3)</span>
          </>
        )}
      </div>
      
      {/* Chain network visualization */}
      <div className="chains-container relative w-64 h-52">
        {/* Central asset */}
        <motion.div 
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-xl bg-background border-2 border-primary flex items-center justify-center z-10"
          animate={{ 
            scale: attackSimulation ? [1, 0.95, 1] : 1,
            rotate: attackSimulation ? [-2, 2, -2, 0] : 0
          }}
          transition={{ 
            duration: 0.5, 
            repeat: attackSimulation ? Infinity : 0,
            repeatType: "reverse"
          }}
        >
          <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-[#FF5AF7]">
            Vault
          </span>
        </motion.div>
        
        {/* Chain nodes */}
        {chains.map((chain, index) => {
          // Calculate position on a circle
          const angle = (index * 2 * Math.PI) / chains.length;
          const radius = 80; // Distance from center
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          
          return (
            <div key={chain.id} className="absolute left-1/2 top-1/2" style={{ transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))` }}>
              {/* Chain node */}
              <motion.div 
                className="chain-node w-12 h-12 rounded-full flex items-center justify-center relative"
                style={{ backgroundColor: chain.color }}
                animate={{ 
                  scale: chain.status === 'verifying' ? [1, 1.1, 1] : 1,
                  opacity: chain.status === 'failed' ? 0.6 : 1
                }}
                transition={{ 
                  scale: { 
                    duration: 0.5, 
                    repeat: chain.status === 'verifying' ? Infinity : 0,
                    repeatType: "reverse"
                  }
                }}
              >
                <span className="text-xs font-bold text-white">{chain.name}</span>
                
                {/* Status indicator */}
                <motion.div 
                  className="absolute -top-1 -right-1 bg-white rounded-full p-0.5"
                  initial={{ scale: 0 }}
                  animate={{ scale: chain.status !== 'inactive' ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {getStatusIcon(chain.status)}
                </motion.div>
              </motion.div>
              
              {/* Chain role label */}
              <div className="mt-1 text-center">
                <span className="text-xs text-muted-foreground">{chain.role}</span>
              </div>
              
              {/* Connection line to central asset */}
              <motion.div 
                className="connection-line absolute top-1/2 left-1/2 bg-gradient-to-r from-primary to-[#FF5AF7] h-0.5 origin-left"
                style={{ 
                  width: radius,
                  transform: `rotate(${angle}rad)`,
                  opacity: chain.status === 'active' ? 0.7 : chain.status === 'verifying' ? 0.4 : 0.1
                }}
                animate={{ 
                  opacity: chain.status === 'active' ? [0.5, 0.7, 0.5] : chain.status === 'verifying' ? [0.2, 0.4, 0.2] : 0.1
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  repeatType: "reverse" 
                }}
              />
            </div>
          );
        })}
      </div>
      
      {/* Interactive controls (shown after initial animation) */}
      {isInteractive && (
        <div className="controls mt-4 flex gap-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={simulateAttack}
            disabled={attackSimulation}
            className="text-xs"
          >
            Simulate Attack
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={resetSimulation}
            className="text-xs"
          >
            Reset Demo
          </Button>
        </div>
      )}
    </div>
  );
};