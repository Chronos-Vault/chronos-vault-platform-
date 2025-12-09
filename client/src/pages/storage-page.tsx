/**
 * Chronos Vault Locked Storage Page
 * 
 * Secure file and asset storage with advanced locking mechanisms
 * powered by Trinity Protocol™ 2-of-3 validator consensus
 */

import { useState } from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Shield, Lock, Network, Clock, Key, Users, Fingerprint, 
  Calendar, ArrowRight, Vault, CheckCircle2, Layers, 
  FileKey, FolderLock, Sparkles, Zap
} from 'lucide-react';
import { motion } from 'framer-motion';

const StoragePage = () => {
  const [selectedVaultType, setSelectedVaultType] = useState<string | null>(null);

  // Locked Storage Vault Types
  const lockedStorageTypes = [
    {
      id: 'time-locked',
      name: 'Time-Locked Storage',
      description: 'Files remain encrypted and inaccessible until a specific date/time. Perfect for scheduled releases, embargoed content, or future reveals.',
      icon: <Clock className="h-8 w-8" />,
      features: ['Set unlock date/time', 'Automatic decryption', 'Trinity Protocol verified'],
      link: '/time-lock-vault',
      gradient: 'from-blue-500 to-cyan-500',
      bgGlow: 'bg-blue-500/20'
    },
    {
      id: 'multi-sig',
      name: 'Multi-Signature Storage',
      description: 'Require multiple wallet signatures to unlock files. Ideal for shared ownership, legal documents, or corporate assets.',
      icon: <Users className="h-8 w-8" />,
      features: ['2-of-3 or custom threshold', 'Cross-chain signers', 'Audit trail'],
      link: '/multi-signature-vault-new',
      gradient: 'from-green-500 to-emerald-500',
      bgGlow: 'bg-green-500/20'
    },
    {
      id: 'biometric',
      name: 'Biometric-Locked Storage',
      description: 'Secure files with biometric verification. Only you can access with fingerprint or face recognition.',
      icon: <Fingerprint className="h-8 w-8" />,
      features: ['Fingerprint/FaceID', 'Device-bound keys', 'Zero-knowledge proof'],
      link: '/biometric-vault',
      gradient: 'from-pink-500 to-rose-500',
      bgGlow: 'bg-pink-500/20'
    },
    {
      id: 'condition-based',
      name: 'Smart Contract Storage',
      description: 'Files unlock when specific on-chain conditions are met. Link access to smart contract events or oracle data.',
      icon: <Key className="h-8 w-8" />,
      features: ['Smart contract triggers', 'Oracle integration', 'Automatic execution'],
      link: '/smart-contract-vault',
      gradient: 'from-amber-500 to-orange-500',
      bgGlow: 'bg-amber-500/20'
    },
    {
      id: 'inheritance',
      name: 'Inheritance Vault',
      description: 'Securely pass digital assets to beneficiaries. Includes dead-man switch and proof-of-life protocols.',
      icon: <Calendar className="h-8 w-8" />,
      features: ['Beneficiary management', 'Inactivity triggers', 'Legal compliance'],
      link: '/intent-inheritance-vault',
      gradient: 'from-purple-500 to-violet-500',
      bgGlow: 'bg-purple-500/20'
    },
    {
      id: 'cross-chain',
      name: 'Cross-Chain Fragment',
      description: 'Split files across multiple blockchains. Reconstruct only with keys from all chains - ultimate security.',
      icon: <Network className="h-8 w-8" />,
      features: ['Arbitrum + Solana + TON', 'Shamir secret sharing', 'Geographic distribution'],
      link: '/cross-chain-fragment-vault',
      gradient: 'from-cyan-500 to-teal-500',
      bgGlow: 'bg-cyan-500/20'
    }
  ];

  // Security features
  const securityFeatures = [
    {
      icon: <Shield className="h-6 w-6 text-[#FF5AF7]" />,
      title: 'Quantum-Resistant',
      description: 'ML-KEM-1024 encryption'
    },
    {
      icon: <Layers className="h-6 w-6 text-[#FF5AF7]" />,
      title: '2-of-3 Consensus',
      description: 'Trinity validator approval'
    },
    {
      icon: <Lock className="h-6 w-6 text-[#FF5AF7]" />,
      title: 'Zero-Knowledge',
      description: 'Privacy-preserving proofs'
    },
    {
      icon: <Zap className="h-6 w-6 text-[#FF5AF7]" />,
      title: 'Instant Unlock',
      description: 'When conditions are met'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#6B00D7]/10 via-black to-black" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#6B00D7]/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-[#FF5AF7]/15 rounded-full blur-[100px]" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Status Badge */}
            <motion.div 
              className="inline-flex items-center gap-2 bg-black/50 border border-[#6B00D7]/30 rounded-full px-5 py-2 mb-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="h-2 w-2 rounded-full bg-[#FF5AF7] animate-pulse" />
              <span className="text-sm text-gray-300">Secured by <span className="text-[#FF5AF7] font-medium">Trinity Protocol™</span></span>
            </motion.div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-[#FF5AF7] to-white">
                Locked Storage Vaults
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Secure your files, documents, and digital assets with advanced locking mechanisms.
              Only accessible when your conditions are met — verified by 2-of-3 validator consensus.
            </p>
            
            {/* Security Features Row */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {securityFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="flex items-center gap-3 bg-black/60 border border-[#6B00D7]/20 rounded-full px-5 py-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                >
                  {feature.icon}
                  <div className="text-left">
                    <div className="text-sm font-medium text-white">{feature.title}</div>
                    <div className="text-xs text-gray-400">{feature.description}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Vault Types Grid */}
      <section className="py-16 bg-gradient-to-b from-black via-[#0a0014] to-black">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Choose Your <span className="text-[#FF5AF7]">Lock Type</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Select the security mechanism that fits your needs. All vaults feature military-grade encryption and cross-chain verification.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {lockedStorageTypes.map((vault, index) => (
              <motion.div
                key={vault.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <Link href={vault.link}>
                  <Card 
                    className="group h-full bg-black/60 border-[#6B00D7]/20 hover:border-[#FF5AF7]/50 transition-all duration-300 cursor-pointer hover:shadow-[0_0_40px_rgba(255,90,247,0.2)] overflow-hidden"
                    data-testid={`card-storage-${vault.id}`}
                    onMouseEnter={() => setSelectedVaultType(vault.id)}
                    onMouseLeave={() => setSelectedVaultType(null)}
                  >
                    {/* Glow effect on hover */}
                    <div className={`absolute inset-0 ${vault.bgGlow} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl`} />
                    
                    <CardHeader className="relative pb-3">
                      <div className="flex items-start justify-between">
                        <div className={`p-4 rounded-2xl bg-gradient-to-br ${vault.gradient} text-white group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                          {vault.icon}
                        </div>
                        <Badge className="bg-[#6B00D7]/20 text-[#FF5AF7] border-[#6B00D7]/30 hover:bg-[#6B00D7]/30">
                          <FolderLock className="w-3 h-3 mr-1" />
                          Locked
                        </Badge>
                      </div>
                      <CardTitle className="text-xl mt-5 text-white group-hover:text-[#FF5AF7] transition-colors">
                        {vault.name}
                      </CardTitle>
                      <CardDescription className="text-gray-400 text-sm leading-relaxed">
                        {vault.description}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="relative">
                      <div className="space-y-2 mb-4">
                        {vault.features.map((feature, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                            <CheckCircle2 className="w-4 h-4 text-[#FF5AF7] flex-shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-[#6B00D7]/20">
                        <span className="text-xs text-gray-500">Trinity Verified</span>
                        <div className="flex items-center gap-1 text-[#FF5AF7] opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-sm font-medium">Create Vault</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How <span className="text-[#FF5AF7]">Locked Storage</span> Works
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Your files are protected by smart contracts and validated by our cross-chain consensus network
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { step: '1', title: 'Upload & Encrypt', desc: 'Files are encrypted with quantum-resistant algorithms', icon: <FileKey className="h-8 w-8" /> },
              { step: '2', title: 'Set Lock Conditions', desc: 'Define time, signatures, or smart contract triggers', icon: <Lock className="h-8 w-8" /> },
              { step: '3', title: 'Validator Consensus', desc: '2-of-3 validators verify and secure your vault', icon: <Shield className="h-8 w-8" /> },
              { step: '4', title: 'Automatic Unlock', desc: 'Access granted when conditions are verified', icon: <Sparkles className="h-8 w-8" /> }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                className="relative text-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                {/* Connector line */}
                {index < 3 && (
                  <div className="hidden md:block absolute top-12 left-1/2 w-full h-[2px] bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]/30" />
                )}
                
                <div className="relative z-10 bg-black">
                  <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-[#6B00D7]/30 to-[#FF5AF7]/10 border border-[#6B00D7]/30 flex items-center justify-center mb-4 group hover:border-[#FF5AF7]/50 transition-colors">
                    <div className="text-[#FF5AF7]">
                      {item.icon}
                    </div>
                  </div>
                  <div className="text-xs text-[#FF5AF7] font-bold mb-2">STEP {item.step}</div>
                  <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-400">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-black via-[#6B00D7]/10 to-black">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl font-bold mb-6">
              Ready to <span className="text-[#FF5AF7]">Secure Your Assets</span>?
            </h2>
            <p className="text-gray-300 text-lg mb-10">
              Create your first locked storage vault and experience military-grade security with cross-chain verification.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/vault-types">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#7B10E7] hover:to-[#FF6AF7] text-white px-10 py-6 text-lg shadow-lg shadow-[#6B00D7]/40 hover:shadow-[#FF5AF7]/40 transition-all"
                  data-testid="button-explore-vaults"
                >
                  <Vault className="w-5 h-5 mr-2" />
                  Explore All Vaults
                </Button>
              </Link>
              <Link href="/gift-crypto">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-[#6B00D7]/50 text-white hover:bg-[#6B00D7]/20 px-10 py-6 text-lg"
                  data-testid="button-gift-crypto"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Gift Crypto
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default StoragePage;
