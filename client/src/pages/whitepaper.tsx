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
          
          <p>
            CVT token holders gain access to premium vault features based on their token holdings
            and staking tier. These features enhance security, functionality, and value of vaults:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            <div className="bg-gradient-to-br from-[#0F0F0F] to-[#121212] p-5 rounded-lg border border-[#333]">
              <h3 className="text-xl font-bold text-white mb-3">Advanced Security Features</h3>
              
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <span className="text-[#FF5AF7] mt-1 font-bold">•</span>
                  <div>
                    <p className="font-medium text-white">Multi-signature Authentication</p>
                    <p className="text-gray-400">Require multiple authorized parties to approve vault access</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF5AF7] mt-1 font-bold">•</span>
                  <div>
                    <p className="font-medium text-white">Quantum-resistant Encryption</p>
                    <p className="text-gray-400">Future-proof encryption algorithms secure against quantum computing attacks</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF5AF7] mt-1 font-bold">•</span>
                  <div>
                    <p className="font-medium text-white">AI Security Monitoring</p>
                    <p className="text-gray-400">Advanced machine learning algorithms detect suspicious activity</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-[#0F0F0F] to-[#121212] p-5 rounded-lg border border-[#333]">
              <h3 className="text-xl font-bold text-white mb-3">Premium Vault Types</h3>
              
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <span className="text-[#FF5AF7] mt-1 font-bold">•</span>
                  <div>
                    <p className="font-medium text-white">Geolocation Vaults</p>
                    <p className="text-gray-400">Vaults that can only be accessed from specific geographic locations</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF5AF7] mt-1 font-bold">•</span>
                  <div>
                    <p className="font-medium text-white">Conditional Trigger Vaults</p>
                    <p className="text-gray-400">Automated vault unlocking based on custom blockchain events</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF5AF7] mt-1 font-bold">•</span>
                  <div>
                    <p className="font-medium text-white">Multi-generational Transfer Vaults</p>
                    <p className="text-gray-400">Structured inheritance vaults with customized access schedules</p>
                  </div>
                </li>
              </ul>
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
          
          <p>
            The CVT staking system implements three progressive tiers with increasing benefits.
            Higher tiers require larger token stakes but provide substantially better platform
            benefits and reduced fees:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
            <div className="bg-gradient-to-br from-[#0A0A0A] to-[#121212] p-5 rounded-lg border border-[#333] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#6B00D7]/20 to-transparent rounded-bl-full"></div>
              
              <h3 className="text-xl font-bold text-white mb-2">Vault Guardian</h3>
              <p className="text-[#FF5AF7] font-medium mb-4">1,000+ CVT</p>
              
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-[#FF5AF7] mt-0.5">✓</span>
                  <p className="text-gray-300">75% reduction in platform fees</p>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF5AF7] mt-0.5">✓</span>
                  <p className="text-gray-300">2x voting power in governance</p>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF5AF7] mt-0.5">✓</span>
                  <p className="text-gray-300">Access to premium investment strategies</p>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF5AF7] mt-0.5">✓</span>
                  <p className="text-gray-300">Beta feature access</p>
                </li>
              </ul>
              
              <div className="mt-4 text-sm text-gray-400">
                Minimum stake duration: 6 months
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-[#0A0A0A] to-[#121212] p-5 rounded-lg border border-[#333] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#8F00FF]/20 to-transparent rounded-bl-full"></div>
              
              <h3 className="text-xl font-bold text-white mb-2">Vault Architect</h3>
              <p className="text-[#8F00FF] font-medium mb-4">10,000+ CVT</p>
              
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-[#8F00FF] mt-0.5">✓</span>
                  <p className="text-gray-300">90% reduction in platform fees</p>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#8F00FF] mt-0.5">✓</span>
                  <p className="text-gray-300">5x voting power in governance</p>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#8F00FF] mt-0.5">✓</span>
                  <p className="text-gray-300">2% of platform fees distributed to stakers</p>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#8F00FF] mt-0.5">✓</span>
                  <p className="text-gray-300">Priority access to new features</p>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#8F00FF] mt-0.5">✓</span>
                  <p className="text-gray-300">Enhanced security verification</p>
                </li>
              </ul>
              
              <div className="mt-4 text-sm text-gray-400">
                Minimum stake duration: 1 year
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-[#0A0A0A] to-[#121212] p-5 rounded-lg border border-[#333] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#FF5AF7]/20 to-transparent rounded-bl-full"></div>
              
              <h3 className="text-xl font-bold text-white mb-2">Vault Sovereign</h3>
              <p className="text-[#FF5AF7] font-medium mb-4">100,000+ CVT</p>
              
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-[#FF5AF7] mt-0.5">✓</span>
                  <p className="text-gray-300">100% reduction in platform fees</p>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF5AF7] mt-0.5">✓</span>
                  <p className="text-gray-300">25x voting power in governance</p>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF5AF7] mt-0.5">✓</span>
                  <p className="text-gray-300">5% of platform fees distributed to stakers</p>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF5AF7] mt-0.5">✓</span>
                  <p className="text-gray-300">Direct treasury voting rights</p>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF5AF7] mt-0.5">✓</span>
                  <p className="text-gray-300">Custom API/integration options</p>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF5AF7] mt-0.5">✓</span>
                  <p className="text-gray-300">Military-grade security features</p>
                </li>
              </ul>
              
              <div className="mt-4 text-sm text-gray-400">
                Minimum stake duration: 3 years
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
    </>
  );
}