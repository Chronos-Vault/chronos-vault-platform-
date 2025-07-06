import React from 'react';

export type SpecializedVaultType = 
  | 'standard' 
  | 'multi-signature' 
  | 'biometric' 
  | 'time-lock' 
  | 'geolocation' 
  | 'cross-chain' 
  | 'smart-contract' 
  | 'dynamic' 
  | 'nft-powered' 
  | 'unique'
  | 'ai-intent-inheritance'
  | 'memory-vault'
  | 'quantum-resistant'
  | 'composite-vault'
  | 'geo-temporal'
  | 'diamond-hands';

export const SpecializedVaultType = {
  STANDARD: 'standard' as SpecializedVaultType,
  MULTI_SIGNATURE: 'multi-signature' as SpecializedVaultType,
  BIOMETRIC: 'biometric' as SpecializedVaultType,
  TIME_LOCK: 'time-lock' as SpecializedVaultType,
  GEOLOCATION: 'geolocation' as SpecializedVaultType,
  CROSS_CHAIN: 'cross-chain' as SpecializedVaultType,
  SMART_CONTRACT: 'smart-contract' as SpecializedVaultType,
  DYNAMIC: 'dynamic' as SpecializedVaultType,
  NFT_POWERED: 'nft-powered' as SpecializedVaultType,
  UNIQUE: 'unique' as SpecializedVaultType,
  AI_INTENT_INHERITANCE: 'ai-intent-inheritance' as SpecializedVaultType,
  MEMORY_VAULT: 'memory-vault' as SpecializedVaultType,
  QUANTUM_RESISTANT: 'quantum-resistant' as SpecializedVaultType,
  COMPOSITE_VAULT: 'composite-vault' as SpecializedVaultType,
  GEO_TEMPORAL: 'geo-temporal' as SpecializedVaultType,
  DIAMOND_HANDS: 'diamond-hands' as SpecializedVaultType,
};

export interface VaultType {
  id: SpecializedVaultType;
  name: string;
  description: string;
  icon: string;
  color: string;
  features: string[];
  securityLevel: number;
  complexityLevel: number;
  tags: string[];
}

export const vaultTypes: VaultType[] = [
  {
    id: "standard",
    name: "Standard Vault",
    description: "Basic time-locked vault",
    icon: "🔒",
    color: "#FF5AF7",
    features: ["Simple time-lock", "Customizable unlocking", "Multiple formats", "Asset Storage"],
    securityLevel: 3,
    complexityLevel: 1,
    tags: ["Triple-Chain", "Zero-Knowledge"]
  },
  {
    id: "multi-signature",
    name: "Multi-Signature Vault",
    description: "Require multiple keys to unlock",
    icon: "🔑",
    color: "#5271FF",
    features: ["Multiple approvers required", "Threshold configuration", "Request notifications", "Inheritance planning"],
    securityLevel: 4,
    complexityLevel: 3,
    tags: ["Triple-Chain", "Zero-Knowledge", "Advanced Security"]
  },
  {
    id: "biometric",
    name: "Biometric Vault",
    description: "Unlock with biometric verification",
    icon: "👁️",
    color: "#00D7C3",
    features: ["Facial recognition", "Fingerprint verification", "Voice authentication", "Behavioral analysis"],
    securityLevel: 4,
    complexityLevel: 3,
    tags: ["Triple-Chain", "Zero-Knowledge", "Advanced Security"]
  },
  {
    id: "time-lock",
    name: "Temporal Vault",
    description: "Advanced time-based conditions",
    icon: "⏱️",
    color: "#F1C40F",
    features: ["Calendar scheduling", "Periodic unlocking", "Conditional time triggers", "Temporal signatures"],
    securityLevel: 3,
    complexityLevel: 2,
    tags: ["Triple-Chain", "Zero-Knowledge"]
  },
  {
    id: "geolocation",
    name: "Geo-Location Vault",
    description: "Unlock based on physical location",
    icon: "📍",
    color: "#00D74B",
    features: ["Location-based access", "Multiple safe zones", "GPS verification", "Travel permissions"],
    securityLevel: 4,
    complexityLevel: 3,
    tags: ["Triple-Chain", "Zero-Knowledge", "Advanced Security"]
  },
  {
    id: "cross-chain",
    name: "Cross-Chain Verification",
    description: "Verify assets across multiple blockchains",
    icon: "⛓️",
    color: "#8B00D7",
    features: ["Triple-Chain Security", "Cross-chain verification protocols", "Multi-network validation", "Unified security monitoring"],
    securityLevel: 5,
    complexityLevel: 4,
    tags: ["Triple-Chain", "Zero-Knowledge", "Advanced Security"]
  },
  {
    id: "smart-contract",
    name: "Smart Contract Vault",
    description: "Automated rules and conditions",
    icon: "📜",
    color: "#5271FF",
    features: ["Conditional access rules", "Automated actions", "Event-based triggers", "Custom logic implementation"],
    securityLevel: 4,
    complexityLevel: 5,
    tags: ["Advanced Security"]
  },
  {
    id: "dynamic",
    name: "Dynamic Vault",
    description: "Adaptable security parameters",
    icon: "🔄",
    color: "#E74C3C",
    features: ["Adjustable security levels", "Dynamic access controls", "Automatic rule adjustments", "Adaptive verification"],
    securityLevel: 5,
    complexityLevel: 4,
    tags: ["Triple-Chain", "Zero-Knowledge", "Advanced Security"]
  }
];

