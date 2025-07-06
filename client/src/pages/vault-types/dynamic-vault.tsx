import React from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  BarChart3, 
  Workflow, 
  Zap, 
  Layers, 
  Settings2, 
  ArrowRight 
} from 'lucide-react';

export default function DynamicVaultPage() {
  // Animation variants for elements
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <motion.div
        className="mb-12 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Badge className="mb-4 bg-purple-600 hover:bg-purple-700">Revolutionary Security</Badge>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-indigo-600">
          Dynamic Security Vault
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-3xl mx-auto">
          Our most advanced vault with intelligent security rules that adapt to changing conditions and threats
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href="/create-vault/dynamic">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
              Create Dynamic Vault <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <Card className="h-full border border-purple-200 dark:border-purple-900 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <Workflow className="h-10 w-10 text-purple-500 mb-2" />
              <CardTitle>Dynamic Rule Engine</CardTitle>
              <CardDescription>Create custom rules that respond to market conditions, time-based events, and security threats</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 list-disc list-inside text-gray-600 dark:text-gray-400">
                <li>Condition-action rule pairs</li>
                <li>Time-based security escalation</li>
                <li>Market-responsive asset protection</li>
                <li>Anomaly detection and response</li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="h-full border border-purple-200 dark:border-purple-900 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <Shield className="h-10 w-10 text-purple-500 mb-2" />
              <CardTitle>Adaptive Security Levels</CardTitle>
              <CardDescription>Security that automatically adjusts based on threat intelligence and custom conditions</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 list-disc list-inside text-gray-600 dark:text-gray-400">
                <li>Configurable security tiers</li>
                <li>Automatic threat response</li>
                <li>Behavioral analysis integration</li>
                <li>Progressive authentication requirements</li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="h-full border border-purple-200 dark:border-purple-900 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <Layers className="h-10 w-10 text-purple-500 mb-2" />
              <CardTitle>Multi-Chain Optimization</CardTitle>
              <CardDescription>Intelligent blockchain selection based on current network conditions</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 list-disc list-inside text-gray-600 dark:text-gray-400">
                <li>Automatic blockchain fallback</li>
                <li>Network congestion avoidance</li>
                <li>Fee optimization algorithms</li>
                <li>Cross-chain redundancy</li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <motion.section
        className="mb-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 rounded-xl p-8 md:p-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">How Dynamic Security Works</h2>
            
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row items-start gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-full p-3 shadow-md">
                  <Zap className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Create Custom Security Rules</h3>
                  <p className="text-gray-600 dark:text-gray-400">Define conditions that trigger specific security actions. For example, "If market volatility exceeds 5%, increase security level and require additional verification."</p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row items-start gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-full p-3 shadow-md">
                  <BarChart3 className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Monitor Conditions in Real-time</h3>
                  <p className="text-gray-600 dark:text-gray-400">The system continuously monitors market data, network status, and user activity patterns to detect when rule conditions are met.</p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row items-start gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-full p-3 shadow-md">
                  <Settings2 className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Automatic Security Adjustments</h3>
                  <p className="text-gray-600 dark:text-gray-400">When conditions are met, the vault automatically executes the defined security actions without requiring manual intervention.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <h2 className="text-3xl font-bold mb-6">Ready to create your Dynamic Vault?</h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
          Experience our most advanced vault technology with customizable security rules that adapt to your needs
        </p>
        <Link href="/create-vault/dynamic">
          <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
            Get Started Now <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}