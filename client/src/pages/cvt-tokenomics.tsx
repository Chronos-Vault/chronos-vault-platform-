import React from 'react';
import { Container } from '@/components/ui/container';
import { PageHeader } from '@/components/page-header';
import { Helmet } from 'react-helmet';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Coins, 
  TrendingDown, 
  Clock, 
  BarChart4, 
  PieChart,
  Trophy,
  Lock,
  Activity,
  Layers,
  Landmark
} from "lucide-react";

// Import our new token visualization components
import { CVTDeflationaryChart } from '@/components/token/cvt-deflationary-chart';
import { CVTReleaseSchedule } from '@/components/token/cvt-release-schedule';
import { CVTDistributionChart } from '@/components/token/cvt-distribution-chart';
import { CVTTokenCard } from '@/components/token/cvt-token-card';
import { CVTStakingForm } from '@/components/token/cvt-staking-form';

// Token supply distribution data
const initialDistributionData = [
  { name: 'Private Sale', value: 5, color: '#6B00D7' },
  { name: 'Ecosystem Fund', value: 15, color: '#FF5AF7' },
  { name: 'Team & Advisors', value: 10, color: '#8F00FF' },
  { name: 'Time-Locked', value: 70, color: '#4B0082' }
];

// Time-locked release schedule data
const releasePeriods = [
  { year: 'Year 4', amount: 7.35, percentage: '50%', color: '#6B00D7' },
  { year: 'Year 8', amount: 3.675, percentage: '25%', color: '#8F00FF' },
  { year: 'Year 12', amount: 1.8375, percentage: '12.5%', color: '#A040FF' },
  { year: 'Year 16', amount: 0.91875, percentage: '6.25%', color: '#B060FF' },
  { year: 'Year 21', amount: 0.91875, percentage: '6.25%', color: '#C080FF' }
];

// Supply projection data
const supplyProjectionData = [
  { year: 'Year 0', projectedSupply: 6.3, notes: 'Initial circulation' },
  { year: 'Year 4', projectedSupply: 13.153, notes: 'After ~497K burned' },
  { year: 'Year 8', projectedSupply: 15.771, notes: 'After ~1.55M burned' },
  { year: 'Year 12', projectedSupply: 16.3455, notes: 'After ~2.82M burned' },
  { year: 'Year 16', projectedSupply: 15.95625, notes: 'After ~4.13M burned' },
  { year: 'Year 21', projectedSupply: 15.27938, notes: 'After ~5.72M burned' },
  { year: 'Year 30', projectedSupply: 12.53, notes: 'After ~8.47M burned' }
];

// Staking tiers
const stakingTiers = [
  {
    name: 'Vault Guardian',
    minimum: '1,000+ CVT',
    benefits: [
      '15% reduction on platform fees',
      'Basic analytics, up to 10 time capsules',
      '1x base voting weight',
      '1.1x base rewards'
    ],
    color: '#6B00D7'
  },
  {
    name: 'Vault Architect',
    minimum: '10,000+ CVT',
    benefits: [
      '30% reduction on platform fees',
      'Advanced analytics, AI insights, up to 50 capsules',
      '3x base voting weight',
      '1.25x base rewards'
    ],
    color: '#8F00FF'
  },
  {
    name: 'Vault Sovereign',
    minimum: '100,000+ CVT',
    benefits: [
      '50% reduction on platform fees',
      'Premium AI optimization, unlimited capsules, concierge service',
      '10x base voting weight',
      '1.5x base rewards'
    ],
    color: '#FF5AF7'
  }
];

// Time multipliers
const timeMultipliers = [
  { period: '3 months', multiplier: '1.0x', color: '#6B00D7' },
  { period: '6 months', multiplier: '1.25x', color: '#8F00FF' },
  { period: '1 year', multiplier: '1.5x', color: '#A040FF' },
  { period: '2+ years', multiplier: '2.0x', color: '#FF5AF7' }
];

