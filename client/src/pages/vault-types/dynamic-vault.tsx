import React from 'react';
import { useLocation } from 'wouter';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Activity, BarChart3, Shield, Gauge, Zap, Workflow } from 'lucide-react';

export default function DynamicVaultPage() {
  const [_, navigate] = useLocation();

  return (
    <>
      <Helmet>
        <title>Dynamic Security Vault | Chronos Vault</title>
        <meta name="description" content="Self-adapting vault that dynamically adjusts security parameters based on real-time conditions and threat levels" />
      </Helmet>

      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="mb-12">
          <Button variant="ghost" className="mb-6 hover:bg-[#FF5151]/10" onClick={() => navigate('/vault-types')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Vault Types
          </Button>

          <div className="flex items-center mb-4">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#FF5151] to-[#FF9B51] flex items-center justify-center shadow-lg shadow-[#FF5151]/30 mr-4">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#FF5151] to-[#FF9B51]">
              Dynamic Security Vault
            </h1>
          </div>
          
          <p className="text-xl text-gray-300 max-w-3xl">
            A self-adapting vault that dynamically adjusts its security parameters based on real-time conditions, activity patterns, and threat levels.
          </p>
        </div>

        {/* Key Features */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">Adaptive Security Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-black/30 border-gray-800 hover:bg-black/40 transition">
              <CardContent className="pt-6">
                <div className="flex items-start mb-4">
                  <div className="h-10 w-10 rounded-full bg-[#FF5151]/20 flex items-center justify-center mr-4">
                    <Activity className="h-5 w-5 text-[#FF5151]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Real-Time Adaptation</h3>
                    <p className="text-gray-400">Adjusts security levels automatically based on detected patterns and potential threats</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-black/30 border-gray-800 hover:bg-black/40 transition">
              <CardContent className="pt-6">
                <div className="flex items-start mb-4">
                  <div className="h-10 w-10 rounded-full bg-[#FF7151]/20 flex items-center justify-center mr-4">
                    <Workflow className="h-5 w-5 text-[#FF7151]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Custom Rule Engine</h3>
                    <p className="text-gray-400">Define your own security rules that respond to specific conditions and triggers</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-black/30 border-gray-800 hover:bg-black/40 transition">
              <CardContent className="pt-6">
                <div className="flex items-start mb-4">
                  <div className="h-10 w-10 rounded-full bg-[#FF9B51]/20 flex items-center justify-center mr-4">
                    <Shield className="h-5 w-5 text-[#FF9B51]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Multi-Level Security</h3>
                    <p className="text-gray-400">Configurable security levels from standard to maximum with customizable requirements</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-black/30 border-gray-800 hover:bg-black/40 transition">
              <CardContent className="pt-6">
                <div className="flex items-start mb-4">
                  <div className="h-10 w-10 rounded-full bg-[#FFC151]/20 flex items-center justify-center mr-4">
                    <Zap className="h-5 w-5 text-[#FFC151]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Multi-Chain Fallbacks</h3>
                    <p className="text-gray-400">Configure blockchain fallbacks for increased reliability and recovery options</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-black/30 border-gray-800 hover:bg-black/40 transition">
              <CardContent className="pt-6">
                <div className="flex items-start mb-4">
                  <div className="h-10 w-10 rounded-full bg-[#FFA151]/20 flex items-center justify-center mr-4">
                    <Gauge className="h-5 w-5 text-[#FFA151]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Adaptability Settings</h3>
                    <p className="text-gray-400">Control how quickly your vault responds to changing conditions</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-black/30 border-gray-800 hover:bg-black/40 transition">
              <CardContent className="pt-6">
                <div className="flex items-start mb-4">
                  <div className="h-10 w-10 rounded-full bg-[#FF8151]/20 flex items-center justify-center mr-4">
                    <BarChart3 className="h-5 w-5 text-[#FF8151]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Performance Metrics</h3>
                    <p className="text-gray-400">Real-time insights into your vault's security effectiveness and efficiency</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">How Dynamic Security Works</h2>
          
          <div className="bg-black/30 border border-gray-800 rounded-xl p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-[#FF5151] mb-4">Adaptive Rule Engine</h3>
                <p className="text-gray-300 mb-4">
                  The Dynamic Security Vault constantly monitors conditions you define, such as:
                </p>
                <ul className="space-y-2 text-gray-300 list-disc pl-5">
                  <li>Time-based conditions (after-hours security elevation)</li>
                  <li>User activity patterns and anomaly detection</li>
                  <li>Market conditions for investment-related assets</li>
                  <li>Network and blockchain health status</li>
                  <li>Custom security triggers you define</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-[#FF9B51] mb-4">Automatic Response System</h3>
                <p className="text-gray-300 mb-4">
                  When conditions are met, your vault automatically takes the actions you've configured:
                </p>
                <ul className="space-y-2 text-gray-300 list-disc pl-5">
                  <li>Increase or decrease security level requirements</li>
                  <li>Send alerts to owners and designated security contacts</li>
                  <li>Temporarily freeze assets for additional protection</li>
                  <li>Switch to fallback chains when necessary</li>
                  <li>Execute custom logic for specialized use cases</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* Use Cases */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">Ideal Use Cases</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-black/30 border border-gray-800 rounded-lg p-5">
              <h3 className="text-lg font-semibold text-[#FF5151] mb-2">Institutional Asset Protection</h3>
              <p className="text-gray-300">
                Perfect for organizations that need enhanced security during non-business hours and automatic responses to suspicious activity patterns.
              </p>
            </div>
            
            <div className="bg-black/30 border border-gray-800 rounded-lg p-5">
              <h3 className="text-lg font-semibold text-[#FF7151] mb-2">High-Value Portfolio Management</h3>
              <p className="text-gray-300">
                Protect high-value assets with automatic security escalation during market volatility or when trading activity exceeds normal thresholds.
              </p>
            </div>
            
            <div className="bg-black/30 border border-gray-800 rounded-lg p-5">
              <h3 className="text-lg font-semibold text-[#FF9B51] mb-2">Cross-Border Business Operations</h3>
              <p className="text-gray-300">
                Dynamically adjust security based on geographic access patterns and automatically implement appropriate security measures for each region.
              </p>
            </div>
            
            <div className="bg-black/30 border border-gray-800 rounded-lg p-5">
              <h3 className="text-lg font-semibold text-[#FFC151] mb-2">Critical Recovery Information</h3>
              <p className="text-gray-300">
                Store recovery keys and sensitive backup information with intelligent security that adapts to access patterns and potential threats.
              </p>
            </div>
          </div>
        </div>
        
        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            <div className="bg-black/30 border border-gray-800 rounded-lg p-5">
              <h3 className="text-lg font-semibold text-[#E040FB] mb-2">How fast does the vault adapt to changing conditions?</h3>
              <p className="text-gray-300">
                You control the adaptation speed through settings from "gradual" to "immediate." This allows you to balance between rapid security responses and stability to avoid frequent security level changes.
              </p>
            </div>
            
            <div className="bg-black/30 border border-gray-800 rounded-lg p-5">
              <h3 className="text-lg font-semibold text-[#E040FB] mb-2">Can I override the automatic security changes?</h3>
              <p className="text-gray-300">
                Yes, vault owners can enable an override feature that allows manual adjustment of security levels when necessary, with appropriate authentication.
              </p>
            </div>
            
            <div className="bg-black/30 border border-gray-800 rounded-lg p-5">
              <h3 className="text-lg font-semibold text-[#E040FB] mb-2">How does the multi-chain fallback system work?</h3>
              <p className="text-gray-300">
                You can configure secondary blockchains that your vault will utilize if primary chains experience congestion, outages, or other issues. The vault seamlessly transitions based on your predefined configurations.
              </p>
            </div>
            
            <div className="bg-black/30 border border-gray-800 rounded-lg p-5">
              <h3 className="text-lg font-semibold text-[#E040FB] mb-2">Is there a limit to how many rules I can create?</h3>
              <p className="text-gray-300">
                Dynamic Vaults can accommodate dozens of rules, though we recommend focusing on the most important security conditions for optimal performance. Rules can be prioritized to handle conflicts.
              </p>
            </div>
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Create Your Dynamic Security Vault</h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-6">
            Experience the next level of adaptive security with a vault that responds intelligently to changing conditions and threats.
          </p>
          <Button 
            onClick={() => navigate("/create-vault/dynamic")}
            size="lg"
            className="bg-gradient-to-r from-[#FF5151] to-[#FF9B51] hover:opacity-90 text-white"
          >
            Create Dynamic Vault Now
          </Button>
        </div>
      </div>
    </>
  );
}