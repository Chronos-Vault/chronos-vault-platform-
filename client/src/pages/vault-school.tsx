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
    href: "/documentation/multi-signature-vault",
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
    href: "/documentation/biometric-vault",
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
    href: "/documentation/cross-chain-fragment-vault",
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
    href: "/documentation/geo-location-vault",
    description: "Access controlled by physical location requirements",
    features: [
      "GPS and location-based authentication",
      "Geofencing capabilities",
      "Location-restricted transactions",
      "Privacy-preserving location verification",
      "Customizable location parameters",
    ],
    isNew: true,
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
    href: "/documentation/time-locked-memory-vault",
    description: "Store digital assets together with multimedia memories",
    features: [
      "Combined asset and media time-lock",
      "Support for photos, videos, and messages",
      "Time-capsule functionality",
      "Scheduled message delivery",
      "Memorial & legacy planning features",
    ],
    isNew: true,
    category: "legacy",
  },
  {
    id: "time-locked-new",
    name: "Advanced Time-Lock Memory Vault",
    icon: "🕰️",
    href: "/create-vault/time-locked-memory",
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
    name: "Investment Discipline Vault",
    icon: "📈",
    href: "/documentation/investment-discipline-vault",
    description: "Sophisticated investment strategy enforcement with behavioral safeguards",
    features: [
      "Strategy enforcement through time locks",
      "Market condition responsive rules",
      "Automated investment scheduling",
      "Behavioral finance optimization",
      "Strategy backtesting capabilities",
    ],
    isNew: true,
    highlight: true,
    category: "investment",
  },
  {
    id: "nft-powered",
    name: "NFT-Powered Vault",
    icon: "🖼️",
    href: "/documentation/nft-powered-vault",
    description: "Vaults secured by ownership of specific NFTs as access keys",
    features: [
      "NFT-based access control",
      "Transferable vault ownership",
      "Multi-NFT authentication options",
      "Composable security with collections",
      "Cross-chain NFT recognition",
    ],
    isNew: true,
    highlight: true,
    category: "blockchain",
  },
  {
    id: "quantum-resistant",
    name: "Quantum-Resistant Vault",
    icon: "🔐",
    href: "/documentation/quantum-resistant-vault",
    description: "Future-proof vault using post-quantum cryptographic algorithms",
    features: [
      "Post-quantum cryptographic security",
      "Lattice-based encryption",
      "Hash-based signature schemes",
      "Isogeny-based key exchange",
      "Forward security guarantees",
    ],
    isNew: true,
    highlight: true,
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
    href: "/documentation/unique-security-vault",
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
    href: "/documentation/sovereign-fortress-vault",
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
    href: "/documentation/dynamic-security-vault",
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
    href: "/documentation/payment-channel-vault",
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
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter vaults based on category and search
  const filteredVaults = vaultTypes.filter(vault => {
    const matchesCategory = selectedCategory === "all" || vault.category === selectedCategory;
    const matchesSearch = searchQuery === "" || 
      vault.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      vault.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });
  
  // Count vaults in each category
  const categoryCounts = Object.keys(categories).reduce((counts, category) => {
    counts[category] = vaultTypes.filter(vault => 
      category === "all" || vault.category === category
    ).length;
    return counts;
  }, {} as Record<string, number>);
  
  // Animation variants for smooth transitions
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };
  
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Header section with animated background */}
      <div className="relative overflow-hidden bg-[#111] pt-16 pb-20">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]"></div>
        <div className="absolute -top-20 -left-20 w-60 h-60 rounded-full bg-[#6B00D7]/20 blur-[100px]"></div>
        <div className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full bg-[#FF5AF7]/20 blur-[100px]"></div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 100,
              delay: 0.1
            }}
            className="inline-block relative mb-5"
          >
            <span className="text-6xl">🎓</span>
            <span className="absolute -top-2 -right-2 bg-[#FF5AF7] text-white text-[10px] px-2 py-0.5 rounded-full font-bold tracking-wider shadow-md shadow-[#FF5AF7]/30 animate-pulse">
              NEW
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]"
          >
            Vault School Hub
          </motion.h1>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto mb-8"
          >
            Welcome to the most comprehensive educational resource for Chronos Vault's specialized
            vault types. Learn about our cutting-edge security technologies, innovative features,
            and how to select the perfect vault for your needs.
          </motion.p>
        </div>
      </div>
      
      {/* Military-grade security promotion */}
      <div className="container mx-auto px-4 relative z-20 -mt-10 mb-16">
        <motion.div 
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="max-w-5xl mx-auto bg-gradient-to-r from-[#1A1A1A] to-[#121212] border border-[#333] rounded-xl p-6 shadow-2xl"
        >
          <div className="flex flex-col md:flex-row items-center">
            <div className="mb-6 md:mb-0 md:mr-6 flex-shrink-0">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#6B00D7] to-[#FF5AF7] flex items-center justify-center shadow-lg shadow-[#6B00D7]/30">
                <span className="text-4xl">🛡️</span>
              </div>
            </div>
            
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-[#FF5AF7] to-[#6B00D7] mb-3">
                Triple-Chain Security™ Protection
              </h2>
              <p className="text-gray-300 mb-6">
                All Chronos Vault types are secured by our revolutionary Triple-Chain Security™ architecture that 
                distributes security operations across Ethereum, TON, and Solana networks. This 
                provides unparalleled protection against attacks, single-chain vulnerabilities, and 
                ensures your assets remain secure even if one blockchain is compromised.
              </p>
              
              <div className="flex flex-wrap gap-3">
                <Link href="/military-grade-security">
                  <Button className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:opacity-90 text-white">
                    Explore Security Architecture
                  </Button>
                </Link>
                <Link href="/security-whitepaper">
                  <Button variant="outline" className="border-[#6B00D7] text-[#FF5AF7] hover:bg-[#6B00D7]/10">
                    Read Security Whitepaper
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Main content with tabs */}
      <div className="container mx-auto px-4 pb-20">
        <div className="flex flex-col md:flex-row justify-between mb-8 items-center">
          <h2 className="text-3xl font-bold mb-4 md:mb-0">Explore Vault Types</h2>
          
          {/* Search bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search vault types..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-80 bg-[#1A1A1A] border border-[#333] rounded-lg py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-[#6B00D7] text-white"
            />
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        {/* Category tabs */}
        <Tabs defaultValue="all" value={selectedCategory} onValueChange={setSelectedCategory} className="mb-10">
          <TabsList className="w-full mb-8 bg-[#1A1A1A] p-1 rounded-lg border border-[#333] overflow-x-auto flex flex-nowrap" style={{maxWidth: "100%"}}>
            {Object.entries(categories).map(([key, category]) => (
              <TabsTrigger 
                key={key} 
                value={key}
                className="flex-shrink-0 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#6B00D7] data-[state=active]:to-[#FF5AF7] data-[state=active]:text-white rounded-md py-2 px-4 min-w-[120px]"
              >
                <div className="flex items-center">
                  <div className="mr-2">{category.icon}</div>
                  <div>
                    {category.name}
                    <Badge className="ml-2 bg-[#333] text-xs">{categoryCounts[key]}</Badge>
                  </div>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>
          
          {(Object.keys(categories) as Array<keyof typeof categories>).map((categoryKey) => (
            <TabsContent key={categoryKey} value={categoryKey} className="mt-0">
              <div className="mb-6">
                <div className={`h-1 w-full rounded ${categories[categoryKey].color} mb-4`}></div>
                <h3 className="text-2xl font-bold text-white mb-2">{categories[categoryKey].name}</h3>
                <p className="text-gray-300">{categories[categoryKey].description}</p>
              </div>
              
              {/* Vault grid with animations */}
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filteredVaults.map((vault) => (
                  <motion.div key={vault.id} variants={itemVariants} layout>
                    <Link href={vault.href}>
                      <div 
                        className={`relative bg-gradient-to-br from-[#242424] to-[#1E1E1E] p-6 rounded-xl border border-[#333] shadow-xl hover:shadow-2xl hover:border-[#6B00D7]/50 transition-all h-full flex flex-col ${
                          vault.highlight ? 'bg-gradient-to-br from-[#6B00D7]/10 to-[#FF5AF7]/10 border-[#FF5AF7]/20' : ''
                        }`}
                      >
                        {vault.isNew && (
                          <div className="absolute top-3 right-3 bg-[#FF5AF7] text-white text-[10px] px-2 py-0.5 rounded-full font-bold tracking-wider shadow-md shadow-[#FF5AF7]/30 animate-pulse">
                            NEW
                          </div>
                        )}
                        
                        <div className="flex items-center mb-4">
                          <div className="w-12 h-12 rounded-full bg-[#333] flex items-center justify-center mr-3 text-2xl">
                            {vault.icon}
                          </div>
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
                            <span>Explore {vault.name}</span>
                            <ChevronRight className="h-4 w-4 text-[#FF5AF7] group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
              
              {/* Show message when no results found */}
              {filteredVaults.length === 0 && (
                <div className="text-center py-10">
                  <div className="text-4xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold mb-2">No vaults found</h3>
                  <p className="text-gray-400">
                    Try adjusting your search or select a different category
                  </p>
                  <Button 
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("all");
                    }}
                    variant="outline"
                    className="mt-4 border-[#6B00D7] text-[#FF5AF7] hover:bg-[#6B00D7]/10"
                  >
                    Reset filters
                  </Button>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
        
        {/* Educational resources section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold mb-6 text-center">Educational Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-[#1A1A1A] to-[#121212] p-6 rounded-xl border border-[#333] hover:border-[#6B00D7]/50 transition-all">
              <div className="bg-[#6B00D7]/20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-[#FF5AF7]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Technical Documentation</h3>
              <p className="text-gray-300 mb-4">Comprehensive documentation for developers and technical users.</p>
              <Link href="/documentation">
                <Button variant="outline" className="w-full border-[#6B00D7] text-[#FF5AF7] hover:bg-[#6B00D7]/10">
                  View Documentation
                </Button>
              </Link>
            </div>
            
            <div className="bg-gradient-to-br from-[#1A1A1A] to-[#121212] p-6 rounded-xl border border-[#333] hover:border-[#6B00D7]/50 transition-all">
              <div className="bg-[#FF5AF7]/20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-[#FF5AF7]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Security Whitepapers</h3>
              <p className="text-gray-300 mb-4">Detailed information on our security protocols and technology.</p>
              <Link href="/security-whitepaper">
                <Button variant="outline" className="w-full border-[#6B00D7] text-[#FF5AF7] hover:bg-[#6B00D7]/10">
                  Read Whitepapers
                </Button>
              </Link>
            </div>
            
            <div className="bg-gradient-to-br from-[#1A1A1A] to-[#121212] p-6 rounded-xl border border-[#333] hover:border-[#6B00D7]/50 transition-all">
              <div className="bg-[#3B82F6]/20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-[#3B82F6]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Video Tutorials</h3>
              <p className="text-gray-300 mb-4">Step-by-step videos showing how to use each vault type.</p>
              <Link href="/tutorials">
                <Button variant="outline" className="w-full border-[#6B00D7] text-[#FF5AF7] hover:bg-[#6B00D7]/10">
                  Watch Tutorials
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* FAQ section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold mb-10 text-center">Frequently Asked Questions</h2>
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-[#1A1A1A] to-[#121212] p-6 rounded-xl border border-[#333]">
            {[
              {
                question: "How do I choose the right vault type for my needs?",
                answer: "Consider what you're trying to protect, what security level you need, and any special requirements like time-locks or multi-signature approvals. Browse through our vault categories or use our Vault Selection Wizard for personalized recommendations."
              },
              {
                question: "What makes Triple-Chain Security™ different from regular blockchain security?",
                answer: "Traditional blockchain security relies on a single chain, creating a single point of failure. Our Triple-Chain Security™ distributes security operations across Ethereum, TON, and Solana networks, ensuring your assets remain secure even if one blockchain is compromised."
              },
              {
                question: "Are time-locked vaults truly irreversible until the time period expires?",
                answer: "Yes, our time-locked vaults use immutable smart contracts that cannot be altered once deployed. The time lock is enforced by blockchain consensus mechanisms, making it mathematically impossible to access assets before the specified time."
              },
              {
                question: "Can I migrate between different vault types?",
                answer: "Yes, we offer vault migration capabilities for most vault types. The migration process includes a security verification step and maintains all the security features of your original vault while adding the new ones of your chosen vault type."
              },
              {
                question: "What happens to my vaults if Chronos Vault ceases operations?",
                answer: "All our vaults are non-custodial and exist on their respective blockchains independent of our company. We provide open-source recovery tools that allow you to access your assets directly from the blockchain even if our services are unavailable."
              },
            ].map((faq, index) => (
              <div key={index} className={`${index > 0 ? 'border-t border-[#333] pt-4 mt-4' : ''}`}>
                <h3 className="text-xl font-medium mb-2 text-white">{faq.question}</h3>
                <p className="text-gray-300">{faq.answer}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link href="/faq">
              <Button className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:opacity-90 text-white">
                View All FAQs
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VaultSchoolPage;