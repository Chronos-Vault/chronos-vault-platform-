import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

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
    isNew: true,
    highlight: true,
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
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Welcome to Vault School - your comprehensive resource to learn about Chronos Vault's
          specialized vault types, their features, and technical implementations.
        </p>
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