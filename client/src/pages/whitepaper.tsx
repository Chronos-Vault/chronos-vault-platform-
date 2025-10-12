import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'wouter';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ChevronLeft, 
  Download, 
  FileText, 
  Coins, 
  Users, 
  Flame, 
  LockKeyhole, 
  BarChart3, 
  Shield, 
  Database,
  Globe,
  Clock,
  Cpu,
  Network,
  Layers
} from "lucide-react";
// Staking Tier Benefits Comparison Chart (2D)
const StakingTiersBenefitsChart = () => {
  // Staking tier benefits data
  const stakingTiers = [
    { 
      name: "Vault Guardian", 
      amount: 1000, 
      benefits: {
        feeReduction: 75,
        maxVaults: 10,
        securityScore: 60,
        supportLevel: 40
      }, 
      color: "#6B00D7" 
    },
    { 
      name: "Vault Architect", 
      amount: 10000, 
      benefits: {
        feeReduction: 90,
        maxVaults: 50,
        securityScore: 80,
        supportLevel: 70
      }, 
      color: "#FF5AF7" 
    },
    { 
      name: "Vault Sovereign", 
      amount: 100000, 
      benefits: {
        feeReduction: 100,
        maxVaults: 999,
        securityScore: 100,
        supportLevel: 100
      }, 
      color: "#0098EA" 
    }
  ];

  return (
    <div className="h-[500px] w-full rounded-xl overflow-hidden bg-[#0A0A0A] border border-[#6B00D7]/20 p-6">
      <div className="flex flex-col h-full">
        <h3 className="text-center text-xl font-bold mb-6">Staking Tiers Benefits Comparison</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stakingTiers.map((tier) => (
            <div key={tier.name} className="flex flex-col">
              <div className="p-3 text-center rounded-t-lg" style={{ backgroundColor: tier.color }}>
                <h4 className="font-bold text-lg text-white">{tier.name}</h4>
                <div className="text-white text-sm">{tier.amount.toLocaleString()} CVT</div>
              </div>
              
              <div className="bg-black/50 p-5 rounded-b-lg flex-1">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-[#FF5AF7] mr-2"></div>
                      <span className="text-sm">Fee Reduction</span>
                    </div>
                    <span className="font-bold">{tier.benefits.feeReduction}%</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-[#0098EA] mr-2"></div>
                      <span className="text-sm">Max Vaults</span>
                    </div>
                    <span className="font-bold">{tier.benefits.maxVaults}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-[#6B00D7] mr-2"></div>
                      <span className="text-sm">Security Score</span>
                    </div>
                    <span className="font-bold">{tier.benefits.securityScore}%</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-[#14F195] mr-2"></div>
                      <span className="text-sm">Support Level</span>
                    </div>
                    <span className="font-bold">{tier.benefits.supportLevel}%</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const WhitepaperPage = () => {
  const [_, setLocation] = useLocation();
  const [selectedTab, setSelectedTab] = useState("overview");
  
  // Whitepaper sections
  const whitepaperSections = {
    overview: {
      title: "Chronos Vault: The Future of Digital Time Vaults",
      intro: "Chronos Vault represents a paradigm shift in how individuals and organizations secure digital assets across time. Combining cutting-edge blockchain technology with intuitive user experience, Chronos Vault creates a global network of tamper-proof digital time vaults.",
      highlights: [
        "Triple-Chain Security Architecture",
        "Cross-Chain Asset Protection",
        "Zero-Knowledge Privacy Layer",
        "Decentralized Time-Lock Mechanisms",
        "AI-Enhanced Security Monitoring"
      ]
    },
    architecture: {
      title: "Trinity Protocol - Fixed Layer Architecture",
      description: "The Chronos Vault platform implements Trinity Protocol where each blockchain serves a dedicated security role. Ethereum Layer 2 (Arbitrum) deployment provides primary security with 95% lower fees, while Solana and TON provide rapid validation and quantum-resistant backup with 2-of-3 mathematical consensus protecting all operations:",
      layers: [
        {
          name: "Ethereum Layer 2 (Arbitrum): Primary Security",
          role: "Immutable ownership records via Arbitrum Layer 2 for affordable security",
          features: [
            "Primary Security layer with maximum decentralization",
            "Layer 2 deployment reduces fees by 95%",
            "Immutable vault ownership and access control",
            "Enterprise-grade security at affordable cost"
          ]
        },
        {
          name: "Solana: Rapid Validation",
          role: "High-frequency monitoring and state verification",
          features: [
            "Lightning-fast transaction verification",
            "Real-time security monitoring across vault operations",
            "High-throughput state synchronization",
            "Ultra-low latency consensus participation"
          ]
        },
        {
          name: "TON: Recovery System",
          role: "Quantum-resistant backup and recovery layer",
          features: [
            "Post-quantum cryptographic protection",
            "Secure backup and recovery mechanisms",
            "Long-term asset protection infrastructure",
            "Cutting-edge security for future-proofing"
          ]
        }
      ]
    },
    formalVerification: {
      title: "Formal Verification & Mathematical Security (In Development)",
      description: "Our development roadmap includes building the world's first fully mathematically verified vault platform. Unlike traditional audits that find bugs, formal verification mathematically proves security properties cannot be violated.",
      targets: {
        lean4Theorems: 35,
        certoraRules: 34,
        tlaModels: 1
      },
      layers: [
        {
          name: "Lean 4 Formal Proofs",
          description: "Target: 35 theorems covering smart contracts, cryptography, and consensus",
          coverage: [
            "Smart Contracts: 13 theorems (ChronosVault, CVTBridge, CrossChainBridge)",
            "Cryptography: 13 theorems (VDF, MPC, ZK, Quantum-Resistant)",
            "Consensus: 9 theorems (Trinity Protocol, AI Governance)"
          ]
        },
        {
          name: "Certora Verification",
          description: "Target: 34 security rules for Solidity smart contracts",
          coverage: [
            "Invariant verification for vault ownership",
            "Time-lock enforcement proofs",
            "Multi-signature consensus validation",
            "Cross-chain state consistency checks"
          ]
        },
        {
          name: "TLA+ Specification",
          description: "Planned: Distributed consensus model for Trinity Protocol",
          coverage: [
            "2-of-3 consensus algorithm verification",
            "Circuit breaker safety properties",
            "State synchronization correctness",
            "Byzantine fault tolerance validation"
          ]
        }
      ],
      guarantee: "Every security claim will be backed by cryptographic proofs, not just auditor promises"
    },
    vaultTypes: {
      title: "Specialized Vault Types",
      description: "Chronos Vault offers various specialized vault types tailored to specific security needs:",
      types: [
        {
          name: "Multi-Signature Vault",
          description: "Require multiple approvals for asset access and transfers",
          features: [
            "Customizable M-of-N approval threshold",
            "Role-based access control",
            "Time-bounded approval windows",
            "Approval sequencing options"
          ]
        },
        {
          name: "Geolocation Vault",
          description: "Unlock assets only when in specified geographical locations",
          features: [
            "Multiple safe zone definition",
            "GPS + IP verification",
            "Geofencing with customizable radius",
            "Geographic redundancy options"
          ]
        },
        {
          name: "Time-Lock Vault",
          description: "Lock assets with precision time-based controls and conditions",
          features: [
            "Customizable time windows",
            "Calendar-based unlocking",
            "Sequential time-release",
            "Recurring time patterns"
          ]
        },
        {
          name: "Smart Contract Vault",
          description: "Create conditional logic for automated vault operations",
          features: [
            "Programmable access conditions",
            "External trigger integration",
            "Oracle data feeds",
            "Cross-chain execution"
          ]
        }
      ]
    },
    token: {
      title: "ChronosToken (CVT) Economics",
      description: "CVT is the utility token powering the Chronos Vault ecosystem, with a fixed supply of 21,000,000 tokens and a deflationary mechanism through continuous buyback and burn.",
      usage: [
        "Fee payments for vault creation and maintenance",
        "Staking for enhanced security benefits",
        "Governance participation in protocol decisions",
        "Access to premium vault features"
      ],
      staking: {
        description: "CVT staking provides multiple benefits based on the staking tier:",
        tiers: [
          {
            name: "Vault Guardian",
            amount: "1,000+ CVT",
            benefits: [
              "75% fee reduction on all vault operations",
              "Access to premium vault templates",
              "Enhanced recovery options",
              "Priority support"
            ]
          },
          {
            name: "Vault Architect",
            amount: "10,000+ CVT",
            benefits: [
              "90% fee reduction on all vault operations",
              "Access to all vault types including experimental features",
              "Advanced cross-chain verification",
              "Customizable vault security profiles",
              "24/7 dedicated support"
            ]
          },
          {
            name: "Vault Sovereign",
            amount: "100,000+ CVT",
            benefits: [
              "100% fee reduction on all vault operations",
              "Early access to new vault types and features",
              "Unlimited vault creation",
              "Maximum security tier access by default",
              "Custom-branded vault solutions",
              "Dedicated account manager"
            ]
          }
        ]
      }
    },
    roadmap: {
      title: "Development Roadmap",
      quarters: [
        {
          period: "Q2 2023",
          name: "Foundation Phase",
          completed: true,
          milestones: [
            "Core infrastructure development",
            "Triple-Chain Security architecture design",
            "Smart contract development and testing",
            "CVT token creation"
          ]
        },
        {
          period: "Q3 2023",
          name: "Alpha Phase",
          completed: true,
          milestones: [
            "Alpha platform launch",
            "Basic vault functionality",
            "Initial security audits",
            "Community building"
          ]
        },
        {
          period: "Q4 2023",
          name: "Beta Phase",
          completed: true,
          milestones: [
            "Expanded vault types",
            "Multi-chain integration",
            "Security enhancements",
            "UI/UX improvements"
          ]
        },
        {
          period: "Q1 2024",
          name: "Launch Phase",
          completed: true,
          milestones: [
            "Mainnet platform launch",
            "CVT token distribution",
            "Advanced security features",
            "Partnership announcements"
          ]
        },
        {
          period: "Q2 2024",
          name: "Expansion Phase",
          completed: false,
          milestones: [
            "Advanced vault types",
            "Enterprise solutions",
            "Developer APIs",
            "Cross-chain interoperability enhancements"
          ]
        },
        {
          period: "Q3 2024",
          name: "Integration Phase",
          completed: false,
          milestones: [
            "Third-party integrations",
            "Mobile applications",
            "Financial services partnerships",
            "Enhanced AI security features"
          ]
        },
        {
          period: "Q4 2024",
          name: "Innovation Phase",
          completed: false,
          milestones: [
            "Next-generation vault systems",
            "Institutional-grade features",
            "Advanced recovery mechanisms",
            "Global expansion initiatives"
          ]
        }
      ]
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#121212] to-[#1A1A1A] text-white">
      <Helmet>
        <title>Whitepaper & Staking | Chronos Vault</title>
      </Helmet>
      
      <main className="flex-1">
        <section className="py-16 md:py-24 relative overflow-hidden">
          <div className="absolute w-full h-full top-0 left-0 overflow-hidden pointer-events-none z-0">
            <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/10 blur-3xl opacity-30"></div>
            <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-gradient-to-r from-[#FF5AF7]/20 to-[#6B00D7]/10 blur-3xl opacity-20"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="mb-8">
              <Button
                variant="ghost"
                className="mb-8 hover:bg-[#6B00D7]/10 text-white/80 hover:text-white"
                onClick={() => setLocation("/cvt-utility")}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back to CVT Utility
              </Button>
              
              <div className="text-center mb-16">
                <div className="inline-block mb-4 px-4 py-1 rounded-full bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/20 border border-[#6B00D7]/40 backdrop-blur-sm">
                  <span className="text-sm font-medium text-[#FF5AF7] flex items-center justify-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Technical Documentation
                  </span>
                </div>
              
                <h1 className="font-poppins font-bold text-4xl md:text-7xl leading-tight mb-8">
                  <span className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] inline-block text-transparent bg-clip-text">
                    Chronos Vault Whitepaper
                  </span>
                </h1>
                
                <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
                  The technical foundation of the future of digital time vaults
                </p>
                
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                  <Button 
                    className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#5500AB] hover:to-[#FF46E8] text-white px-6 py-5 text-lg rounded-xl shadow-glow hover:shadow-lg hover:shadow-[#FF5AF7]/40 transition-all"
                    onClick={() => window.open('https://chronosvault.org/chronos-vault-whitepaper.pdf', '_blank')}
                  >
                    <Download className="h-5 w-5 mr-2" />
                    Download Full Whitepaper
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="border-[#6B00D7] text-white hover:bg-[#6B00D7]/10 px-6 py-5 text-lg rounded-xl transition-all"
                    onClick={() => setLocation("/cvt-tokenomics")}
                  >
                    <Coins className="h-5 w-5 mr-2" />
                    View Tokenomics
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="mb-16">
              <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 mb-8">
                  <TabsTrigger 
                    value="overview" 
                    className="data-[state=active]:bg-[#1A1A1A] data-[state=active]:text-[#FF5AF7] data-[state=active]:shadow-[#FF5AF7]/20 data-[state=active]:border-[#FF5AF7]/50 border border-transparent"
                  >
                    <FileText className="h-4 w-4 mr-2" /> Overview
                  </TabsTrigger>
                  <TabsTrigger 
                    value="architecture" 
                    className="data-[state=active]:bg-[#1A1A1A] data-[state=active]:text-[#FF5AF7] data-[state=active]:shadow-[#FF5AF7]/20 data-[state=active]:border-[#FF5AF7]/50 border border-transparent"
                  >
                    <Layers className="h-4 w-4 mr-2" /> Architecture
                  </TabsTrigger>
                  <TabsTrigger 
                    value="formalVerification" 
                    className="data-[state=active]:bg-[#1A1A1A] data-[state=active]:text-[#FF5AF7] data-[state=active]:shadow-[#FF5AF7]/20 data-[state=active]:border-[#FF5AF7]/50 border border-transparent"
                  >
                    <Shield className="h-4 w-4 mr-2" /> Formal Verification
                  </TabsTrigger>
                  <TabsTrigger 
                    value="vaultTypes" 
                    className="data-[state=active]:bg-[#1A1A1A] data-[state=active]:text-[#FF5AF7] data-[state=active]:shadow-[#FF5AF7]/20 data-[state=active]:border-[#FF5AF7]/50 border border-transparent"
                  >
                    <Database className="h-4 w-4 mr-2" /> Vault Types
                  </TabsTrigger>
                  <TabsTrigger 
                    value="token" 
                    className="data-[state=active]:bg-[#1A1A1A] data-[state=active]:text-[#FF5AF7] data-[state=active]:shadow-[#FF5AF7]/20 data-[state=active]:border-[#FF5AF7]/50 border border-transparent"
                  >
                    <Coins className="h-4 w-4 mr-2" /> Token & Staking
                  </TabsTrigger>
                  <TabsTrigger 
                    value="roadmap" 
                    className="data-[state=active]:bg-[#1A1A1A] data-[state=active]:text-[#FF5AF7] data-[state=active]:shadow-[#FF5AF7]/20 data-[state=active]:border-[#FF5AF7]/50 border border-transparent"
                  >
                    <Clock className="h-4 w-4 mr-2" /> Roadmap
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-8">
                  <Card className="bg-[#1A1A1A]/80 border-[#6B00D7]/30">
                    <CardHeader>
                      <CardTitle className="text-2xl bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] inline-block text-transparent bg-clip-text">
                        {whitepaperSections.overview.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 text-lg mb-8">
                        {whitepaperSections.overview.intro}
                      </p>
                      
                      <h3 className="text-xl font-bold mb-4">Key Highlights</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {whitepaperSections.overview.highlights.map((highlight, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#6B00D7]/30 to-[#FF5AF7]/20 flex items-center justify-center flex-shrink-0">
                              {index === 0 ? <Layers className="h-4 w-4 text-[#FF5AF7]" /> :
                               index === 1 ? <Network className="h-4 w-4 text-[#FF5AF7]" /> :
                               index === 2 ? <Shield className="h-4 w-4 text-[#FF5AF7]" /> :
                               index === 3 ? <Clock className="h-4 w-4 text-[#FF5AF7]" /> :
                               <Cpu className="h-4 w-4 text-[#FF5AF7]" />}
                            </div>
                            <div>
                              <p className="text-white font-medium">{highlight}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-12">
                        <h3 className="text-xl font-bold mb-4">Abstract</h3>
                        <div className="bg-black/30 p-6 rounded-xl border border-[#6B00D7]/20">
                          <p className="text-gray-300 mb-4">
                            Chronos Vault introduces a paradigm shift in digital asset security through our innovative Triple-Chain Security Architecture. 
                            This whitepaper outlines the technical foundations of our platform, which leverages the unique strengths of Ethereum, Solana, 
                            and TON to create an unprecedented level of security for digital time vaults.
                          </p>
                          <p className="text-gray-300">
                            Our solution addresses the critical challenges of long-term digital asset protection including time-based access control, 
                            recovery mechanisms, privacy concerns, and cross-chain interoperability. Through innovative smart contract design, 
                            zero-knowledge proofs, and AI-enhanced security monitoring, Chronos Vault establishes a new standard for digital vaults 
                            in the blockchain ecosystem.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="architecture" className="space-y-8">
                  <Card className="bg-[#1A1A1A]/80 border-[#6B00D7]/30">
                    <CardHeader>
                      <CardTitle className="text-2xl bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] inline-block text-transparent bg-clip-text">
                        {whitepaperSections.architecture.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 text-lg mb-8">
                        {whitepaperSections.architecture.description}
                      </p>
                      
                      <div className="space-y-8">
                        {whitepaperSections.architecture.layers.map((layer, index) => (
                          <div key={index} className="bg-black/30 p-6 rounded-xl border border-[#6B00D7]/20">
                            <div className="flex items-center mb-4">
                              <div className="h-10 w-10 rounded-full mr-4 flex items-center justify-center" 
                                   style={{ 
                                     background: index === 0 ? 'linear-gradient(to right, #6B73FF, #000D3F)' : 
                                                index === 1 ? 'linear-gradient(to right, #14F195, #003A25)' : 
                                                'linear-gradient(to right, #0098EA, #00294A)' 
                                   }}>
                                {index === 0 ? (
                                  <span className="text-white font-bold text-lg">Ξ</span>
                                ) : index === 1 ? (
                                  <span className="text-white font-bold text-lg">◎</span>
                                ) : (
                                  <span className="text-white font-bold text-lg">💎</span>
                                )}
                              </div>
                              <div>
                                <h3 className="text-xl font-bold text-white">{layer.name}</h3>
                                <p className="text-gray-400">{layer.role}</p>
                              </div>
                            </div>
                            
                            <div className="pl-14">
                              <h4 className="text-sm uppercase text-gray-500 mb-2">Key Features</h4>
                              <ul className="space-y-2">
                                {layer.features.map((feature, fIndex) => (
                                  <li key={fIndex} className="flex items-start gap-2">
                                    <div className="h-5 w-5 rounded-full bg-[#6B00D7]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                      <div className="h-2 w-2 rounded-full bg-[#FF5AF7]"></div>
                                    </div>
                                    <span className="text-gray-300">{feature}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-8">
                        <h3 className="text-xl font-bold mb-4">Cross-Chain Verification Flow</h3>
                        <div className="bg-black/30 p-6 rounded-xl border border-[#6B00D7]/20">
                          <ol className="space-y-4 pl-6 list-decimal text-gray-300">
                            <li>Primary vault is created on Ethereum Layer 2 (Arbitrum) with vault parameters and time-lock conditions</li>
                            <li>Vault creation event is captured by Solana validators who create a shadow vault for monitoring</li>
                            <li>TON network creates backup recovery parameters in a dedicated smart contract</li>
                            <li>Assets stored in the vault are verified across all three chains through proof of existence</li>
                            <li>Vault access requires successful validation across multiple chains based on security level</li>
                            <li>Recovery mechanism activated if primary access fails, using multi-chain verification</li>
                          </ol>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="formalVerification" className="space-y-8">
                  <Card className="bg-[#1A1A1A]/80 border-[#6B00D7]/30">
                    <CardHeader>
                      <CardTitle className="text-2xl bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] inline-block text-transparent bg-clip-text">
                        {whitepaperSections.formalVerification.title}
                      </CardTitle>
                      <CardDescription className="text-gray-400 text-lg">
                        {whitepaperSections.formalVerification.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gradient-to-r from-[#6B00D7]/10 to-[#FF5AF7]/10 border border-[#6B00D7]/30 rounded-xl p-6 mb-8">
                        <h3 className="text-xl font-semibold mb-4">Development Targets</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-black/30 p-4 rounded-lg border border-[#6B00D7]/20">
                            <div className="text-3xl font-bold text-[#FF5AF7] mb-1">{whitepaperSections.formalVerification.targets.lean4Theorems}</div>
                            <div className="text-sm text-gray-400">Lean 4 Theorems (Target)</div>
                          </div>
                          <div className="bg-black/30 p-4 rounded-lg border border-[#6B00D7]/20">
                            <div className="text-3xl font-bold text-[#FF5AF7] mb-1">{whitepaperSections.formalVerification.targets.certoraRules}</div>
                            <div className="text-sm text-gray-400">Certora Rules (Target)</div>
                          </div>
                          <div className="bg-black/30 p-4 rounded-lg border border-[#6B00D7]/20">
                            <div className="text-3xl font-bold text-[#FF5AF7] mb-1">{whitepaperSections.formalVerification.targets.tlaModels}</div>
                            <div className="text-sm text-gray-400">TLA+ Model (Planned)</div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        {whitepaperSections.formalVerification.layers.map((layer, index) => (
                          <Card key={index} className="bg-black/50 border-[#6B00D7]/20">
                            <CardHeader>
                              <CardTitle className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/10 border border-[#6B00D7]/40 flex items-center justify-center">
                                  <Shield className="h-5 w-5 text-[#FF5AF7]" />
                                </div>
                                {layer.name}
                              </CardTitle>
                              <CardDescription>{layer.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <h4 className="text-sm font-medium text-white mb-3">Coverage Areas</h4>
                              <ul className="space-y-2">
                                {layer.coverage.map((item, cIndex) => (
                                  <li key={cIndex} className="flex items-start gap-2 text-sm text-gray-300">
                                    <div className="h-5 w-5 rounded-full bg-[#6B00D7]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                      <div className="h-2 w-2 rounded-full bg-[#FF5AF7]"></div>
                                    </div>
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </CardContent>
                          </Card>
                        ))}
                      </div>

                      <div className="mt-8 bg-gradient-to-r from-[#6B00D7]/10 to-[#FF5AF7]/10 border border-[#6B00D7]/30 rounded-xl p-6">
                        <div className="flex items-start gap-3">
                          <Shield className="h-6 w-6 text-[#FF5AF7] mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="text-lg font-semibold mb-2">Mathematical Security Guarantee</h4>
                            <p className="text-gray-300">{whitepaperSections.formalVerification.guarantee}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="vaultTypes" className="space-y-8">
                  <Card className="bg-[#1A1A1A]/80 border-[#6B00D7]/30">
                    <CardHeader>
                      <CardTitle className="text-2xl bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] inline-block text-transparent bg-clip-text">
                        {whitepaperSections.vaultTypes.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 text-lg mb-8">
                        {whitepaperSections.vaultTypes.description}
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {whitepaperSections.vaultTypes.types.map((type, index) => (
                          <Card key={index} className="bg-black/50 border-[#6B00D7]/20">
                            <CardHeader>
                              <div className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/10 border border-[#6B00D7]/40 flex items-center justify-center">
                                  {index === 0 ? <Users className="h-6 w-6 text-[#FF5AF7]" /> :
                                   index === 1 ? <Globe className="h-6 w-6 text-[#FF5AF7]" /> :
                                   index === 2 ? <Clock className="h-6 w-6 text-[#FF5AF7]" /> :
                                   <Cpu className="h-6 w-6 text-[#FF5AF7]" />}
                                </div>
                                <CardTitle>{type.name}</CardTitle>
                              </div>
                              <CardDescription>{type.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <h4 className="text-sm font-medium text-white mb-2">Technical Features</h4>
                              <ul className="space-y-2">
                                {type.features.map((feature, fIndex) => (
                                  <li key={fIndex} className="flex items-start gap-2 text-sm text-gray-300">
                                    <div className="h-5 w-5 rounded-full bg-[#6B00D7]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                      <div className="h-2 w-2 rounded-full bg-[#FF5AF7]"></div>
                                    </div>
                                    {feature}
                                  </li>
                                ))}
                              </ul>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                      
                      <div className="mt-8">
                        <h3 className="text-xl font-bold mb-4">Vault Security Levels</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-black/30 p-4 rounded-xl border border-gray-800">
                            <div className="mb-3 flex items-center">
                              <div className="h-8 w-8 rounded-full bg-[#464646] mr-3 flex items-center justify-center">
                                <Shield className="h-4 w-4 text-white" />
                              </div>
                              <h4 className="font-bold">Standard Security</h4>
                            </div>
                            <ul className="space-y-2 pl-11 text-sm text-gray-300">
                              <li>Single-chain verification</li>
                              <li>Basic time-lock features</li>
                              <li>Standard recovery options</li>
                            </ul>
                          </div>
                          
                          <div className="bg-black/30 p-4 rounded-xl border border-[#6B00D7]/40">
                            <div className="mb-3 flex items-center">
                              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[#6B00D7] to-[#A65FFF] mr-3 flex items-center justify-center">
                                <Shield className="h-4 w-4 text-white" />
                              </div>
                              <h4 className="font-bold">Enhanced Security</h4>
                            </div>
                            <ul className="space-y-2 pl-11 text-sm text-gray-300">
                              <li>Dual-chain verification</li>
                              <li>Advanced time parameters</li>
                              <li>Multi-factor authentication</li>
                              <li>Enhanced recovery protocol</li>
                            </ul>
                          </div>
                          
                          <div className="bg-black/30 p-4 rounded-xl border border-[#FF5AF7]/40">
                            <div className="mb-3 flex items-center">
                              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[#FF5AF7] to-[#FF8AFA] mr-3 flex items-center justify-center">
                                <Shield className="h-4 w-4 text-white" />
                              </div>
                              <h4 className="font-bold">Maximum Security</h4>
                            </div>
                            <ul className="space-y-2 pl-11 text-sm text-gray-300">
                              <li>Triple-chain verification</li>
                              <li>Zero-knowledge privacy</li>
                              <li>AI anomaly detection</li>
                              <li>Advanced recovery system</li>
                              <li>Geographic redundancy</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="token" className="space-y-8">
                  <Card className="bg-[#1A1A1A]/80 border-[#6B00D7]/30">
                    <CardHeader>
                      <CardTitle className="text-2xl bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] inline-block text-transparent bg-clip-text">
                        {whitepaperSections.token.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 text-lg mb-8">
                        {whitepaperSections.token.description}
                      </p>
                      
                      <h3 className="text-xl font-bold mb-4">CVT Token Utility</h3>
                      <ul className="space-y-3 mb-8">
                        {whitepaperSections.token.usage.map((use, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className="h-6 w-6 rounded-full bg-[#6B00D7]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                              {index === 0 ? <Coins className="h-3.5 w-3.5 text-[#FF5AF7]" /> :
                               index === 1 ? <LockKeyhole className="h-3.5 w-3.5 text-[#FF5AF7]" /> :
                               index === 2 ? <Users className="h-3.5 w-3.5 text-[#FF5AF7]" /> :
                               <Shield className="h-3.5 w-3.5 text-[#FF5AF7]" />}
                            </div>
                            <span className="text-gray-300">{use}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] inline-block text-transparent bg-clip-text">
                        Staking Tiers & Benefits
                      </h3>
                      
                      <p className="text-gray-300 mb-8">
                        {whitepaperSections.token.staking.description}
                      </p>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                        <div className="space-y-6">
                          {whitepaperSections.token.staking.tiers.map((tier, index) => (
                            <Card key={index} className="bg-black/50 border-[#6B00D7]/30">
                              <CardHeader>
                                <div className="flex items-center justify-between">
                                  <CardTitle className="text-xl">
                                    <span className="font-bold" style={{ 
                                      color: 
                                        index === 0 ? "#6B00D7" : 
                                        index === 1 ? "#FF5AF7" : "#0098EA" 
                                    }}>
                                      {tier.name}
                                    </span>
                                  </CardTitle>
                                  <Badge className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]">{tier.amount}</Badge>
                                </div>
                                <CardDescription>
                                  {index === 0 ? "Entry-level tier for CVT holders" : 
                                  index === 1 ? "Advanced tier for serious vault users" : 
                                  "Ultimate tier for institutional users"}
                                </CardDescription>
                              </CardHeader>
                              <CardContent>
                                <h4 className="text-sm font-medium text-white mb-2">Benefits</h4>
                                <ul className="space-y-2">
                                  {tier.benefits.map((benefit, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                                      <div className="h-5 w-5 rounded-full bg-[#6B00D7]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <div className="h-2 w-2 rounded-full bg-[#FF5AF7]"></div>
                                      </div>
                                      {benefit}
                                    </li>
                                  ))}
                                </ul>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                        
                        <div>
                          <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] inline-block text-transparent bg-clip-text">
                            Benefits Comparison
                          </h3>
                          
                          {/* 3D Chart for staking tier benefits */}
                          <StakingTiersBenefitsChart />
                          
                          <div className="mt-6">
                            <Card className="bg-black/50 border-[#6B00D7]/30">
                              <CardHeader>
                                <CardTitle className="text-lg">Staking Mechanics</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <p className="text-gray-300 text-sm mb-4">
                                  CVT staking provides a dual benefit system: enhancing the user's vault capabilities while 
                                  contributing to the overall security and governance of the protocol.
                                </p>
                                <ul className="space-y-3">
                                  <li className="flex items-start gap-3 text-sm text-gray-300">
                                    <div className="h-6 w-6 rounded-full bg-[#6B00D7]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                      <LockKeyhole className="h-3.5 w-3.5 text-[#FF5AF7]" />
                                    </div>
                                    <span>Staked tokens have a minimum lock period of 30 days, with reward bonuses for longer commitment periods</span>
                                  </li>
                                  <li className="flex items-start gap-3 text-sm text-gray-300">
                                    <div className="h-6 w-6 rounded-full bg-[#6B00D7]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                      <Flame className="h-3.5 w-3.5 text-[#FF5AF7]" />
                                    </div>
                                    <span>Percentage of all vault fees are redistributed to stakers based on their tier and stake amount</span>
                                  </li>
                                  <li className="flex items-start gap-3 text-sm text-gray-300">
                                    <div className="h-6 w-6 rounded-full bg-[#6B00D7]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                      <Users className="h-3.5 w-3.5 text-[#FF5AF7]" />
                                    </div>
                                    <span>Governance voting power is proportional to CVT stake, giving long-term holders greater influence</span>
                                  </li>
                                </ul>
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="roadmap" className="space-y-8">
                  <Card className="bg-[#1A1A1A]/80 border-[#6B00D7]/30">
                    <CardHeader>
                      <CardTitle className="text-2xl bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] inline-block text-transparent bg-clip-text">
                        {whitepaperSections.roadmap.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="relative">
                        <div className="absolute left-[27px] top-12 bottom-6 w-[2px] bg-gradient-to-b from-[#6B00D7] to-[#FF5AF7]/30"></div>
                        
                        <div className="space-y-12">
                          {whitepaperSections.roadmap.quarters.map((quarter, index) => (
                            <div key={index} className="relative">
                              <div className="flex">
                                <div className="flex-shrink-0">
                                  <div className={`h-14 w-14 rounded-full ${quarter.completed ? 'bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]' : 'bg-gray-800'} flex items-center justify-center z-10 relative`}>
                                    {quarter.completed ? (
                                      <div className="h-10 w-10 rounded-full bg-black/50 flex items-center justify-center text-white font-bold">
                                        ✓
                                      </div>
                                    ) : (
                                      <div className="h-10 w-10 rounded-full bg-black/50 flex items-center justify-center text-white/70 font-bold">
                                        {index + 1}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                
                                <div className="ml-8 -mt-2">
                                  <div className="mb-1">
                                    <Badge className={quarter.completed ? "bg-[#14F195] text-black" : "bg-gray-700"}>{quarter.period}</Badge>
                                  </div>
                                  <h3 className="text-xl font-bold mb-3">
                                    {quarter.name}
                                  </h3>
                                  
                                  <Card className={`bg-black/50 border-[#6B00D7]/20 ${!quarter.completed && 'opacity-70'}`}>
                                    <CardContent className="pt-4">
                                      <ul className="space-y-3">
                                        {quarter.milestones.map((milestone, mIndex) => (
                                          <li key={mIndex} className="flex items-start gap-2 text-gray-300">
                                            <div className={`h-5 w-5 rounded-full ${quarter.completed ? 'bg-[#6B00D7]/20' : 'bg-gray-800/50'} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                                              <div className={`h-2 w-2 rounded-full ${quarter.completed ? 'bg-[#FF5AF7]' : 'bg-gray-500'}`}></div>
                                            </div>
                                            {milestone}
                                          </li>
                                        ))}
                                      </ul>
                                    </CardContent>
                                  </Card>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default WhitepaperPage;