interface VaultTypeSelectorProps {
  selectedType: SpecializedVaultType;
  onSelect: (type: SpecializedVaultType) => void;
}

const FreshVaultSelector: React.FC<VaultTypeSelectorProps> = ({ selectedType, onSelect }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
      {vaultTypes.map((vaultType) => (
        <VaultCard
          key={vaultType.id}
          title={vaultType.name}
          description={vaultType.description}
          icon={vaultType.icon}
          color={vaultType.color}
          isSelected={selectedType === vaultType.id}
          onClick={() => onSelect(vaultType.id)}
          securityLevel={vaultType.securityLevel}
          complexityLevel={vaultType.complexityLevel}
          features={vaultType.features}
        />
      ))}
    </div>
  );
};

type VaultCardProps = {
  title: string;
  description: string;
  icon: string;
  color: string;
  isSelected: boolean;
  onClick: () => void;
  securityLevel?: number;
  complexityLevel?: number;
  features?: string[];
};

const VaultCard: React.FC<VaultCardProps> = ({ 
  title, 
  description, 
  icon, 
  color, 
  isSelected, 
  onClick,
  securityLevel = 3,
  complexityLevel = 2,
  features = []
}) => {
  return (
    <div 
      className={`p-4 rounded-lg cursor-pointer h-full border ${
        isSelected ? 'bg-black/40 border-[' + color + ']' : 'bg-black/20 border-gray-800 hover:border-gray-700'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center mb-3">
        <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center mr-3 text-2xl">
          {icon}
        </div>
        <div>
          <h3 className="font-medium text-white">{title}</h3>
          <p className="text-sm text-gray-400">{description}</p>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-1.5 mb-3">
        {securityLevel >= 3 && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-[#6B00D7]/20 text-[#9E00FF] border border-[#6B00D7]/30">
            Triple-Chain
          </span>
        )}
        {securityLevel >= 2 && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-[#FF5AF7]/20 text-[#FF5AF7] border border-[#FF5AF7]/30">
            Zero-Knowledge
          </span>
        )}
        {securityLevel >= 4 && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-[#00D7C3]/20 text-[#00D7C3] border border-[#00D7C3]/30">
            Advanced Security
          </span>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-gray-400">Security</span>
            <span className="text-xs" style={{ color }}>{securityLevel}/5</span>
          </div>
          <div className="w-full h-1.5 bg-gray-900 rounded overflow-hidden">
            <div 
              className="h-full" 
              style={{
                width: `${(securityLevel / 5) * 100}%`,
                backgroundColor: color,
                opacity: 0.7
              }}
            />
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-gray-400">Complexity</span>
            <span className="text-xs text-amber-500">{complexityLevel}/5</span>
          </div>
          <div className="w-full h-1.5 bg-gray-900 rounded overflow-hidden">
            <div 
              className="h-full bg-amber-500"
              style={{
                width: `${(complexityLevel / 5) * 100}%`,
                opacity: 0.7
              }}
            />
          </div>
        </div>
      </div>
      
      <h4 className="text-xs font-semibold text-gray-300 mb-2">Key Features:</h4>
      <ul className="grid grid-cols-1 gap-1.5">
        {features.slice(0, 4).map((feature, i) => (
          <li key={i} className="flex items-start">
            <span className="inline-block w-2 h-2 rounded-full mt-1.5 mr-2" style={{ backgroundColor: color }}></span>
            <span className="text-xs text-gray-300">{feature}</span>
          </li>
        ))}
      </ul>
      
      {isSelected && (
        <div className="mt-3 text-xs text-center">
          <span className="inline-flex items-center text-green-400">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1">
              <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18457 2.99721 7.13633 4.39828 5.49707C5.79935 3.85782 7.69279 2.71538 9.79619 2.24015C11.8996 1.76491 14.1003 1.98234 16.07 2.86" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Selected
          </span>
        </div>
      )}
    </div>
  );
};

export default FreshVaultSelector;