export default function CVTTokenomics() {
  return (
    <>
      <Helmet>
        <title>CVT Tokenomics | ChronosVault</title>
        <meta 
          name="description" 
          content="Explore the tokenomics of ChronosToken (CVT), the native token of the Chronos Vault platform." 
        />
      </Helmet>
      
      <Container className="py-12 md:py-16">
        <PageHeader 
          heading="ChronosToken (CVT)" 
          description="A revolutionary deflationary token optimized for long-term value preservation" 
          separator
        />
        
        <div className="mt-8 mb-12 max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-[#1D1D1D]/95 to-[#151515]/95 p-6 rounded-lg border border-[#333] backdrop-blur-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]">
                <Coins className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] bg-clip-text text-transparent">
                Token Fundamentals
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              <div className="bg-[#191919] p-4 rounded-lg border border-[#333]">
                <div className="flex items-center gap-2 mb-3">
                  <Coins className="h-5 w-5 text-[#FF5AF7]" />
                  <h4 className="text-lg font-semibold text-white">Token Metrics</h4>
                </div>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex justify-between">
                    <span className="text-gray-400">Name:</span>
                    <span className="font-medium">ChronosToken</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-400">Symbol:</span>
                    <span className="font-medium">CVT</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-400">Total Supply:</span>
                    <span className="font-medium">21,000,000 CVT</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-400">Decimals:</span>
                    <span className="font-medium">9</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-[#191919] p-4 rounded-lg border border-[#333]">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingDown className="h-5 w-5 text-[#FF5AF7]" />
                  <h4 className="text-lg font-semibold text-white">Deflationary Model</h4>
                </div>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-[#FF5AF7]">•</span>
                    <span>Fixed maximum supply (21M)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#FF5AF7]">•</span>
                    <span>Continuous burning mechanism</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#FF5AF7]">•</span>
                    <span>Weekly buyback and burn events</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#FF5AF7]">•</span>
                    <span>~2% of supply burned annually</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-[#191919] p-4 rounded-lg border border-[#333]">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="h-5 w-5 text-[#FF5AF7]" />
                  <h4 className="text-lg font-semibold text-white">Time-Based Model</h4>
                </div>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-[#FF5AF7]">•</span>
                    <span>Progressive distribution over 21 years</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#FF5AF7]">•</span>
                    <span>Initial circulation: 30% (6.3M CVT)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#FF5AF7]">•</span>
                    <span>Time-locked: 70% (14.7M CVT)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#FF5AF7]">•</span>
                    <span>Halving-inspired release schedule</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-5xl mx-auto mt-12">
          <Tabs defaultValue="distribution" className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="bg-[#1A1A1A] border border-[#333]">
                <TabsTrigger value="distribution">Token Distribution</TabsTrigger>
                <TabsTrigger value="utility">Utility & Staking</TabsTrigger>
                <TabsTrigger value="economics">Supply Economics</TabsTrigger>
                <TabsTrigger value="chain">Multi-Chain</TabsTrigger>
              </TabsList>
            </div>
            
            {/* TOKEN DISTRIBUTION TAB */}
            <TabsContent value="distribution" className="mt-0">
              <div className="space-y-8">
                {/* Add our new CVT Distribution Chart component */}
                <CVTDistributionChart className="mb-8" />
                <div className="bg-gradient-to-br from-[#1D1D1D]/95 to-[#151515]/95 p-6 rounded-lg border border-[#333]">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-[#FF5AF7]" />
                    <span>Initial Token Distribution</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="col-span-1 lg:col-span-2">
                      <div className="relative w-full aspect-square max-w-md mx-auto">
                        {/* SVG Pie Chart */}
                        <svg viewBox="0 0 100 100" className="transform -rotate-90 w-full h-full">
                          <circle cx="50" cy="50" r="48" fill="#151515" stroke="#222" strokeWidth="0.5" />
                          
                          {/* SVG Pie Segments */}
                          {/* Private Sale 5% */}
                          <circle cx="50" cy="50" r="25" fill="transparent" 
                                stroke="#6B00D7" strokeWidth="50" 
                                strokeDasharray={`${5 * 3.14159 / 100 * 50} ${2 * 3.14159 * 25}`} />
                          
                          {/* Ecosystem Fund 15% */}
                          <circle cx="50" cy="50" r="25" fill="transparent" 
                                stroke="#FF5AF7" strokeWidth="50" 
                                strokeDasharray={`${15 * 3.14159 / 100 * 50} ${2 * 3.14159 * 25}`} 
                                strokeDashoffset={`${-(5 * 3.14159 / 100 * 50)}`} />
                          
                          {/* Team & Advisors 10% */}
                          <circle cx="50" cy="50" r="25" fill="transparent" 
                                stroke="#8F00FF" strokeWidth="50" 
                                strokeDasharray={`${10 * 3.14159 / 100 * 50} ${2 * 3.14159 * 25}`} 
                                strokeDashoffset={`${-((5 + 15) * 3.14159 / 100 * 50)}`} />
                          
                          {/* Time-Locked 70% */}
                          <circle cx="50" cy="50" r="25" fill="transparent" 
                                stroke="#4B0082" strokeWidth="50" 
                                strokeDasharray={`${70 * 3.14159 / 100 * 50} ${2 * 3.14159 * 25}`} 
                                strokeDashoffset={`${-((5 + 15 + 10) * 3.14159 / 100 * 50)}`} />
                          
                          <circle cx="50" cy="50" r="35" fill="#151515" />
                          <text x="50" y="45" textAnchor="middle" fill="white" className="text-lg font-bold">
                            21M
                          </text>
                          <text x="50" y="55" textAnchor="middle" fill="#FF5AF7" className="text-xs">
                            Total Supply
                          </text>
                        </svg>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-lg font-semibold mb-4">Distribution Breakdown</h4>
                        <ul className="space-y-3">
                          {initialDistributionData.map((item, index) => (
                            <li key={index} className="flex items-center gap-3">
                              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }}></div>
                              <div className="flex-1 flex justify-between">
                                <span className="text-gray-300">{item.name}</span>
                                <span className="font-semibold">{item.value}%</span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="bg-[#191919] p-4 rounded-lg border border-[#333]">
                        <h4 className="text-md font-semibold mb-3">Initial Distribution</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Initial Circulation:</span>
                            <span className="font-medium">6,300,000 CVT</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Time-Locked:</span>
                            <span className="font-medium">14,700,000 CVT</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#151515] p-6 rounded-lg border border-[#333]">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-[#FF5AF7]" />
                    <span>Time-Locked Release Schedule</span>
                  </h3>
                  
                  <div className="overflow-x-auto">
                    <div className="min-w-[768px]">
                      <div className="h-16 relative mb-4">
                        <div className="absolute inset-0 flex">
                          {releasePeriods.map((period, i) => (
                            <div 
                              key={i} 
                              className="flex-1 h-full flex items-center justify-center font-medium text-white"
                            >
                              {period.year}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="h-24 relative mb-6">
                        <div className="absolute inset-0 flex">
                          {releasePeriods.map((period, i) => (
                            <div 
                              key={i} 
                              className="flex-1 h-full px-1"
                            >
                              <div className="h-full rounded-lg flex flex-col items-center justify-center text-white" 
                                   style={{ backgroundColor: period.color }}>
                                <div className="text-lg font-bold">{period.amount}M</div>
                                <div className="text-sm opacity-80">{period.percentage}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="relative h-2 bg-[#222] rounded-full mb-10">
                        <div className="absolute top-0 bottom-0 left-0 right-0 flex">
                          {releasePeriods.map((period, i) => (
                            <div key={i} className="flex-1 flex items-center justify-center">
                              <div className="h-4 w-4 rounded-full bg-[#151515] border-2 border-white z-10"></div>
                              {i < releasePeriods.length - 1 ? (
                                <div className="h-0.5 bg-white flex-1"></div>
                              ) : null}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="px-6">
                        <div className="bg-[#1D1D1D] p-4 rounded-lg border border-[#333]">
                          <h4 className="text-md font-semibold mb-3">About the Release Schedule</h4>
                          <p className="text-gray-300 text-sm">
                            The time-locked tokens (70% of total supply) are released gradually over 21 years, with decreasing
                            amounts in each period, similar to Bitcoin's halving mechanism but in reverse. This creates a
                            predictable, transparent release schedule that ensures long-term sustainability while maintaining scarcity.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* UTILITY & STAKING TAB */}
            <TabsContent value="utility" className="mt-0">
              <div className="space-y-8">
                <div className="bg-gradient-to-br from-[#1D1D1D]/95 to-[#151515]/95 p-6 rounded-lg border border-[#333] mb-8">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Lock className="h-5 w-5 text-[#FF5AF7]" />
                    <span>Staking & Benefits Summary</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {stakingTiers.map((tier, index) => (
                      <div key={index} className="bg-[#191919] p-4 rounded-lg border border-[#333]">
                        <div className="flex items-center gap-2 mb-3">
                          <Trophy className="h-5 w-5" style={{ color: tier.color }} />
                          <h4 className="text-lg font-semibold text-white">{tier.name}</h4>
                        </div>
                        <div className="mb-3 inline-block px-2 py-1 rounded-full bg-[#222] text-sm">
                          {tier.minimum}
                        </div>
                        <ul className="space-y-2 text-gray-300">
                          {tier.benefits.map((benefit, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <span style={{ color: tier.color }}>•</span>
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 text-center text-gray-400 text-sm">
                    <p>To stake your tokens and access these benefits, please visit the <a href="/cvt-token" className="text-[#FF5AF7] hover:underline">CVT Token</a> page</p>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-[#1D1D1D]/95 to-[#151515]/95 p-6 rounded-lg border border-[#333]">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Coins className="h-5 w-5 text-[#FF5AF7]" />
                    <span>Token Utility</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="bg-[#191919] p-4 rounded-lg border border-[#333]">
                        <h4 className="text-md font-semibold mb-3 flex items-center gap-2">
                          <Landmark className="h-4 w-4 text-[#FF5AF7]" />
                          Platform Fee Payment
                        </h4>
                        <p className="text-gray-300 text-sm">
                          CVT is the primary token for paying all platform fees including vault creation,
                          cross-chain operations, and premium feature access. Using CVT for fees provides a discount
                          compared to paying with other cryptocurrencies.
                        </p>
                      </div>
                      
                      <div className="bg-[#191919] p-4 rounded-lg border border-[#333]">
                        <h4 className="text-md font-semibold mb-3 flex items-center gap-2">
                          <Activity className="h-4 w-4 text-[#FF5AF7]" />
                          Governance Rights
                        </h4>
                        <p className="text-gray-300 text-sm">
                          CVT holders can participate in platform governance, with voting power determined
                          by the amount staked and the duration of the stake. Higher tier stakers receive
                          greater weight in governance decisions.
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="bg-[#191919] p-4 rounded-lg border border-[#333]">
                        <h4 className="text-md font-semibold mb-3 flex items-center gap-2">
                          <Lock className="h-4 w-4 text-[#FF5AF7]" />
                          Premium Feature Access
                        </h4>
                        <p className="text-gray-300 text-sm">
                          Certain advanced features on the platform require holding a minimum amount of CVT tokens.
                          Higher-tier holders gain access to exclusive functionality like AI-enhanced security,
                          advanced analytics, and unlimited vault creation.
                        </p>
                      </div>
                      
                      <div className="bg-[#191919] p-4 rounded-lg border border-[#333]">
                        <h4 className="text-md font-semibold mb-3 flex items-center gap-2">
                          <Layers className="h-4 w-4 text-[#FF5AF7]" />
                          Chain-Specific Utility
                        </h4>
                        <p className="text-gray-300 text-sm">
                          CVT serves different purposes across supported blockchains:
                        </p>
                        <ul className="mt-2 space-y-1 text-xs text-gray-300">
                          <li className="flex gap-2">
                            <span className="text-[#FF5AF7]">•</span>
                            <span><strong>TON:</strong> Primary fee token, vault security</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="text-[#FF5AF7]">•</span>
                            <span><strong>Ethereum:</strong> DeFi strategy access, yield optimization</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="text-[#FF5AF7]">•</span>
                            <span><strong>Solana:</strong> High-speed features, asset transfers</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#151515] p-6 rounded-lg border border-[#333]">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-[#FF5AF7]" />
                    <span>Advanced Staking System</span>
                  </h3>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold mb-4">Staking Tiers</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {stakingTiers.map((tier, index) => (
                          <div 
                            key={index} 
                            className="bg-[#191919] p-4 rounded-lg border border-[#333] flex flex-col"
                            style={{ borderLeftColor: tier.color, borderLeftWidth: '4px' }}
                          >
                            <div className="mb-3">
                              <h5 className="text-lg font-semibold text-white mb-1">{tier.name}</h5>
                              <div className="text-sm font-medium text-[#FF5AF7]">{tier.minimum}</div>
                            </div>
                            
                            <div className="flex-grow">
                              <ul className="space-y-2 text-sm text-gray-300">
                                {tier.benefits.map((benefit, i) => (
                                  <li key={i} className="flex gap-2">
                                    <span className="text-[#FF5AF7]">•</span>
                                    <span>{benefit}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-semibold mb-4">Time-Based Multipliers</h4>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {timeMultipliers.map((time, index) => (
                          <div 
                            key={index} 
                            className="bg-[#191919] p-4 rounded-lg border border-[#333] text-center"
                          >
                            <div className="h-12 w-12 flex items-center justify-center bg-black/30 rounded-full mx-auto mb-3" 
                                 style={{ backgroundColor: `${time.color}20` }}>
                              <Clock className="h-6 w-6" style={{ color: time.color }} />
                            </div>
                            <div className="text-lg font-semibold text-white mb-1">{time.multiplier}</div>
                            <div className="text-sm text-gray-400">{time.period}</div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-6 px-6">
                        <div className="bg-[#1D1D1D] p-4 rounded-lg border border-[#333]">
                          <h4 className="text-md font-semibold mb-3">Combined Multipliers</h4>
                          <p className="text-gray-300 text-sm">
                            Staking rewards compound based on both tier and time multipliers. For example, a Vault Sovereign (1.5x)
                            staking for 2+ years (2.0x) would receive a combined 3.0x multiplier on base rewards, significantly
                            increasing their yield.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* SUPPLY ECONOMICS TAB */}
            <TabsContent value="economics" className="mt-0">
              <div className="space-y-8">
                {/* Add our new CVT Deflationary Chart component */}
                <CVTDeflationaryChart className="mb-8" />
                
                {/* Add our new CVT Release Schedule component */}
                <CVTReleaseSchedule className="mb-8" />
                <div className="bg-gradient-to-br from-[#1D1D1D]/95 to-[#151515]/95 p-6 rounded-lg border border-[#333]">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <TrendingDown className="h-5 w-5 text-[#FF5AF7]" />
                    <span>Deflationary Mechanisms</span>
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-[#191919] p-4 rounded-lg border border-[#333]">
                        <h4 className="text-md font-semibold mb-3">Token Burning</h4>
                        <p className="text-gray-300 text-sm mb-3">
                          The CVT burning mechanism is implemented through an autonomous smart contract that:
                        </p>
                        <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-300">
                          <li>Collects platform fees in native blockchain currencies</li>
                          <li>Converts collected fees to stablecoins through DEXs</li>
                          <li>Purchases CVT tokens from public liquidity pools</li>
                          <li>Permanently burns the purchased tokens</li>
                        </ol>
                      </div>
                      
                      <div className="bg-[#191919] p-4 rounded-lg border border-[#333]">
                        <h4 className="text-md font-semibold mb-3">Fee Allocation</h4>
                        <div className="h-32 relative mb-4">
                          <div className="absolute inset-0">
                            <svg viewBox="0 0 100 60" className="w-full h-full">
                              <rect width="60" height="20" x="20" y="0" fill="#6B00D7" rx="2" />
                              <text x="50" y="13" textAnchor="middle" fill="white" fontSize="8">60% Token Buybacks & Burns</text>
                              
                              <rect width="40" height="20" x="30" y="24" fill="#FF5AF7" rx="2" />
                              <text x="50" y="37" textAnchor="middle" fill="white" fontSize="8">40% Development & Operations</text>
                            </svg>
                          </div>
                        </div>
                        <div className="text-sm text-gray-300">
                          <p className="mb-2">
                            <span className="inline-block w-3 h-3 bg-[#6B00D7] mr-2"></span>
                            60% of platform fees are directed to the Treasury for token buybacks and burns
                          </p>
                          <p>
                            <span className="inline-block w-3 h-3 bg-[#FF5AF7] mr-2"></span>
                            40% of platform fees fund ongoing development and operations
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-[#1D1D1D] p-4 rounded-lg border border-[#333]">
                      <h4 className="text-md font-semibold mb-3">Burn Transparency</h4>
                      <p className="text-gray-300 text-sm">
                        All CVT burns are publicly verifiable on-chain, with weekly buyback and burn events. 
                        The system targets an average burn rate of 2% of circulating supply annually, which 
                        accelerates as platform usage grows.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#151515] p-6 rounded-lg border border-[#333]">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <BarChart4 className="h-5 w-5 text-[#FF5AF7]" />
                    <span>Supply Projection</span>
                  </h3>
                  
                  <div className="overflow-x-auto">
                    <div className="min-w-[768px] mb-6">
                      <div className="h-48 relative mb-6">
                        <div className="absolute inset-0">
                          <svg viewBox="0 0 700 200" className="w-full h-full">
                            {/* Grid lines */}
                            <line x1="50" y1="20" x2="50" y2="180" stroke="#333" />
                            <line x1="50" y1="180" x2="650" y2="180" stroke="#333" />
                            
                            {/* Y-axis labels */}
                            <text x="45" y="180" textAnchor="end" fill="#777" fontSize="10">0</text>
                            <text x="45" y="145" textAnchor="end" fill="#777" fontSize="10">5M</text>
                            <text x="45" y="110" textAnchor="end" fill="#777" fontSize="10">10M</text>
                            <text x="45" y="75" textAnchor="end" fill="#777" fontSize="10">15M</text>
                            <text x="45" y="40" textAnchor="end" fill="#777" fontSize="10">20M</text>
                            
                            {/* X-axis labels and tick marks */}
                            {supplyProjectionData.map((data, i) => {
                              const x = 50 + (i * 100);
                              return (
                                <g key={i}>
                                  <line x1={x} y1="180" x2={x} y2="185" stroke="#333" />
                                  <text x={x} y="195" textAnchor="middle" fill="#777" fontSize="10">{data.year}</text>
                                </g>
                              );
                            })}
                            
                            {/* Data points and lines */}
                            <polyline 
                              points={`
                                ${50} ${180 - (6.3/21*160)}
                                ${150} ${180 - (13.153/21*160)}
                                ${250} ${180 - (15.771/21*160)}
                                ${350} ${180 - (16.3455/21*160)}
                                ${450} ${180 - (15.95625/21*160)}
                                ${550} ${180 - (15.27938/21*160)}
                                ${650} ${180 - (12.53/21*160)}
                              `}
                              fill="none" 
                              stroke="url(#gradientLine)" 
                              strokeWidth="3" 
                            />
                            
                            <defs>
                              <linearGradient id="gradientLine" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#6B00D7" />
                                <stop offset="100%" stopColor="#FF5AF7" />
                              </linearGradient>
                            </defs>
                            
                            {/* Data points */}
                            {supplyProjectionData.map((data, i) => {
                              const x = 50 + (i * 100);
                              const y = 180 - (data.projectedSupply/21*160);
                              return (
                                <g key={i}>
                                  <circle cx={x} cy={y} r="5" fill="#FF5AF7" />
                                  <text x={x} y={y-10} textAnchor="middle" fill="white" fontSize="10">
                                    {data.projectedSupply}M
                                  </text>
                                </g>
                              );
                            })}
                            
                            {/* Title */}
                            <text x="350" y="15" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
                              CVT Supply Projection (Conservative Estimate)
                            </text>
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    <div className="overflow-auto">
                      <table className="min-w-full border border-[#333] text-sm">
                        <thead>
                          <tr className="bg-[#1A1A1A]">
                            <th className="p-3 text-left border-b border-[#333]">Period</th>
                            <th className="p-3 text-left border-b border-[#333]">Projected Supply</th>
                            <th className="p-3 text-left border-b border-[#333]">Cumulative Burned</th>
                            <th className="p-3 text-left border-b border-[#333]">Notes</th>
                          </tr>
                        </thead>
                        <tbody>
                          {supplyProjectionData.map((data, i) => (
                            <tr key={i} className="border-b border-[#333] hover:bg-[#1D1D1D]">
                              <td className="p-3 font-medium">{data.year}</td>
                              <td className="p-3">{data.projectedSupply}M CVT</td>
                              <td className="p-3">{data.notes.includes('burned') ? data.notes.split('~')[1]?.split(' ')[0] + ' CVT' : '-'}</td>
                              <td className="p-3 text-gray-400">{data.notes}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-[#1D1D1D]/95 to-[#151515]/95 p-6 rounded-lg border border-[#333]">
                  <h3 className="text-xl font-bold mb-6">CVT vs. Bitcoin Comparison</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[#191919] p-4 rounded-lg border border-[#333]">
                      <h4 className="text-md font-semibold mb-3 text-[#FF5AF7]">Key Differentiators</h4>
                      <ul className="space-y-3 text-sm text-gray-300">
                        <li className="space-y-1">
                          <div className="font-medium">Fixed Maximum vs. Decreasing Total</div>
                          <p className="text-gray-400">Bitcoin's supply approaches but never exceeds 21 million. CVT starts at 21 million and continuously decreases.</p>
                        </li>
                        <li className="space-y-1">
                          <div className="font-medium">Mining vs. Burning</div>
                          <p className="text-gray-400">Bitcoin releases new tokens through mining until reaching maximum supply. CVT permanently removes tokens from circulation through burning.</p>
                        </li>
                        <li className="space-y-1">
                          <div className="font-medium">Supply Trajectory</div>
                          <p className="text-gray-400">Bitcoin's supply curve is asymptotic (approaching but never reaching 21 million). CVT's supply curve is consistently negative (starting at 21 million and perpetually decreasing).</p>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="bg-[#191919] p-4 rounded-lg border border-[#333]">
                      <h4 className="text-md font-semibold mb-3 text-[#FF5AF7]">Mathematical Scarcity Model</h4>
                      <p className="text-sm text-gray-300 mb-4">
                        CVT's deflationary model implements mathematical scarcity that intensifies over time, creating a token
                        optimized for long-term value preservation. The combination of time-locked distribution and continuous
                        burning creates a supply curve that is fundamentally different from other cryptocurrencies.
                      </p>
                      <div className="h-24 relative">
                        <div className="absolute inset-0">
                          <svg viewBox="0 0 300 100" className="w-full h-full">
                            {/* Axes */}
                            <line x1="30" y1="20" x2="30" y2="80" stroke="#555" />
                            <line x1="30" y1="80" x2="280" y2="80" stroke="#555" />
                            <text x="155" y="95" textAnchor="middle" fill="#777" fontSize="10">Time</text>
                            <text x="20" y="50" textAnchor="middle" fill="#777" fontSize="10" transform="rotate(-90 20,50)">Supply</text>
                            
                            {/* Bitcoin curve */}
                            <path d="M30,80 Q90,60 150,50 T280,45" stroke="#F7931A" strokeWidth="2" fill="none" />
                            <text x="280" y="45" textAnchor="start" fill="#F7931A" fontSize="10" dx="5">BTC</text>
                            
                            {/* CVT curve */}
                            <path d="M30,80 L70,45 L150,40 L220,35 L280,25" stroke="url(#cvtLine)" strokeWidth="2" fill="none" />
                            <text x="280" y="25" textAnchor="start" fill="#FF5AF7" fontSize="10" dx="5">CVT</text>
                            
                            <defs>
                              <linearGradient id="cvtLine" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#6B00D7" />
                                <stop offset="100%" stopColor="#FF5AF7" />
                              </linearGradient>
                            </defs>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* MULTI-CHAIN TAB */}
            <TabsContent value="chain" className="mt-0">
              <div className="space-y-8">
                <div className="bg-gradient-to-br from-[#1D1D1D]/95 to-[#151515]/95 p-6 rounded-lg border border-[#333]">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Layers className="h-5 w-5 text-[#FF5AF7]" />
                    <span>Cross-Chain Implementation</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="text-lg font-semibold mb-4">Bridge Mechanics</h4>
                      <ul className="space-y-3 text-sm text-gray-300">
                        <li className="flex items-start gap-2">
                          <span className="text-[#FF5AF7] mt-1">•</span>
                          <div>
                            <p className="font-medium">Wrapping Mechanism</p>
                            <p className="text-gray-400">Lock tokens on source chain, mint equivalent on destination chain</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#FF5AF7] mt-1">•</span>
                          <div>
                            <p className="font-medium">Unwrapping</p>
                            <p className="text-gray-400">Burn tokens on destination chain, unlock on source chain</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#FF5AF7] mt-1">•</span>
                          <div>
                            <p className="font-medium">Bridge Security</p>
                            <p className="text-gray-400">Multi-sig validators with economic security bonds</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#FF5AF7] mt-1">•</span>
                          <div>
                            <p className="font-medium">Cross-Chain Accounting</p>
                            <p className="text-gray-400">Total supply remains consistent across all chains</p>
                          </div>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg viewBox="0 0 320 200" className="w-full h-full">
                          {/* TON */}
                          <circle cx="160" cy="60" r="40" fill="url(#tonGradient)" />
                          <text x="160" y="60" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">TON</text>
                          <text x="160" y="75" textAnchor="middle" fill="white" fontSize="10">Native Token</text>
                          
                          {/* Ethereum */}
                          <circle cx="80" cy="140" r="40" fill="url(#ethGradient)" />
                          <text x="80" y="140" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">ETH</text>
                          <text x="80" y="155" textAnchor="middle" fill="white" fontSize="10">Wrapped</text>
                          
                          {/* Solana */}
                          <circle cx="240" cy="140" r="40" fill="url(#solGradient)" />
                          <text x="240" y="140" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">SOL</text>
                          <text x="240" y="155" textAnchor="middle" fill="white" fontSize="10">Wrapped</text>
                          
                          {/* Connecting lines */}
                          <line x1="129" y1="84" x2="105" y2="116" stroke="#6B00D7" strokeWidth="2" />
                          <line x1="191" y1="84" x2="215" y2="116" stroke="#6B00D7" strokeWidth="2" />
                          <line x1="115" y1="157" x2="205" y2="157" stroke="#6B00D7" strokeWidth="2" />
                          
                          {/* Gradients */}
                          <defs>
                            <linearGradient id="tonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#0088CC" />
                              <stop offset="100%" stopColor="#007ACC" />
                            </linearGradient>
                            
                            <linearGradient id="ethGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#6B7280" />
                              <stop offset="100%" stopColor="#4B5563" />
                            </linearGradient>
                            
                            <linearGradient id="solGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#9945FF" />
                              <stop offset="100%" stopColor="#6A36FC" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-[#191919] p-4 rounded-lg border border-[#333]">
                      <h4 className="text-md font-semibold mb-3">TON Implementation</h4>
                      <ul className="space-y-2 text-sm text-gray-300">
                        <li className="flex items-start gap-2">
                          <span className="text-[#FF5AF7]">•</span>
                          <span>Native Jetton standard</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#FF5AF7]">•</span>
                          <span>Primary token with all features</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#FF5AF7]">•</span>
                          <span>Base layer for time-lock mechanics</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="bg-[#191919] p-4 rounded-lg border border-[#333]">
                      <h4 className="text-md font-semibold mb-3">Ethereum Implementation</h4>
                      <ul className="space-y-2 text-sm text-gray-300">
                        <li className="flex items-start gap-2">
                          <span className="text-[#FF5AF7]">•</span>
                          <span>ERC-20 with EIP-2612 extensions</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#FF5AF7]">•</span>
                          <span>Compatible with DeFi protocols</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#FF5AF7]">•</span>
                          <span>Gas optimization for Ethereum mainnet</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="bg-[#191919] p-4 rounded-lg border border-[#333]">
                      <h4 className="text-md font-semibold mb-3">Solana Implementation</h4>
                      <ul className="space-y-2 text-sm text-gray-300">
                        <li className="flex items-start gap-2">
                          <span className="text-[#FF5AF7]">•</span>
                          <span>SPL Token standard</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#FF5AF7]">•</span>
                          <span>High-throughput transaction capability</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#FF5AF7]">•</span>
                          <span>Metaplex metadata extension</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#151515] p-6 rounded-lg border border-[#333]">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Activity className="h-5 w-5 text-[#FF5AF7]" />
                    <span>Cross-Chain Benefits</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[#191919] p-4 rounded-lg border border-[#333]">
                      <h4 className="text-md font-semibold mb-3">Reduced Fees</h4>
                      <p className="text-sm text-gray-300 mb-3">
                        CVT stakers receive significant reductions on cross-chain transfer fees based on their tier:
                      </p>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <div className="w-24 text-sm text-gray-400">Guardian:</div>
                          <div className="flex-1 bg-[#111] rounded-full h-3">
                            <div className="h-full rounded-full bg-[#6B00D7]" style={{ width: '15%' }}></div>
                          </div>
                          <div className="w-10 text-right text-sm ml-2">15%</div>
                        </div>
                        <div className="flex items-center">
                          <div className="w-24 text-sm text-gray-400">Architect:</div>
                          <div className="flex-1 bg-[#111] rounded-full h-3">
                            <div className="h-full rounded-full bg-[#8F00FF]" style={{ width: '30%' }}></div>
                          </div>
                          <div className="w-10 text-right text-sm ml-2">30%</div>
                        </div>
                        <div className="flex items-center">
                          <div className="w-24 text-sm text-gray-400">Sovereign:</div>
                          <div className="flex-1 bg-[#111] rounded-full h-3">
                            <div className="h-full rounded-full bg-[#FF5AF7]" style={{ width: '50%' }}></div>
                          </div>
                          <div className="w-10 text-right text-sm ml-2">50%</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-[#191919] p-4 rounded-lg border border-[#333]">
                      <h4 className="text-md font-semibold mb-3">Additional Benefits</h4>
                      <ul className="space-y-3 text-sm text-gray-300">
                        <li className="flex items-start gap-2">
                          <span className="text-[#FF5AF7] mt-1">•</span>
                          <div>
                            <p className="font-medium">Priority Processing</p>
                            <p className="text-gray-400">Stakers receive priority transaction processing across all supported chains</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#FF5AF7] mt-1">•</span>
                          <div>
                            <p className="font-medium">Investment Opportunities</p>
                            <p className="text-gray-400">Special access to cross-chain investment opportunities</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#FF5AF7] mt-1">•</span>
                          <div>
                            <p className="font-medium">Security Score Boost</p>
                            <p className="text-gray-400">Enhanced security score for cross-chain vaults</p>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="mt-20 max-w-3xl mx-auto text-center">
          <div className="bg-gradient-to-r from-[#6B00D7]/10 to-[#FF5AF7]/10 rounded-lg border border-[#6B00D7]/30 p-6">
            <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] bg-clip-text text-transparent">Experience the Future of Value</h3>
            <p className="text-gray-300 mb-6">
              ChronosToken (CVT) represents a paradigm shift in tokenomics - a deflationary token that becomes more scarce and valuable over time.
            </p>
            <a href="/whitepaper">
              <button className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] text-white px-6 py-3 rounded-lg font-semibold hover:from-[#5500AB] hover:to-[#FF46E8] transition-all">
                Read the Full Whitepaper
              </button>
            </a>
          </div>
        </div>
      </Container>
    </>
  );
}