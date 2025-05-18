import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronRight, Filter, BookOpen, Shield, Coins, Clock, Crown, Code } from "lucide-react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

// Category definitions
const categories = {
  all: {
    name: "All Vaults",
    description: "Explore our complete collection of specialized vault types",
    icon: <BookOpen className="w-5 h-5" />,
    color: "bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]",
  },
  security: {
    name: "Security Vaults",
    description: "Vaults with advanced security features and authentication methods",
    icon: <Shield className="w-5 h-5" />,
    color: "bg-gradient-to-r from-[#6B00D7] to-[#3B82F6]",
  },
  blockchain: {
    name: "Blockchain Vaults",
    description: "Vaults leveraging multi-chain and smart contract technologies",
    icon: <Code className="w-5 h-5" />,
    color: "bg-gradient-to-r from-[#3B82F6] to-[#06B6D4]",
  },
  investment: {
    name: "Investment Strategy Vaults",
    description: "Vaults designed to enforce investment discipline and strategies",
    icon: <Coins className="w-5 h-5" />,
    color: "bg-gradient-to-r from-[#10B981] to-[#6EE7B7]",
  },
  legacy: {
    name: "Legacy & Inheritance Vaults",
    description: "Vaults for estate planning and preserving digital memories",
    icon: <Clock className="w-5 h-5" />,
    color: "bg-gradient-to-r from-[#F59E0B] to-[#FBBF24]",
  },
  premium: {
    name: "Premium Vaults",
    description: "Our most advanced all-in-one vault solutions",
    icon: <Crown className="w-5 h-5" />,
    color: "bg-gradient-to-r from-[#FF5AF7] to-[#FFB86C]",
  },
};

