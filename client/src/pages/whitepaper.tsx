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
          
          <ol>
            <li><a href="#introduction">Introduction</a></li>
            <li><a href="#token-economics">Token Economics</a></li>
            <li><a href="#value-accrual">Value Accrual Mechanisms</a></li>
            <li><a href="#utility-and-governance">Utility and Governance</a></li>
            <li><a href="#cross-chain-architecture">Cross-Chain Architecture</a></li>
            <li><a href="#security-model">Security Model</a></li>
            <li><a href="#implementation-timeline">Implementation Timeline</a></li>
            <li><a href="#technical-implementation">Technical Implementation</a></li>
            <li><a href="#risk-assessment">Risk Assessment</a></li>
            <li><a href="#team-and-advisors">Team and Advisors</a></li>
            <li><a href="#legal-and-compliance">Legal and Compliance</a></li>
            <li><a href="#references">References</a></li>
          </ol>
          
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
        </div>
      </Container>
    </>
  );
}