import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import BitcoinHalvingVault from '@/components/bitcoin/BitcoinHalvingVault';
import { Bitcoin, Lock, Shield, Clock, ChevronDown } from 'lucide-react';

export default function BitcoinHalvingVaultPage() {
  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>Bitcoin Halving Vault | ChronosVault</title>
        <meta 
          name="description" 
          content="Create a specialized Bitcoin vault that unlocks at halving events. The ultimate HODLer tool with Diamond Hands verification." 
        />
      </Helmet>
      
      <div className="relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-br from-amber-500/10 to-amber-600/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-amber-500/10 to-amber-600/5 blur-3xl rounded-full translate-y-1/3 -translate-x-1/4"></div>
        
        {/* Hero Section */}
        <div className="relative pt-16 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                <Bitcoin className="h-8 w-8 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-amber-500 mb-4">
              Bitcoin Halving Vault
            </h1>
            
            <p className="max-w-2xl mx-auto text-xl text-foreground/70 mb-8">
              The ultimate HODLer tool. Lock your Bitcoin until the next halving 
              and prove your Diamond Hands with on-chain verification.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center mb-10">
              <div className="flex items-center bg-white/80 dark:bg-black/20 px-4 py-2 rounded-full border border-amber-200 dark:border-amber-800/30">
                <Lock className="h-5 w-5 text-amber-500 mr-2" />
                <span className="text-sm font-medium">Block Height Unlocking</span>
              </div>
              
              <div className="flex items-center bg-white/80 dark:bg-black/20 px-4 py-2 rounded-full border border-amber-200 dark:border-amber-800/30">
                <Shield className="h-5 w-5 text-amber-500 mr-2" />
                <span className="text-sm font-medium">Military-Grade Security</span>
              </div>
              
              <div className="flex items-center bg-white/80 dark:bg-black/20 px-4 py-2 rounded-full border border-amber-200 dark:border-amber-800/30">
                <Clock className="h-5 w-5 text-amber-500 mr-2" />
                <span className="text-sm font-medium">Halving Cycle Synchronized</span>
              </div>
            </div>
            
            <div className="animate-bounce flex justify-center">
              <ChevronDown className="h-6 w-6 text-amber-500" />
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="relative">
          <BitcoinHalvingVault />
        </div>
        
        {/* FAQ Section */}
        <div className="relative max-w-4xl mx-auto mt-16 mb-24 px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div className="bg-white/80 dark:bg-black/20 rounded-lg border border-amber-200 dark:border-amber-800/30 p-4">
              <h3 className="font-bold text-lg text-amber-800 dark:text-amber-500 mb-2">What is a Bitcoin Halving?</h3>
              <p className="text-sm text-foreground/70">
                The Bitcoin halving is a pre-programmed event that occurs approximately every four years (210,000 blocks) where the reward for mining Bitcoin transactions is cut in half. This reduces the rate at which new Bitcoins are created and makes Bitcoin more scarce over time. Historically, halvings have preceded significant price increases in the following months.
              </p>
            </div>
            
            <div className="bg-white/80 dark:bg-black/20 rounded-lg border border-amber-200 dark:border-amber-800/30 p-4">
              <h3 className="font-bold text-lg text-amber-800 dark:text-amber-500 mb-2">How does a Bitcoin Halving Vault work?</h3>
              <p className="text-sm text-foreground/70">
                A Bitcoin Halving Vault is a specialized time-locked vault that automatically unlocks when Bitcoin reaches a specific block height corresponding to a halving event. Your Bitcoin is secured using military-grade encryption and can only be accessed once the blockchain reaches the target block height, ensuring you hold through market cycles.
              </p>
            </div>
            
            <div className="bg-white/80 dark:bg-black/20 rounded-lg border border-amber-200 dark:border-amber-800/30 p-4">
              <h3 className="font-bold text-lg text-amber-800 dark:text-amber-500 mb-2">Is my Bitcoin safe in a Halving Vault?</h3>
              <p className="text-sm text-foreground/70">
                Yes, your Bitcoin remains in your control at all times. Our vault uses advanced cryptographic techniques to ensure only you (and any designated co-signers) can access your Bitcoin once the target block height is reached. We employ multi-signature security, quantum-resistant encryption, and hardware security modules to provide the highest level of protection.
              </p>
            </div>
            
            <div className="bg-white/80 dark:bg-black/20 rounded-lg border border-amber-200 dark:border-amber-800/30 p-4">
              <h3 className="font-bold text-lg text-amber-800 dark:text-amber-500 mb-2">What are the Diamond Hands benefits?</h3>
              <p className="text-sm text-foreground/70">
                Our Diamond Hands program rewards committed HODLers with special benefits including lower fees (0.4% vs 0.5% standard), exclusive NFT badges that verify your commitment on-chain, access to special halving celebration events, and a Satoshi counter that tracks your Bitcoin as a percentage of the total supply. Legendary HODLers who commit to multiple halvings receive even more exclusive benefits.
              </p>
            </div>
            
            <div className="bg-white/80 dark:bg-black/20 rounded-lg border border-amber-200 dark:border-amber-800/30 p-4">
              <h3 className="font-bold text-lg text-amber-800 dark:text-amber-500 mb-2">When is the next Bitcoin Halving?</h3>
              <p className="text-sm text-foreground/70">
                The next Bitcoin halving (the 5th) is expected to occur in April 2028 at block height 1,050,000. The 4th halving was completed on April 19, 2024, at block height 840,000, reducing the mining reward from 6.25 BTC to 3.125 BTC per block. The 5th halving will further reduce the reward to 1.5625 BTC per block. Our vault interface shows a real-time countdown to this next major Bitcoin event with approximately 156,856 blocks remaining.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}