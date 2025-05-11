import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Unlock, Fingerprint, Key, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

export const VaultMetaphor = () => {
  const [securityLevel, setSecurityLevel] = useState(1);
  const [isLocked, setIsLocked] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isInteractive, setIsInteractive] = useState(false);
  const [showBreachAnimation, setShowBreachAnimation] = useState(false);
  
  // Auto-animate the vault after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(true);
      
      setTimeout(() => {
        setIsLocked(false);
        
        setTimeout(() => {
          setIsLocked(true);
          
          setTimeout(() => {
            setIsAnimating(false);
            setIsInteractive(true);
          }, 1000);
        }, 2000);
      }, 2000);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Attempt to breach security
  const attemptBreach = () => {
    setShowBreachAnimation(true);
    
    // Show breach attempt for 3 seconds then reset
    setTimeout(() => {
      setShowBreachAnimation(false);
    }, 3000);
  };
  
  // Toggle vault lock state
  const toggleLock = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setIsLocked(!isLocked);
      
      setTimeout(() => {
        setIsAnimating(false);
      }, 1000);
    }
  };
  
  // Define security features based on level
  const getSecurityFeatures = () => {
    const baseFeatures = ['Encryption'];
    
    if (securityLevel >= 2) {
      baseFeatures.push('Multi-Chain');
    }
    
    if (securityLevel >= 3) {
      baseFeatures.push('Zero-Knowledge Proofs');
    }
    
    if (securityLevel >= 4) {
      baseFeatures.push('Quantum Resistance');
      baseFeatures.push('Multi-Signature');
    }
    
    return baseFeatures;
  };
  
  // Generate security layers visualization
  const renderSecurityLayers = () => {
    const layers = [];
    const colors = [
      'rgba(107, 0, 215, 0.2)',  // Primary color with transparency
      'rgba(255, 90, 247, 0.2)',  // Secondary color with transparency
      'rgba(107, 0, 215, 0.3)',
      'rgba(255, 90, 247, 0.3)'
    ];
    
    for (let i = 0; i < securityLevel; i++) {
      layers.push(
        <motion.div
          key={i}
          className="absolute rounded-xl border"
          style={{
            width: `calc(100% + ${(i + 1) * 10}px)`,
            height: `calc(100% + ${(i + 1) * 10}px)`,
            top: `calc(50% - (100% + ${(i + 1) * 10}px)/2)`,
            left: `calc(50% - (100% + ${(i + 1) * 10}px)/2)`,
            backgroundColor: colors[i],
            borderColor: i % 2 === 0 ? 'rgba(107, 0, 215, 0.3)' : 'rgba(255, 90, 247, 0.3)',
            zIndex: -1 - i
          }}
          animate={{ 
            rotate: showBreachAnimation ? [0, 5, -5, 0] : 0,
            scale: showBreachAnimation ? [1, 1.05, 0.95, 1] : 1
          }}
          transition={{ 
            duration: 0.5, 
            repeat: showBreachAnimation ? 3 : 0, 
            repeatType: "reverse" 
          }}
        />
      );
    }
    
    return layers;
  };
  
  return (
    <div className="vault-metaphor w-full h-64 flex flex-col items-center justify-center relative">
      {/* Security breach indicator */}
      {showBreachAnimation && (
        <motion.div
          className="absolute top-0 left-0 right-0 bg-red-500 text-white text-center text-xs py-1 z-20"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <div className="flex items-center justify-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            <span>Breach Attempt Detected</span>
            <AlertTriangle className="h-3 w-3" />
          </div>
        </motion.div>
      )}
      
      {/* Vault representation */}
      <div className="vault-container relative mb-6">
        {/* Security layers */}
        {renderSecurityLayers()}
        
        {/* Main vault */}
        <motion.div 
          className={`w-24 h-24 rounded-xl border-2 ${isLocked ? 'border-primary' : 'border-[#FF5AF7]'} bg-card shadow-lg flex items-center justify-center relative`}
          animate={{ 
            scale: isAnimating ? (isLocked ? [1, 0.9, 1] : [1, 1.1, 1]) : 1,
            rotate: showBreachAnimation ? [0, -3, 3, 0] : 0
          }}
          transition={{ 
            scale: { duration: 0.5 },
            rotate: { duration: 0.3, repeat: showBreachAnimation ? 3 : 0 }
          }}
        >
          <div className="flex flex-col items-center">
            <motion.div
              animate={{
                rotateY: isLocked ? 0 : 180
              }}
              transition={{ duration: 0.5 }}
              className="mb-2"
            >
              {isLocked ? <Lock className="h-8 w-8 text-primary" /> : <Unlock className="h-8 w-8 text-[#FF5AF7]" />}
            </motion.div>
            <span className="text-xs font-medium">{isLocked ? 'Secured' : 'Accessible'}</span>
          </div>
          
          {/* Small icons representing assets in the vault */}
          <motion.div 
            className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center"
            animate={{ 
              scale: isAnimating ? [1, 1.2, 1] : 1
            }}
            transition={{ duration: 0.5 }}
          >
            <Shield className="h-3 w-3 text-white" />
          </motion.div>
        </motion.div>
      </div>
      
      {/* Security level indicator */}
      {isInteractive && (
        <div className="security-level-container max-w-xs w-full px-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-semibold">Security Level: {securityLevel}</h3>
            <div className="flex gap-1">
              {Array.from({length: 4}).map((_, i) => (
                <div 
                  key={i} 
                  className={`w-2 h-2 rounded-full ${i < securityLevel ? 'bg-primary' : 'bg-muted'}`}
                />
              ))}
            </div>
          </div>
          
          <Slider
            value={[securityLevel]}
            min={1}
            max={4}
            step={1}
            onValueChange={(values) => setSecurityLevel(values[0])}
          />
          
          <div className="mt-4">
            <div className="flex gap-2 flex-wrap">
              {getSecurityFeatures().map((feature, index) => (
                <div 
                  key={index}
                  className="text-xs px-2 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary"
                >
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Interactive controls */}
      {isInteractive && (
        <div className="controls mt-4 flex space-x-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={toggleLock}
            className="text-xs"
            disabled={isAnimating}
          >
            {isLocked ? <Unlock className="h-3 w-3 mr-1" /> : <Lock className="h-3 w-3 mr-1" />}
            {isLocked ? 'Unlock Vault' : 'Lock Vault'}
          </Button>
          
          <Button 
            variant="destructive" 
            size="sm"
            onClick={attemptBreach}
            className="text-xs"
            disabled={showBreachAnimation}
          >
            <Fingerprint className="h-3 w-3 mr-1" />
            Test Security
          </Button>
        </div>
      )}
    </div>
  );
};