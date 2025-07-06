import { motion } from 'framer-motion';
import { Lock, Key, Shield } from 'lucide-react';

export const VaultMetaphor = () => {
  return (
    <div className="flex flex-col md:flex-row h-full items-center justify-between gap-6 p-4">
      {/* Visual metaphor */}
      <motion.div 
        className="flex-1 flex justify-center items-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative w-64 h-64 md:w-80 md:h-80">
          {/* Vault door */}
          <motion.div 
            className="absolute inset-0 rounded-xl border-8 border-purple-500/40 bg-gradient-to-br from-purple-900/20 to-purple-700/20 backdrop-blur-sm shadow-lg flex items-center justify-center"
            initial={{ rotateY: 0 }}
            animate={{ 
              rotateY: [0, -60, 0],
              boxShadow: [
                '0 0 0 rgba(168, 85, 247, 0.4)',
                '0 0 30px rgba(168, 85, 247, 0.6)',
                '0 0 0 rgba(168, 85, 247, 0.4)'
              ]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              repeatType: 'reverse', 
              repeatDelay: 1,
              times: [0, 0.5, 1]
            }}
          >
            <Lock className="h-16 w-16 text-purple-400" />
          </motion.div>
          
          {/* Security elements orbiting the vault */}
          <motion.div
            className="absolute w-full h-full"
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <motion.div 
              className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-purple-400/20 p-2 rounded-full"
              whileHover={{ scale: 1.2 }}
            >
              <Shield className="h-8 w-8 text-purple-400" />
            </motion.div>
          </motion.div>
          
          <motion.div
            className="absolute w-full h-full"
            initial={{ rotate: 0 }}
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          >
            <motion.div 
              className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-purple-400/20 p-2 rounded-full"
              whileHover={{ scale: 1.2 }}
            >
              <Key className="h-8 w-8 text-purple-400" />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Description */}
      <motion.div 
        className="flex-1 space-y-4"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600">
          Digital Vaults
        </h3>
        
        <div className="space-y-3 text-muted-foreground">
          <p>
            Chronos Vault creates secure digital vaults using blockchain smart contracts. These vaults are:
          </p>
          
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <div className="h-6 w-6 flex-shrink-0 mt-0.5 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400">
                <span className="text-xs">✓</span>
              </div>
              <span><strong className="text-foreground">Immutable</strong> – Once deployed, the vault's security cannot be compromised</span>
            </li>
            
            <li className="flex items-start gap-2">
              <div className="h-6 w-6 flex-shrink-0 mt-0.5 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400">
                <span className="text-xs">✓</span>
              </div>
              <span><strong className="text-foreground">Cryptographically Secured</strong> – Military-grade encryption protects your assets</span>
            </li>
            
            <li className="flex items-start gap-2">
              <div className="h-6 w-6 flex-shrink-0 mt-0.5 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400">
                <span className="text-xs">✓</span>
              </div>
              <span><strong className="text-foreground">Transparent</strong> – Publicly verifiable but only accessible by authorized keys</span>
            </li>
            
            <li className="flex items-start gap-2">
              <div className="h-6 w-6 flex-shrink-0 mt-0.5 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400">
                <span className="text-xs">✓</span>
              </div>
              <span><strong className="text-foreground">Smart Contract Powered</strong> – Automated execution without third-party involvement</span>
            </li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
};