// Vault types with their details
const vaultTypes = [
  {
    id: "smart-contract",
    name: "Smart Contract Vault",
    icon: "📘",
    href: "/smart-contract-vault",
    description: "ERC-4626 compliant tokenized vault with cross-chain security verification",
    features: [
      "ERC-4626 standard compliance for maximum compatibility",
      "Triple-Chain Security™ architecture for robust protection",
      "Quantum-resistant encryption options",
      "Cross-chain verification of ownership",
      "Programmable time-lock mechanisms",
    ],
    isNew: false,
    highlight: true,
    category: "blockchain",
  },
  {
    id: "multi-signature",
    name: "Multi-Signature Vault",
    icon: "🔒",
    href: "/multi-signature-vault-doc",
    description: "Enhanced security requiring multiple approvals for asset access",
    features: [
      "Configurable M-of-N signature requirements",
      "Distributed authorization across multiple keys",
      "Customizable approval thresholds",
      "Social recovery options",
      "Hierarchical approval workflows",
    ],
    category: "security",
  },
  {
    id: "biometric",
    name: "Biometric Vault",
    icon: "📱",
    href: "/biometric-vault",
    description: "Secure vaults with advanced biometric authentication mechanisms",
    features: [
      "Fingerprint, face, and voice recognition support",
      "Zero-knowledge biometric verification",
      "Privacy-preserving authentication",
      "Multi-factor identity confirmation",
      "Offline verification capabilities",
    ],
    category: "security",
  },
  {
    id: "cross-chain",
    name: "Cross-Chain Vault",
    icon: "🧩",
    href: "/cross-chain-vault",
    description: "Assets secured across multiple blockchain networks simultaneously",
    features: [
      "Multi-chain asset protection",
      "Cross-chain verification of ownership",
      "Distributed security across networks",
      "Blockchain agnostic asset management",
      "Fallback chain redundancy",
    ],
    category: "blockchain",
  },
  {
    id: "cross-chain-fragment",
    name: "Cross-Chain Fragment Vault",
    icon: "🔗",
    href: "/cross-chain-fragment-vault",
    description: "Fragments your assets across multiple chains for enhanced security",
    features: [
      "Automatic asset fragmentation across chains",
      "Triple-chain verification for access",
      "Recovery mechanism with multi-sig backup",
      "Full or partial fragment recovery options",
      "Chain-specific security optimization",
    ],
    isNew: true,
    category: "blockchain",
  },
  {
    id: "geo-location",
    name: "Geo-Location Vault",
    icon: "🌎",
    href: "/geo-vault",
    description: "Access controlled by physical location requirements",
    features: [
      "GPS and location-based authentication",
      "Geofencing capabilities",
      "Location-restricted transactions",
      "Privacy-preserving location verification",
      "Customizable location parameters",
    ],
    category: "security",
  },
  {
    id: "location-time",
    name: "Location-Time Vault",
    icon: "🗺️",
    href: "/location-time-vault",
    description: "Advanced vault with both geographic and temporal access requirements",
    features: [
      "Combined time-lock and location verification",
      "Programmable geo-temporal schedules",
      "Customizable geographic boundaries",
      "Time-window based access controls",
      "Emergency override protocols",
    ],
    isNew: true,
    category: "security",
  },
  {
    id: "time-lock-memory",
    name: "Time-Lock Memory Vault",
    icon: "⏰",
    href: "/specialized-vault-memory",
    description: "Store digital assets together with multimedia memories",
    features: [
      "Combined asset and media time-lock",
      "Support for photos, videos, and messages",
      "Time-capsule functionality",
      "Scheduled message delivery",
      "Memorial & legacy planning features",
    ],
    category: "legacy",
  },
  {
    id: "time-locked-new",
    name: "Advanced Time-Lock Memory Vault",
    icon: "🕰️",
    href: "/time-locked-memory-vault-new",
    description: "Next-generation vault for preserving memories and assets with customizable time triggers",
    features: [
      "Enhanced multimedia preservation",
      "Event-based unlocking mechanisms",
      "Multiple time-lock schedules",
      "Beneficiary management system",
      "Advanced encryption for privacy",
    ],
    isNew: true,
    highlight: true,
    category: "legacy",
  },
  {
    id: "investment-discipline",
    name: "Investment Discipline Vault",
    icon: "💎",
    href: "/investment-discipline-vault",
    description: "Strategy-based vaults for maintaining investment discipline",
    features: [
      "Diamond Hands (HODL) strategy with time locks",
      "Profit-Taking automation with price targets",
      "DCA Exit strategy implementation",
      "Bitcoin Halving cycle alignment",
      "Rule-based investment execution",
    ],
    category: "investment",
  },
  {
    id: "investment-discipline-advanced",
    name: "Advanced Investment Discipline Vault",
    icon: "📈",
    href: "/investment-discipline-vault-advanced",
    description: "Sophisticated investment strategy enforcement with AI-powered optimization",
    features: [
      "AI-powered strategy optimization",
      "Market condition responsive rules",
      "Multi-asset correlation analysis",
      "Customizable investment horizons",
      "Strategy backtesting capabilities",
    ],
    isNew: true,
    category: "investment",
  },
  {
    id: "nft-powered",
    name: "NFT-Powered Vault",
    icon: "🖼️",
    href: "/nft-powered-vault",
    description: "Vaults secured by ownership of specific NFTs as access keys",
    features: [
      "NFT-based access control",
      "Transferable vault ownership",
      "Multi-NFT authentication options",
      "Composable security with collections",
      "Cross-chain NFT recognition",
    ],
    isNew: true,
    category: "blockchain",
  },
  {
    id: "quantum-resistant",
    name: "Quantum-Resistant Vault",
    icon: "🔐",
    href: "/quantum-resistant-vault",
    description: "Future-proof vault using post-quantum cryptographic algorithms",
    features: [
      "Post-quantum cryptographic security",
      "Lattice-based encryption",
      "Hash-based signature schemes",
      "Isogeny-based key exchange",
      "Forward security guarantees",
    ],
    isNew: true,
    category: "security",
  },
  {
    id: "bitcoin-halving",
    name: "Bitcoin Halving Vault",
    icon: "₿",
    href: "/bitcoin-halving-vault",
    description: "Bitcoin-specific vault optimized for halving cycle investment strategy",
    features: [
      "Halving cycle-based time locks",
      "BTC price target automation",
      "Historical cycle analysis tools",
      "Automatic profit taking at cycle peaks",
      "Cold storage security integration",
    ],
    category: "investment",
  },
  {
    id: "unique-security",
    name: "Unique Security Vault",
    icon: "🛡️",
    href: "/unique-security-vault",
    description: "Customizable vault with user-defined security parameters and verification methods",
    features: [
      "Build-your-own security model",
      "Multiple verification layer options",
      "Security score optimization",
      "Risk assessment tools",
      "Custom recovery procedures",
    ],
    isNew: true,
    category: "security",
  },
  {
    id: "sovereign-fortress",
    name: "Sovereign Fortress Vault™",
    icon: "🏰",
    href: "/sovereign-fortress-vault",
    description: "The ultimate all-in-one vault with supreme security and flexibility",
    features: [
      "Triple-Chain Verification Protocol",
      "Quantum-resistant encryption layer",
      "Multiple access control options",
      "Advanced recovery mechanisms",
      "Comprehensive security dashboard",
    ],
    isNew: true,
    highlight: true,
    category: "premium",
  },
  {
    id: "inheritance-planning",
    name: "Inheritance Planning Vault",
    icon: "🌳",
    href: "/inheritance-planning-vault",
    description: "Secure estate planning with conditional access for beneficiaries",
    features: [
      "Beneficiary management system",
      "Scheduled asset distribution",
      "Conditional release mechanisms",
      "Legal documentation storage",
      "Multi-jurisdictional compliance",
    ],
    category: "legacy",
  },
  {
    id: "dynamic-vault",
    name: "Dynamic Security Vault",
    icon: "🔄",
    href: "/dynamic-vault-form",
    description: "Adaptable vault with customizable security parameters and realtime risk adaptation",
    features: [
      "Dynamic security level adjustment",
      "Behavior pattern analysis",
      "Threat-responsive security measures",
      "Security measure rotation",
      "Continuous security optimization",
    ],
    isNew: true,
    category: "security",
  },
  {
    id: "payment-channel",
    name: "Payment Channel Vault",
    icon: "💸",
    href: "/payment-channel-vault",
    description: "Optimized for high-frequency transactions with instant settlement",
    features: [
      "Off-chain transaction capabilities",
      "Batched settlement options",
      "Payment streaming functionality",
      "Low-latency operations",
      "Conditional payment release",
    ],
    category: "blockchain",
  },
];

