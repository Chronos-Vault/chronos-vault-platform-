/**
 * Smart Contract Vault Page
 * 
 * Programmable vault with condition-based unlocking
 * powered by Trinity Protocol™ 2-of-3 validator consensus
 */

import { useState } from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Shield, Lock, Code, Key, Zap, ArrowRight, CheckCircle2, 
  Layers, FileCode, Settings, Clock, AlertTriangle, 
  Wallet, RefreshCcw, Eye, Terminal, Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';

export default function SmartContractVault() {
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);

  // Vault features
  const features = [
    {
      id: 'programmable',
      icon: <Code className="h-7 w-7" />,
      title: 'Programmable Conditions',
      description: 'Define custom unlock conditions using smart contract logic. Trigger vault access based on on-chain events, oracle data, or time-based rules.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'multi-trigger',
      icon: <Zap className="h-7 w-7" />,
      title: 'Multi-Trigger Support',
      description: 'Combine multiple conditions with AND/OR logic. Create complex unlock scenarios that require multiple events to occur.',
      gradient: 'from-amber-500 to-orange-500'
    },
    {
      id: 'oracle',
      icon: <RefreshCcw className="h-7 w-7" />,
      title: 'Oracle Integration',
      description: 'Connect to external data feeds for price-based, weather-based, or any real-world condition triggers.',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      id: 'erc4626',
      icon: <FileCode className="h-7 w-7" />,
      title: 'ERC-4626 Compliant',
      description: 'Fully compatible with the tokenized vault standard for seamless DeFi integration and composability.',
      gradient: 'from-purple-500 to-violet-500'
    },
    {
      id: 'audit-trail',
      icon: <Eye className="h-7 w-7" />,
      title: 'Complete Audit Trail',
      description: 'Every condition check and state change is recorded on-chain for full transparency and compliance.',
      gradient: 'from-pink-500 to-rose-500'
    },
    {
      id: 'emergency',
      icon: <AlertTriangle className="h-7 w-7" />,
      title: 'Emergency Recovery',
      description: 'Built-in emergency recovery with multi-sig override. Never lose access to your assets.',
      gradient: 'from-red-500 to-orange-500'
    }
  ];

  // Use cases
  const useCases = [
    {
      title: 'DeFi Yield Vaults',
      description: 'Automatically compound yields when certain APY thresholds are met',
      icon: <Wallet className="h-6 w-6 text-[#FF5AF7]" />
    },
    {
      title: 'Escrow Services',
      description: 'Release funds when specific milestones or deliverables are confirmed',
      icon: <Lock className="h-6 w-6 text-[#FF5AF7]" />
    },
    {
      title: 'DAO Treasury',
      description: 'Require governance votes to unlock treasury funds',
      icon: <Settings className="h-6 w-6 text-[#FF5AF7]" />
    },
    {
      title: 'Vesting Schedules',
      description: 'Token releases based on time + performance conditions',
      icon: <Clock className="h-6 w-6 text-[#FF5AF7]" />
    }
  ];

  // Security layers
  const securityLayers = [
    { name: 'Trinity Consensus', desc: '2-of-3 validator approval' },
    { name: 'Quantum Encryption', desc: 'ML-KEM-1024 protection' },
    { name: 'Formal Verification', desc: 'Lean 4 proven contracts' },
    { name: 'Audit Trail', desc: 'Immutable event logging' }
  ];

  return (
    <>
      <Helmet>
        <title>Smart Contract Vault - Chronos Vault</title>
        <meta name="description" content="Programmable vault with condition-based unlocking powered by Trinity Protocol. ERC-4626 compliant with oracle integration." />
      </Helmet>
      
      <div className="min-h-screen bg-black text-white">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#6B00D7]/15 via-black to-black" />
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#6B00D7]/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-[#FF5AF7]/15 rounded-full blur-[100px]" />
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              className="text-center max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Badge */}
              <motion.div 
                className="inline-flex items-center gap-2 bg-black/50 border border-[#6B00D7]/30 rounded-full px-5 py-2 mb-8"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Code className="h-4 w-4 text-[#FF5AF7]" />
                <span className="text-sm text-gray-300">ERC-4626 Compliant</span>
                <span className="text-gray-500">•</span>
                <span className="text-sm text-[#FF5AF7]">Trinity Protocol™</span>
              </motion.div>
              
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-[#FF5AF7] to-white">
                  Smart Contract Vault
                </span>
              </h1>
              
              <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto">
                Programmable vault with condition-based unlocking. Define custom rules using smart contract logic,
                oracle data, and on-chain events — all verified by 2-of-3 validator consensus.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link href="/create-vault">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#7B10E7] hover:to-[#FF6AF7] text-white px-8 py-6 text-lg shadow-lg shadow-[#6B00D7]/40"
                    data-testid="button-create-smart-vault"
                  >
                    <Terminal className="w-5 h-5 mr-2" />
                    Create Smart Vault
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/documentation">
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="border-[#6B00D7]/50 text-white hover:bg-[#6B00D7]/20 px-8 py-6 text-lg"
                    data-testid="button-view-docs"
                  >
                    <FileCode className="w-5 h-5 mr-2" />
                    View Documentation
                  </Button>
                </Link>
              </div>
              
              {/* Security Badges */}
              <div className="flex flex-wrap justify-center gap-3">
                {securityLayers.map((layer, index) => (
                  <motion.div
                    key={layer.name}
                    className="flex items-center gap-2 bg-black/60 border border-[#6B00D7]/20 rounded-full px-4 py-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  >
                    <CheckCircle2 className="h-4 w-4 text-[#FF5AF7]" />
                    <span className="text-sm text-white">{layer.name}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
        
        {/* Features Grid */}
        <section className="py-20 bg-gradient-to-b from-black via-[#0a0014] to-black">
          <div className="container mx-auto px-4">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Powerful <span className="text-[#FF5AF7]">Features</span>
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Everything you need to create sophisticated, programmable vaults with military-grade security
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  onMouseEnter={() => setHoveredFeature(feature.id)}
                  onMouseLeave={() => setHoveredFeature(null)}
                >
                  <Card 
                    className={`h-full bg-black/60 border-[#6B00D7]/20 transition-all duration-300 ${
                      hoveredFeature === feature.id ? 'border-[#FF5AF7]/50 shadow-[0_0_40px_rgba(255,90,247,0.2)]' : ''
                    }`}
                    data-testid={`card-feature-${feature.id}`}
                  >
                    <CardHeader>
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} text-white flex items-center justify-center mb-4 transition-transform duration-300 ${
                        hoveredFeature === feature.id ? 'scale-110' : ''
                      }`}>
                        {feature.icon}
                      </div>
                      <CardTitle className="text-xl text-white">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Use Cases Section */}
        <section className="py-20 bg-black">
          <div className="container mx-auto px-4">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Built for <span className="text-[#FF5AF7]">Every Use Case</span>
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                From DeFi protocols to enterprise treasury management
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {useCases.map((useCase, index) => (
                <motion.div
                  key={useCase.title}
                  className="bg-gradient-to-b from-[#6B00D7]/10 to-transparent border border-[#6B00D7]/20 rounded-2xl p-6 text-center hover:border-[#FF5AF7]/40 transition-all duration-300"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  data-testid={`card-usecase-${index}`}
                >
                  <div className="w-12 h-12 mx-auto rounded-xl bg-[#6B00D7]/20 flex items-center justify-center mb-4">
                    {useCase.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{useCase.title}</h3>
                  <p className="text-sm text-gray-400">{useCase.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* How It Works */}
        <section className="py-20 bg-gradient-to-b from-black via-[#0a0014] to-black">
          <div className="container mx-auto px-4">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                How It <span className="text-[#FF5AF7]">Works</span>
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Create programmable vaults in minutes with our intuitive workflow
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {[
                { step: '1', title: 'Define Conditions', desc: 'Set unlock rules using our visual builder or custom code', icon: <Settings className="h-8 w-8" /> },
                { step: '2', title: 'Deposit Assets', desc: 'Lock ETH, tokens, or NFTs in your smart contract vault', icon: <Wallet className="h-8 w-8" /> },
                { step: '3', title: 'Validator Consensus', desc: '2-of-3 validators verify and secure your conditions', icon: <Shield className="h-8 w-8" /> },
                { step: '4', title: 'Automatic Execution', desc: 'Vault unlocks when all conditions are verified', icon: <Sparkles className="h-8 w-8" /> }
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  className="relative text-center"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  data-testid={`step-${item.step}`}
                >
                  {index < 3 && (
                    <div className="hidden md:block absolute top-12 left-1/2 w-full h-[2px] bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]/30" />
                  )}
                  
                  <div className="relative z-10 bg-black">
                    <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-[#6B00D7]/30 to-[#FF5AF7]/10 border border-[#6B00D7]/30 flex items-center justify-center mb-4">
                      <div className="text-[#FF5AF7]">{item.icon}</div>
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
        <section className="py-20 bg-gradient-to-b from-[#0a0014] via-[#6B00D7]/10 to-black">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="text-4xl font-bold mb-6">
                Ready to Build Your <span className="text-[#FF5AF7]">Smart Vault</span>?
              </h2>
              <p className="text-gray-300 text-lg mb-10">
                Create a programmable vault with custom conditions and military-grade security in minutes.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/create-vault">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#7B10E7] hover:to-[#FF6AF7] text-white px-10 py-6 text-lg shadow-lg shadow-[#6B00D7]/40"
                    data-testid="button-get-started"
                  >
                    <Key className="w-5 h-5 mr-2" />
                    Get Started
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/vault-types">
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="border-[#6B00D7]/50 text-white hover:bg-[#6B00D7]/20 px-10 py-6 text-lg"
                    data-testid="button-explore-vaults"
                  >
                    <Layers className="w-5 h-5 mr-2" />
                    Explore All Vaults
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}
