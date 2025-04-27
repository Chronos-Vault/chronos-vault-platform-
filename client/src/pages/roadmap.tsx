import React from 'react';
import { Container } from '@/components/ui/container';
import { PageHeader } from '@/components/page-header';
import { BitcoinVaultFeature } from '@/pages/roadmap/BitcoinVaultRoadmap';
import { Helmet } from 'react-helmet';

export default function RoadmapPage() {
  return (
    <>
      <Helmet>
        <title>Product Roadmap | ChronosVault</title>
        <meta 
          name="description" 
          content="Explore the future of ChronosVault with our detailed product roadmap, including upcoming features and innovations." 
        />
      </Helmet>
      
      <Container className="py-12 md:py-16">
        <PageHeader 
          heading="Product Roadmap" 
          description="Our vision for the future of secure, time-locked blockchain vaults" 
          separator
        />
        
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-8">Upcoming Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Bitcoin Vault Feature */}
            <BitcoinVaultFeature />
            
            {/* Other features can be added here */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 rounded-xl border border-purple-200 dark:border-purple-800/50 p-6 overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-purple-900 dark:text-purple-300">Enhanced Multi-Signature Controls</h3>
                <div className="rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-3 py-1 text-xs font-medium border border-purple-200 dark:border-purple-800/50">
                  Q4 2025
                </div>
              </div>
              <p className="text-purple-700 dark:text-purple-400 mb-4">
                Advanced multi-signature support with customizable threshold settings and role-based access control for enterprises and organizations.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20 rounded-xl border border-emerald-200 dark:border-emerald-800/50 p-6 overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-emerald-900 dark:text-emerald-300">Legacy Planning Suite</h3>
                <div className="rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-3 py-1 text-xs font-medium border border-emerald-200 dark:border-emerald-800/50">
                  Q1 2026
                </div>
              </div>
              <p className="text-emerald-700 dark:text-emerald-400 mb-4">
                Comprehensive inheritance planning tools with legal integration, beneficiary management, and gradual release options.
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-20">
          <h2 className="text-2xl font-bold mb-8">Recently Released</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-900/40 dark:to-slate-900/40 rounded-xl border border-gray-200 dark:border-gray-800/50 p-6 overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-300">Multi-Chain Support</h3>
                <div className="rounded-full bg-gray-100 dark:bg-gray-900/70 text-gray-700 dark:text-gray-300 px-3 py-1 text-xs font-medium border border-gray-200 dark:border-gray-800/50">
                  Released
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-400 mb-4">
                Support for multiple blockchains including TON, Ethereum, Solana, and Polygon with seamless cross-chain integration.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}