const VaultSchoolPage = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <div className="inline-block relative mb-3">
          <span className="text-5xl">🎓</span>
          <span className="absolute -top-2 -right-2 bg-[#FF5AF7] text-white text-[10px] px-2 py-0.5 rounded-full font-bold tracking-wider shadow-md shadow-[#FF5AF7]/30 animate-pulse">NEW</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]">
          Vault School
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-6">
          Welcome to Vault School - your comprehensive resource to learn about Chronos Vault's
          specialized vault types, their features, and technical implementations.
        </p>
        
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-[#1A1A1A] to-[#111] border border-[#333] rounded-lg p-5 shadow-xl mb-8">
          <div className="flex items-center mb-3">
            <span className="text-3xl mr-3">🛡️</span>
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-[#FF5AF7] to-[#6B00D7]">
              Military-Grade Security System
            </h2>
          </div>
          <p className="text-gray-300 mb-4">
            All vault types are protected by our revolutionary Triple-Chain Security™ architecture that distributes 
            security operations across Ethereum, TON, and Solana networks for unparalleled protection.
          </p>
          <Link href="/military-grade-security">
            <Button className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:opacity-90 text-white">
              Explore Security Architecture
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {vaultTypes.map((vault) => (
          <Link key={vault.id} href={vault.href}>
            <div className={`relative bg-gradient-to-br from-[#242424] to-[#1E1E1E] p-6 rounded-xl border border-[#333] shadow-xl hover:shadow-2xl hover:border-[#6B00D7]/50 transition-all h-full flex flex-col ${
              vault.highlight ? 'bg-gradient-to-br from-[#6B00D7]/10 to-[#FF5AF7]/10 border-[#FF5AF7]/20' : ''
            }`}>
              {vault.isNew && (
                <div className="absolute top-3 right-3 bg-[#FF5AF7] text-white text-[10px] px-2 py-0.5 rounded-full font-bold tracking-wider shadow-md shadow-[#FF5AF7]/30 animate-pulse">
                  NEW
                </div>
              )}
              
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">{vault.icon}</span>
                <h3 className="text-xl font-semibold text-white">{vault.name}</h3>
              </div>
              
              <p className="text-gray-300 mb-4">{vault.description}</p>
              
              <div className="mt-auto">
                <h4 className="text-[#FF5AF7] font-medium mb-2">Key Features:</h4>
                <ul className="space-y-1 mb-4">
                  {vault.features.map((feature, index) => (
                    <li key={index} className="text-gray-300 text-sm flex items-start">
                      <span className="text-[#FF5AF7] mr-2">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button variant="ghost" className="w-full justify-between mt-2 border border-[#6B00D7]/30 hover:bg-[#6B00D7]/10 hover:border-[#FF5AF7]/50 group">
                  <span>Learn more</span>
                  <ChevronRight className="h-4 w-4 text-[#FF5AF7] group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default VaultSchoolPage;