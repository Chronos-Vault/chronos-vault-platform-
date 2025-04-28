import React from 'react';
import { Container } from '@/components/ui/container';
import { PageHeader } from '@/components/page-header';
import { Helmet } from 'react-helmet';

export default function WhitepaperPage() {
  return (
    <>
      <Helmet>
        <title>ChronosToken (CVT) Whitepaper | ChronosVault</title>
        <meta 
          name="description" 
          content="ChronosToken (CVT) introduces a revolutionary deflationary token model optimized for long-term value preservation through a novel time-based release and automated burning mechanism." 
        />
      </Helmet>
      
      <div className="bg-gradient-to-b from-[#1A0833] to-[#0F0018] min-h-screen">
        <Container className="py-12 md:py-16">
          <PageHeader 
            heading="ChronosToken (CVT) Whitepaper" 
            description="Version 1.0 - April 15, 2025"
          separator
        />
        
        <div className="max-w-4xl mx-auto mt-10 prose prose-invert">
          <h2>Abstract</h2>
          
          <p>
            ChronosToken (CVT) introduces a revolutionary deflationary token model optimized for long-term value 
            preservation through a novel time-based release and automated burning mechanism. With a fixed maximum 
            supply of 21 million tokens and progressive distribution over 21 years, CVT creates a mathematically 
            guaranteed scarcity model superior to traditional cryptocurrencies. This whitepaper outlines the economic 
            model, utility functions, governance structure, and technical implementation of CVT within the Chronos 
            Vault multi-blockchain ecosystem.
          </p>
          
          <h2>Table of Contents</h2>
          
          <ul className="space-y-1">
            <li><a href="#introduction" className="text-[#FF5AF7] hover:text-[#6B00D7] transition-colors">1. Introduction</a></li>
            <li><a href="#token-economics" className="text-[#FF5AF7] hover:text-[#6B00D7] transition-colors">2. Token Economics</a></li>
            <li><a href="#value-accrual" className="text-[#FF5AF7] hover:text-[#6B00D7] transition-colors">3. Value Accrual Mechanisms</a></li>
            <li><a href="#utility-and-governance" className="text-[#FF5AF7] hover:text-[#6B00D7] transition-colors">4. Utility and Governance</a></li>
            <li><a href="#premium-features" className="text-[#FF5AF7] hover:text-[#6B00D7] transition-colors">5. Premium Vault Features</a></li>
            <li><a href="#staking-tiers" className="text-[#FF5AF7] hover:text-[#6B00D7] transition-colors">6. Staking Tiers & Benefits</a></li>
            <li><a href="#cross-chain" className="text-[#FF5AF7] hover:text-[#6B00D7] transition-colors">7. Cross-Chain Architecture</a></li>
            <li><a href="#security" className="text-[#FF5AF7] hover:text-[#6B00D7] transition-colors">8. Security Model</a></li>
            <li><a href="#future-vision" className="text-[#FF5AF7] hover:text-[#6B00D7] transition-colors">9. Future Vision - Chronos Vault 2.0</a></li>
          </ul>
          
          <h2 id="introduction">1. Introduction</h2>
          
          <h3>1.1 The Chronos Vault Platform</h3>
          
          <p>
            Chronos Vault is a cutting-edge decentralized digital time capsule platform providing comprehensive 
            multi-blockchain infrastructure with advanced time-locking mechanisms. The platform enables users to 
            create tamper-proof digital and financial time capsules with custom unlock conditions across multiple 
            blockchains including TON, Ethereum, Solana, Polygon, and Arweave.
          </p>
          
          <p>Key features include:</p>
          <ul>
            <li>Military-grade security with cross-chain verification</li>
            <li>Intergenerational wealth transfer protocol</li>
            <li>Advanced portfolio optimization with AI capabilities</li>
            <li>Cross-chain asset diversification</li>
            <li>Quantum-resistant encryption for long-term preservation</li>
          </ul>
          
          <h3>1.2 The ChronosToken (CVT) Vision</h3>
          
          <p>
            ChronosToken (CVT) represents a paradigm shift in tokenomics by directly aligning token value with 
            time - creating a true "store of value" that becomes more valuable with the passage of time. Unlike 
            inflation-based token models or even fixed-supply currencies like Bitcoin, CVT implements an actively 
            deflationary model that guarantees continuous reduction in supply over time.
          </p>
          
          <p>
            The token embodies the core principle of Chronos Vault: the preservation and appreciation of value 
            across time. Just as the platform secures digital assets for predetermined future dates, the token 
            itself becomes more scarce and valuable as time progresses.
          </p>
          
          <h2 id="token-economics">2. Token Economics</h2>
          
          <h3>2.1 Token Model Overview</h3>
          
          <p>ChronosToken (CVT) employs a mathematical scarcity model with the following properties:</p>
          
          <h4>Basic Parameters:</h4>
          <ul>
            <li><strong>Name</strong>: ChronosToken</li>
            <li><strong>Symbol</strong>: CVT</li>
            <li><strong>Total Supply</strong>: 21,000,000 CVT (fixed maximum)</li>
            <li><strong>Blockchain</strong>: Primary token on TON, wrapped versions on Ethereum and Solana</li>
            <li><strong>Decimals</strong>: 9 (TON standard)</li>
          </ul>
          
          <h4>Supply Characteristics:</h4>
          <ul>
            <li>Fixed maximum supply of 21 million tokens (immutable)</li>
            <li>Continuous burning mechanism that permanently reduces circulating supply</li>
            <li>Time-locked distribution over a 21-year period</li>
          </ul>
          
          <h3>2.2 Distribution Mechanics</h3>
          
          <p>
            The initial distribution of 21 million CVT tokens is structured as follows:
          </p>
          
          <h4>Initial Circulation (30% - 6.3 million CVT):</h4>
          <ul>
            <li>Strategic Partners: 5% (1,050,000 CVT)</li>
            <li>Platform Development: 10% (2,100,000 CVT)</li>
            <li>Ecosystem Fund: 15% (3,150,000 CVT)</li>
          </ul>
          
          <h4>Time-Locked (70% - 14.7 million CVT):</h4>
          <p>Released according to a predetermined schedule:</p>
          
          <table className="my-4 border-collapse">
            <thead>
              <tr>
                <th className="border border-gray-600 px-4 py-2">Release Phase</th>
                <th className="border border-gray-600 px-4 py-2">Timeframe</th>
                <th className="border border-gray-600 px-4 py-2">Amount Released</th>
                <th className="border border-gray-600 px-4 py-2">% of Locked Supply</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-600 px-4 py-2">Phase 1</td>
                <td className="border border-gray-600 px-4 py-2">Year 4</td>
                <td className="border border-gray-600 px-4 py-2">7,350,000 CVT</td>
                <td className="border border-gray-600 px-4 py-2">50%</td>
              </tr>
              <tr>
                <td className="border border-gray-600 px-4 py-2">Phase 2</td>
                <td className="border border-gray-600 px-4 py-2">Year 8</td>
                <td className="border border-gray-600 px-4 py-2">3,675,000 CVT</td>
                <td className="border border-gray-600 px-4 py-2">25%</td>
              </tr>
              <tr>
                <td className="border border-gray-600 px-4 py-2">Phase 3</td>
                <td className="border border-gray-600 px-4 py-2">Year 12</td>
                <td className="border border-gray-600 px-4 py-2">1,837,500 CVT</td>
                <td className="border border-gray-600 px-4 py-2">12.5%</td>
              </tr>
              <tr>
                <td className="border border-gray-600 px-4 py-2">Phase 4</td>
                <td className="border border-gray-600 px-4 py-2">Year 16</td>
                <td className="border border-gray-600 px-4 py-2">918,750 CVT</td>
                <td className="border border-gray-600 px-4 py-2">6.25%</td>
              </tr>
              <tr>
                <td className="border border-gray-600 px-4 py-2">Phase 5</td>
                <td className="border border-gray-600 px-4 py-2">Year 21</td>
                <td className="border border-gray-600 px-4 py-2">918,750 CVT</td>
                <td className="border border-gray-600 px-4 py-2">6.25%</td>
              </tr>
            </tbody>
          </table>
          
          <p>
            This distribution schedule draws inspiration from Bitcoin's halving mechanism but operates 
            inversely - instead of halving new issuance, CVT halves the amount released from time-locked 
            reserves. This creates a predictable, transparent release schedule stretching over two decades.
          </p>
          
          <h3>2.3 Supply Economics Analysis</h3>
          
          <p>
            Unlike Bitcoin's eventual static supply of 21 million, CVT's maximum supply of 21 million is 
            progressively reduced through burning. This model implements mathematical scarcity that intensifies over time.
          </p>
          
          <h4>Key Differentiators from Bitcoin:</h4>
          
          <ol>
            <li>
              <strong>Fixed Maximum vs. Decreasing Total</strong>: Bitcoin's supply approaches but never exceeds 
              21 million. CVT starts at 21 million and continuously decreases.
            </li>
            <li>
              <strong>Mining vs. Burning</strong>: Bitcoin releases new tokens through mining until reaching 
              maximum supply. CVT permanently removes tokens from circulation through burning.
            </li>
            <li>
              <strong>Supply Trajectory</strong>: Bitcoin's supply curve is asymptotic (approaching but never 
              reaching 21 million). CVT's supply curve is consistently negative (starting at 21 million and 
              perpetually decreasing).
            </li>
          </ol>
          
          <h2 id="value-accrual">3. Value Accrual Mechanisms</h2>
          
          <h3>3.1 Fee Capture System</h3>
          
          <p>
            Transaction fees from the Chronos Vault platform flow directly into the CVT value accrual system:
          </p>
          
          <h4>Fee Sources:</h4>
          <ul>
            <li>Time capsule creation fees (0.1-0.5%)</li>
            <li>Cross-chain transaction fees</li>
            <li>Premium feature access fees</li>
            <li>API access fees</li>
          </ul>
          
          <h4>Fee Allocation:</h4>
          <ul>
            <li>60% dedicated to token buybacks and burns</li>
            <li>40% allocated to platform development and operations</li>
          </ul>
          
          <p>
            This model ensures that increased platform usage directly translates to increased token value through supply reduction.
          </p>
          
          <h2 id="utility-and-governance">4. Utility and Governance</h2>
          
          <h3>4.1 Token Utility Functions</h3>
          
          <p>CVT serves multiple core utility functions within the Chronos Vault ecosystem:</p>
          
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-[#FF5AF7] font-bold">•</span>
              <div>
                <p className="font-medium">Platform Fee Payment</p>
                <p className="text-gray-400">CVT is the native token for all platform services, including vault creation, access, and management</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#FF5AF7] font-bold">•</span>
              <div>
                <p className="font-medium">Security Staking</p>
                <p className="text-gray-400">Token stakes are required for high-value vaults, providing additional security against attacks</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#FF5AF7] font-bold">•</span>
              <div>
                <p className="font-medium">Governance Rights</p>
                <p className="text-gray-400">Proportional voting weight in platform governance decisions based on token holdings</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#FF5AF7] font-bold">•</span>
              <div>
                <p className="font-medium">Validator Requirements</p>
                <p className="text-gray-400">Security validation roles require token stakes to ensure protocol integrity</p>
              </div>
            </li>
          </ul>
          
          <h3>4.2 Governance Structure</h3>
          
          <p>
            CVT implements a progressive decentralization model for governance, gradually transitioning
            from foundation-led to fully community-controlled:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
            <div className="bg-[#121212] p-4 rounded-lg border border-[#333]">
              <h4 className="text-[#FF5AF7] font-semibold mb-2">Phase 1: Foundation Governance</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Core team decisions with community input</li>
                <li>• Token holders submit proposals</li>
                <li>• Transparent reporting mechanisms</li>
                <li>• Years 1-2</li>
              </ul>
            </div>
            
            <div className="bg-[#121212] p-4 rounded-lg border border-[#333]">
              <h4 className="text-[#FF5AF7] font-semibold mb-2">Phase 2: Limited DAO Governance</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Token holders vote on parameters</li>
                <li>• Team maintains security veto</li>
                <li>• Treasury decisions require approval</li>
                <li>• Years 3-4</li>
              </ul>
            </div>
            
            <div className="bg-[#121212] p-4 rounded-lg border border-[#333]">
              <h4 className="text-[#FF5AF7] font-semibold mb-2">Phase 3: Full DAO Governance</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Complete on-chain governance</li>
                <li>• Multi-chain implementation</li>
                <li>• Automated proposal execution</li>
                <li>• Year 5+</li>
              </ul>
            </div>
          </div>
          
          <h2 id="premium-features">5. Premium Vault Features</h2>
          
          <div className="bg-gradient-to-br from-[#200A33]/95 to-[#120020]/95 p-6 rounded-lg border border-[#6B00D7]/30 backdrop-blur-md mb-10 shadow-lg shadow-purple-900/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]">
                <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 11V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M18.8799 19.07C18.5999 19.07 18.3699 18.85 18.3699 18.56C18.3699 18.28 18.5899 18.05 18.8799 18.05C19.1699 18.05 19.3899 18.27 19.3899 18.56C19.3899 18.85 19.1699 19.07 18.8799 19.07Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15.8799 16.93C15.5999 16.93 15.3799 16.71 15.3799 16.42C15.3799 16.14 15.5999 15.91 15.8799 15.91C16.1699 15.91 16.3899 16.13 16.3899 16.42C16.3899 16.71 16.1699 16.93 15.8799 16.93Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21.8799 16.93C21.5999 16.93 21.3799 16.71 21.3799 16.42C21.3799 16.14 21.5999 15.91 21.8799 15.91C22.1699 15.91 22.3899 16.13 22.3899 16.42C22.3899 16.71 22.1699 16.93 21.8799 16.93Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M13.5 16.4L17.59 19.95C17.89 20.21 18.34 20.21 18.64 19.95L22 16.97" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] bg-clip-text text-transparent">
                Premium Vault Features
              </h3>
            </div>
            
            <p className="text-gray-300 mb-6">
              CVT token holders gain access to premium vault features based on their token holdings
              and staking tier. These features enhance security, functionality, and value of vaults
              while offering unparalleled control over digital assets.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
            <div className="bg-gradient-to-br from-[#1D1D1D]/95 to-[#151515]/95 p-6 rounded-lg border border-[#333] backdrop-blur-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#6B00D7]/20 to-transparent rounded-bl-full pointer-events-none"></div>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]">
                  <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 16V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 8V7.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] bg-clip-text text-transparent">
                  Advanced Security Features
                </h3>
              </div>
              
              <div className="space-y-4 mt-2 relative z-10">
                <div className="bg-[#191919] p-4 rounded-lg border border-[#333] hover:border-[#6B00D7]/50 transition-colors">
                  <h4 className="font-medium text-white mb-1">Multi-signature Authentication</h4>
                  <p className="text-gray-400 text-sm">Require multiple authorized parties to approve vault access, ensuring distributed security and preventing single points of failure</p>
                </div>
                
                <div className="bg-[#191919] p-4 rounded-lg border border-[#333] hover:border-[#8F00FF]/50 transition-colors">
                  <h4 className="font-medium text-white mb-1">Quantum-resistant Encryption</h4>
                  <p className="text-gray-400 text-sm">Future-proof encryption algorithms secure against quantum computing attacks, designed to withstand decades of cryptographic advancement</p>
                </div>
                
                <div className="bg-[#191919] p-4 rounded-lg border border-[#333] hover:border-[#FF5AF7]/50 transition-colors">
                  <h4 className="font-medium text-white mb-1">AI Security Monitoring</h4>
                  <p className="text-gray-400 text-sm">Advanced machine learning algorithms detect suspicious activity in real-time, with behavior analysis and anomaly detection capabilities</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-[#1D1D1D]/95 to-[#151515]/95 p-6 rounded-lg border border-[#333] backdrop-blur-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#FF5AF7]/20 to-transparent rounded-bl-full pointer-events-none"></div>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]">
                  <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 15.5C13.933 15.5 15.5 13.933 15.5 12C15.5 10.067 13.933 8.5 12 8.5C10.067 8.5 8.5 10.067 8.5 12C8.5 13.933 10.067 15.5 12 15.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M18.5 7.5H18.51" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] bg-clip-text text-transparent">
                  Premium Vault Types
                </h3>
              </div>
              
              <div className="space-y-4 mt-2 relative z-10">
                <div className="bg-[#191919] p-4 rounded-lg border border-[#333] hover:border-[#6B00D7]/50 transition-colors">
                  <h4 className="font-medium text-white mb-1">Geolocation Vaults</h4>
                  <p className="text-gray-400 text-sm">Vaults that can only be accessed from specific geographic locations, adding a physical security layer to digital assets</p>
                </div>
                
                <div className="bg-[#191919] p-4 rounded-lg border border-[#333] hover:border-[#8F00FF]/50 transition-colors">
                  <h4 className="font-medium text-white mb-1">Conditional Trigger Vaults</h4>
                  <p className="text-gray-400 text-sm">Automated vault unlocking based on custom blockchain events, price thresholds, or smart contract conditions</p>
                </div>
                
                <div className="bg-[#191919] p-4 rounded-lg border border-[#333] hover:border-[#FF5AF7]/50 transition-colors">
                  <h4 className="font-medium text-white mb-1">Multi-generational Transfer Vaults</h4>
                  <p className="text-gray-400 text-sm">Structured inheritance vaults with customized access schedules, ideal for family wealth preservation across generations</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-[#0A0A0A] border border-[#333] rounded-lg p-5 mb-8">
            <h3 className="text-lg font-bold text-white mb-3">Financial Premium Features</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#121212] p-3 rounded border border-[#222]">
                <h4 className="text-[#FF5AF7] font-medium mb-2">Yield Optimization</h4>
                <p className="text-sm text-gray-300">AI-driven yield strategies maximize returns for vaulted assets</p>
              </div>
              
              <div className="bg-[#121212] p-3 rounded border border-[#222]">
                <h4 className="text-[#FF5AF7] font-medium mb-2">Cross-Chain Rebalancing</h4>
                <p className="text-sm text-gray-300">Automatic portfolio rebalancing across multiple blockchains</p>
              </div>
              
              <div className="bg-[#121212] p-3 rounded border border-[#222]">
                <h4 className="text-[#FF5AF7] font-medium mb-2">DeFi Integration</h4>
                <p className="text-sm text-gray-300">Direct access to DeFi protocols from within vaults</p>
              </div>
            </div>
          </div>
          
          <h2 id="staking-tiers">6. Staking Tiers & Benefits</h2>
          
          <div className="bg-gradient-to-br from-[#200A33]/95 to-[#120020]/95 p-6 rounded-lg border border-[#6B00D7]/30 backdrop-blur-md mb-10 shadow-lg shadow-purple-900/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]">
                <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19.3 7.9L17.2 9.4C17.9 11.1 17.9 13 17.2 14.6L19.3 16.1C20.5 13.8 20.5 10.3 19.3 7.9Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15.5 12C15.5 13.3807 14.3807 14.5 13 14.5C11.6193 14.5 10.5 13.3807 10.5 12C10.5 10.6193 11.6193 9.5 13 9.5C14.3807 9.5 15.5 10.6193 15.5 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15.5 4.30001V5.50001C15.5 6.10001 15.1 7.30001 14.5 8.00001L13 7.20001C14 6.60001 15 5.40001 15.5 4.30001Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M13 16.8L14.5 16C15.1 16.7 15.5 17.9 15.5 18.5V19.7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10.5 4.30001V5.50001C10.5 6.10001 10.9 7.30001 11.5 8.00001L13 7.20001C12 6.60001 11 5.40001 10.5 4.30001Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M13 16.8L11.5 16C10.9 16.7 10.5 17.9 10.5 18.5V19.7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8.8 7.9L6.7 9.4C7.4 11.1 7.4 13 6.7 14.6L8.8 16.1C10 13.8 10 10.3 8.8 7.9Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] bg-clip-text text-transparent">
                Staking Tiers & Benefits
              </h3>
            </div>
            
            <p className="text-gray-300 mb-6">
              The CVT staking system implements three progressive tiers with increasing benefits.
              Higher tiers require larger token stakes but provide substantially better platform
              benefits and reduced fees. Staking is the cornerstone of the Chronos Vault ecosystem,
              aligning user incentives with platform growth.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-8">
            <div className="bg-gradient-to-br from-[#200A33]/95 to-[#120020]/95 p-6 rounded-lg border border-[#6B00D7]/30 backdrop-blur-md relative overflow-hidden group hover:border-[#6B00D7]/50 transition-colors shadow-lg shadow-purple-900/10">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#6B00D7]/20 to-transparent rounded-bl-full pointer-events-none"></div>
              <div className="absolute inset-0 bg-gradient-to-b from-[#6B00D7]/0 via-transparent to-[#6B00D7]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="flex items-center gap-3 mb-4 relative z-10">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-[#6B00D7] to-[#8F00FF]">
                  <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 10C10.1046 10 11 9.10457 11 8C11 6.89543 10.1046 6 9 6C7.89543 6 7 6.89543 7 8C7 9.10457 7.89543 10 9 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2.67999 18.95L7.59999 15.64C8.38999 15.11 9.52999 15.17 10.24 15.78L10.57 16.07C11.35 16.74 12.61 16.74 13.39 16.07L17.55 12.5C18.33 11.83 19.59 11.83 20.37 12.5L22 13.9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-[#6B00D7] to-[#8F00FF] bg-clip-text text-transparent">
                  Vault Guardian
                </h3>
              </div>
              
              <div className="inline-block bg-[#6B00D7]/10 px-4 py-2 rounded-full border border-[#6B00D7]/30 mb-5 relative z-10">
                <p className="font-semibold text-white">1,000+ CVT</p>
              </div>
              
              <div className="space-y-3 relative z-10">
                <div className="flex items-center gap-2 text-white">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#6B00D7]/20 flex items-center justify-center">
                    <svg className="h-4 w-4 text-[#FF5AF7]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12L9 16L19 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span>75% reduction in platform fees</span>
                </div>
                
                <div className="flex items-center gap-2 text-white">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#6B00D7]/20 flex items-center justify-center">
                    <svg className="h-4 w-4 text-[#FF5AF7]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12L9 16L19 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span>2x voting power in governance</span>
                </div>
                
                <div className="flex items-center gap-2 text-white">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#6B00D7]/20 flex items-center justify-center">
                    <svg className="h-4 w-4 text-[#FF5AF7]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12L9 16L19 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span>Premium investment strategies</span>
                </div>
                
                <div className="flex items-center gap-2 text-white">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#6B00D7]/20 flex items-center justify-center">
                    <svg className="h-4 w-4 text-[#FF5AF7]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12L9 16L19 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span>Beta feature access</span>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-[#333] text-center">
                <span className="text-sm font-medium bg-gradient-to-r from-[#6B00D7] to-[#8F00FF] bg-clip-text text-transparent">
                  Minimum stake duration: 6 months
                </span>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-[#210A3A]/95 to-[#150025]/95 p-6 rounded-lg border border-[#8F00FF]/30 backdrop-blur-md relative overflow-hidden group hover:border-[#8F00FF]/50 transition-colors shadow-lg shadow-purple-900/10">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#8F00FF]/20 to-transparent rounded-bl-full pointer-events-none"></div>
              <div className="absolute inset-0 bg-gradient-to-b from-[#8F00FF]/0 via-transparent to-[#8F00FF]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="flex items-center gap-3 mb-4 relative z-10">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-[#8F00FF] to-[#A040FF]">
                  <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 10C10.1046 10 11 9.10457 11 8C11 6.89543 10.1046 6 9 6C7.89543 6 7 6.89543 7 8C7 9.10457 7.89543 10 9 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2.67999 18.95L7.59999 15.64C8.38999 15.11 9.52999 15.17 10.24 15.78L10.57 16.07C11.35 16.74 12.61 16.74 13.39 16.07L17.55 12.5C18.33 11.83 19.59 11.83 20.37 12.5L22 13.9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-[#8F00FF] to-[#A040FF] bg-clip-text text-transparent">
                  Vault Architect
                </h3>
              </div>
              
              <div className="inline-block bg-[#8F00FF]/10 px-4 py-2 rounded-full border border-[#8F00FF]/30 mb-5 relative z-10">
                <p className="font-semibold text-white">10,000+ CVT</p>
              </div>
              
              <div className="space-y-3 relative z-10">
                <div className="flex items-center gap-2 text-white">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#8F00FF]/20 flex items-center justify-center">
                    <svg className="h-4 w-4 text-[#A040FF]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12L9 16L19 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span>90% reduction in platform fees</span>
                </div>
                
                <div className="flex items-center gap-2 text-white">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#8F00FF]/20 flex items-center justify-center">
                    <svg className="h-4 w-4 text-[#A040FF]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12L9 16L19 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span>5x voting power in governance</span>
                </div>
                
                <div className="flex items-center gap-2 text-white">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#8F00FF]/20 flex items-center justify-center">
                    <svg className="h-4 w-4 text-[#A040FF]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12L9 16L19 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span>2% of platform fees distributed</span>
                </div>
                
                <div className="flex items-center gap-2 text-white">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#8F00FF]/20 flex items-center justify-center">
                    <svg className="h-4 w-4 text-[#A040FF]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12L9 16L19 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span>Priority access to new features</span>
                </div>
                
                <div className="flex items-center gap-2 text-white">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#8F00FF]/20 flex items-center justify-center">
                    <svg className="h-4 w-4 text-[#A040FF]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12L9 16L19 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span>Enhanced security verification</span>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-[#333] text-center">
                <span className="text-sm font-medium bg-gradient-to-r from-[#8F00FF] to-[#A040FF] bg-clip-text text-transparent">
                  Minimum stake duration: 1 year
                </span>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-[#260A40]/95 to-[#180030]/95 p-6 rounded-lg border border-[#FF5AF7]/30 backdrop-blur-md relative overflow-hidden group hover:border-[#FF5AF7]/50 transition-colors shadow-lg shadow-purple-900/10">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#FF5AF7]/20 to-transparent rounded-bl-full pointer-events-none"></div>
              <div className="absolute inset-0 bg-gradient-to-b from-[#FF5AF7]/0 via-transparent to-[#FF5AF7]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="flex items-center gap-3 mb-4 relative z-10">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-[#B060FF] to-[#FF5AF7]">
                  <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 10C10.1046 10 11 9.10457 11 8C11 6.89543 10.1046 6 9 6C7.89543 6 7 6.89543 7 8C7 9.10457 7.89543 10 9 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2.67999 18.95L7.59999 15.64C8.38999 15.11 9.52999 15.17 10.24 15.78L10.57 16.07C11.35 16.74 12.61 16.74 13.39 16.07L17.55 12.5C18.33 11.83 19.59 11.83 20.37 12.5L22 13.9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-[#B060FF] to-[#FF5AF7] bg-clip-text text-transparent">
                  Vault Sovereign
                </h3>
              </div>
              
              <div className="inline-block bg-[#FF5AF7]/10 px-4 py-2 rounded-full border border-[#FF5AF7]/30 mb-5 relative z-10">
                <p className="font-semibold text-white">100,000+ CVT</p>
              </div>
              
              <div className="space-y-3 relative z-10">
                <div className="flex items-center gap-2 text-white">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#FF5AF7]/20 flex items-center justify-center">
                    <svg className="h-4 w-4 text-[#FF5AF7]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12L9 16L19 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span>100% reduction in platform fees</span>
                </div>
                
                <div className="flex items-center gap-2 text-white">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#FF5AF7]/20 flex items-center justify-center">
                    <svg className="h-4 w-4 text-[#FF5AF7]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12L9 16L19 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span>25x voting power in governance</span>
                </div>
                
                <div className="flex items-center gap-2 text-white">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#FF5AF7]/20 flex items-center justify-center">
                    <svg className="h-4 w-4 text-[#FF5AF7]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12L9 16L19 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span>5% of platform fees distributed</span>
                </div>
                
                <div className="flex items-center gap-2 text-white">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#FF5AF7]/20 flex items-center justify-center">
                    <svg className="h-4 w-4 text-[#FF5AF7]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12L9 16L19 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span>Direct treasury voting rights</span>
                </div>
                
                <div className="flex items-center gap-2 text-white">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#FF5AF7]/20 flex items-center justify-center">
                    <svg className="h-4 w-4 text-[#FF5AF7]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12L9 16L19 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span>Custom API/integration options</span>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-[#333] text-center">
                <span className="text-sm font-medium bg-gradient-to-r from-[#B060FF] to-[#FF5AF7] bg-clip-text text-transparent">
                  Minimum stake duration: 3 years
                </span>
              </div>
            </div>
          </div>
          
          <h3 className="mt-8 mb-4">Time-Based Multipliers</h3>
          
          <p className="mb-4">
            Stake duration significantly increases staking rewards through time multipliers.
            Longer commitments yield exponentially higher returns:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-[#121212] p-3 rounded border border-[#333] text-center">
              <div className="text-lg font-bold text-[#6B00D7]">3 Months</div>
              <div className="text-2xl font-bold text-white my-2">1.0x</div>
              <div className="text-sm text-gray-400">Base multiplier</div>
            </div>
            
            <div className="bg-[#121212] p-3 rounded border border-[#333] text-center">
              <div className="text-lg font-bold text-[#8F00FF]">6 Months</div>
              <div className="text-2xl font-bold text-white my-2">1.25x</div>
              <div className="text-sm text-gray-400">Rewards multiplier</div>
            </div>
            
            <div className="bg-[#121212] p-3 rounded border border-[#333] text-center">
              <div className="text-lg font-bold text-[#A040FF]">1 Year</div>
              <div className="text-2xl font-bold text-white my-2">1.5x</div>
              <div className="text-sm text-gray-400">Rewards multiplier</div>
            </div>
            
            <div className="bg-[#121212] p-3 rounded border border-[#333] text-center">
              <div className="text-lg font-bold text-[#FF5AF7]">2+ Years</div>
              <div className="text-2xl font-bold text-white my-2">2.0x</div>
              <div className="text-sm text-gray-400">Rewards multiplier</div>
            </div>
          </div>
          
          <h2 id="cross-chain">7. Cross-Chain Architecture</h2>
          
          <p>
            Chronos Vault implements a revolutionary cross-chain architecture that distributes security,
            functionality, and data across multiple blockchains for unprecedented security and performance.
          </p>
          
          <div className="bg-[#0A0A0A] border border-[#222] rounded-lg p-4 my-6">
            <h3 className="text-lg font-bold text-white mb-3">Key Cross-Chain Components</h3>
            
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#6B00D7]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[#FF5AF7] text-sm">1</span>
                </div>
                <div>
                  <p className="font-medium text-white">Triple-Chain Security Protocol</p>
                  <p className="text-gray-400">Distributes security responsibilities across Ethereum (ownership), Solana (monitoring), and TON (recovery)</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#6B00D7]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[#FF5AF7] text-sm">2</span>
                </div>
                <div>
                  <p className="font-medium text-white">Validator Network</p>
                  <p className="text-gray-400">Distributed network of validators facilitate cross-chain operations with threshold signatures</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#6B00D7]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[#FF5AF7] text-sm">3</span>
                </div>
                <div>
                  <p className="font-medium text-white">Bridge Architecture</p>
                  <p className="text-gray-400">Secure bridging with lock-and-mint mechanism, economic security, and cross-chain verification</p>
                </div>
              </li>
            </ul>
          </div>
          
          <h2 id="security">8. Security Model</h2>
          
          <p>
            Chronos Vault implements a comprehensive security model combining economic security,
            technical safeguards, and advanced cryptography for unparalleled protection:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            <div>
              <h3 className="text-lg font-bold text-white mb-3">Economic Security</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-[#FF5AF7] mt-0.5">•</span>
                  <p className="text-gray-300">Attack cost exceeds potential gain</p>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF5AF7] mt-0.5">•</span>
                  <p className="text-gray-300">Multi-chain proof-of-stake security</p>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF5AF7] mt-0.5">•</span>
                  <p className="text-gray-300">Time-lock mechanisms increase attack difficulty</p>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF5AF7] mt-0.5">•</span>
                  <p className="text-gray-300">Slashing penalties for malicious behavior</p>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-white mb-3">Technical Security</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-[#FF5AF7] mt-0.5">•</span>
                  <p className="text-gray-300">Formal verification of contracts</p>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF5AF7] mt-0.5">•</span>
                  <p className="text-gray-300">Multiple independent security audits</p>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF5AF7] mt-0.5">•</span>
                  <p className="text-gray-300">Defense-in-depth approach</p>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF5AF7] mt-0.5">•</span>
                  <p className="text-gray-300">Quantum-resistant cryptography</p>
                </li>
              </ul>
            </div>
          </div>
          
          <h2 id="future-vision">9. Future Vision - Chronos Vault 2.0</h2>
          
          <p className="mb-4">
            The Chronos Vault platform has an ambitious roadmap for future development that will further
            revolutionize digital asset security and time-locked value storage across the blockchain ecosystem.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            <div className="bg-gradient-to-br from-[#0A0A0A] to-[#121212] p-5 rounded-lg border border-[#333]">
              <h3 className="text-xl font-bold text-white mb-3">Advanced Cross-Chain Management</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-[#FF5AF7] mt-0.5">•</span>
                  <p className="text-gray-300">Support for emerging Layer 2 networks (Optimism, Arbitrum, zkSync)</p>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF5AF7] mt-0.5">•</span>
                  <p className="text-gray-300">Auto-balancing assets across chains based on fees, security, and yield</p>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF5AF7] mt-0.5">•</span>
                  <p className="text-gray-300">Transaction batching for institutional users</p>
                </li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-[#0A0A0A] to-[#121212] p-5 rounded-lg border border-[#333]">
              <h3 className="text-xl font-bold text-white mb-3">Enhanced CVT Tokenomics</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-[#FF5AF7] mt-0.5">•</span>
                  <p className="text-gray-300">CVT Boost program for temporary premium feature access</p>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF5AF7] mt-0.5">•</span>
                  <p className="text-gray-300">Expanded revenue sharing for top-tier stakers</p>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF5AF7] mt-0.5">•</span>
                  <p className="text-gray-300">Dynamic staking rewards based on total staked supply</p>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            <div className="bg-gradient-to-br from-[#0A0A0A] to-[#121212] p-5 rounded-lg border border-[#333]">
              <h3 className="text-xl font-bold text-white mb-3">AI-Powered Vaults</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-[#FF5AF7] mt-0.5">•</span>
                  <p className="text-gray-300">On-chain data analysis for vault strategy optimization</p>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF5AF7] mt-0.5">•</span>
                  <p className="text-gray-300">Personalized recommendations based on risk profile</p>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF5AF7] mt-0.5">•</span>
                  <p className="text-gray-300">Predictive security modeling for exploit prevention</p>
                </li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-[#0A0A0A] to-[#121212] p-5 rounded-lg border border-[#333]">
              <h3 className="text-xl font-bold text-white mb-3">Hardware Integrations</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-[#FF5AF7] mt-0.5">•</span>
                  <p className="text-gray-300">Hardware security module for major wallet providers</p>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF5AF7] mt-0.5">•</span>
                  <p className="text-gray-300">Biometric authentication via mobile devices</p>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF5AF7] mt-0.5">•</span>
                  <p className="text-gray-300">Physical backup with encrypted QR codes</p>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
            <div className="bg-gradient-to-br from-[#0A0A0A] to-[#121212] p-5 rounded-lg border border-[#333]">
              <h3 className="text-xl font-bold text-white mb-3">Enterprise Solutions</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-[#FF5AF7] mt-0.5">•</span>
                  <p className="text-gray-300">Corporate governance vaults</p>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF5AF7] mt-0.5">•</span>
                  <p className="text-gray-300">Regulatory compliance frameworks</p>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF5AF7] mt-0.5">•</span>
                  <p className="text-gray-300">Advanced audit trails and reporting</p>
                </li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-[#0A0A0A] to-[#121212] p-5 rounded-lg border border-[#333]">
              <h3 className="text-xl font-bold text-white mb-3">Developer Ecosystem</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-[#FF5AF7] mt-0.5">•</span>
                  <p className="text-gray-300">Open API for third-party developers</p>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF5AF7] mt-0.5">•</span>
                  <p className="text-gray-300">Developer incentives using CVT</p>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF5AF7] mt-0.5">•</span>
                  <p className="text-gray-300">SDK for mobile and web applications</p>
                </li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-[#0A0A0A] to-[#121212] p-5 rounded-lg border border-[#333]">
              <h3 className="text-xl font-bold text-white mb-3">Innovative Vault Types</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-[#FF5AF7] mt-0.5">•</span>
                  <p className="text-gray-300">Multisig with social recovery</p>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF5AF7] mt-0.5">•</span>
                  <p className="text-gray-300">Community vaults for DAOs</p>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF5AF7] mt-0.5">•</span>
                  <p className="text-gray-300">NFT-powered dynamic vaults</p>
                </li>
              </ul>
            </div>
          </div>
          
          <p className="my-6">
            These planned enhancements to the Chronos Vault ecosystem will cement its position as the
            premier platform for secure, cross-chain digital asset management with unparalleled functionality
            for both individual and institutional users.
          </p>
          
          <div className="bg-gradient-to-r from-[#6B00D7]/5 to-[#FF5AF7]/5 p-6 rounded-lg border border-[#6B00D7]/20 text-center mt-12">
            <h3 className="text-xl font-bold bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] inline-block text-transparent bg-clip-text">Ready to Join the Future of Digital Vaults?</h3>
            <p className="text-gray-300 mt-2 mb-6">
              ChronosToken (CVT) represents a revolutionary approach to tokenomics with a genuinely deflationary model.
            </p>
            <a href="/create-vault" className="inline-block bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] text-white font-medium px-6 py-3 rounded-lg hover:from-[#5500AB] hover:to-[#FF46E8] transition-all">
              Create Your First Vault
            </a>
          </div>
        </div>
      </Container>
      </div>
    </>
  );
}