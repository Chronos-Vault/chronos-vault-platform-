import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

export enum SpecializedVaultType {
  STANDARD = "standard",
  MULTI_SIGNATURE = "multi-signature",
  BIOMETRIC = "biometric",
  TIME_LOCK = "time-lock",
  GEOLOCATION = "geolocation",
  CROSS_CHAIN = "cross-chain",
  SMART_CONTRACT = "smart-contract",
  DYNAMIC = "dynamic",
  NFT_POWERED = "nft-powered"
}

interface VaultTypeOption {
  type: SpecializedVaultType;
  title: string;
  description: string;
  icon: string;
  color: string;
  security: number; // 1-5 rating
  complexity: number; // 1-5 rating
  features: string[];
}

const vaultTypeOptions: VaultTypeOption[] = [
  {
    type: SpecializedVaultType.STANDARD,
    title: "Standard Vault",
    description: "Basic secure vault with time-locking capabilities",
    icon: "ri-safe-2-line",
    color: "#6B00D7",
    security: 3,
    complexity: 1,
    features: ["Time-locked assets", "Secure storage", "Basic access controls"]
  },
  {
    type: SpecializedVaultType.MULTI_SIGNATURE,
    title: "Multi-Signature Vault",
    description: "Requires multiple approvals for transactions, increasing security",
    icon: "ri-team-line",
    color: "#FF5AF7",
    security: 5,
    complexity: 3,
    features: ["Multiple approvers required", "Team or group management", "Enhanced security protocol"]
  },
  {
    type: SpecializedVaultType.BIOMETRIC,
    title: "Biometric Vault",
    description: "Uses biometric verification for maximum security access",
    icon: "ri-fingerprint-line",
    color: "#00D7C3",
    security: 5,
    complexity: 4,
    features: ["Fingerprint verification", "Maximum security", "High-value asset protection"]
  },
  {
    type: SpecializedVaultType.TIME_LOCK,
    title: "Advanced Time-Lock Vault",
    description: "Set specific unlocking schedules for planned asset access",
    icon: "ri-time-line",
    color: "#D76B00",
    security: 4,
    complexity: 2,
    features: ["Scheduled unlocking", "Flexible timing options", "Calendar integration"]
  },
  {
    type: SpecializedVaultType.GEOLOCATION,
    title: "Geolocation Vault",
    description: "Requires physical presence in designated safe zones",
    icon: "ri-map-pin-line",
    color: "#00D74B",
    security: 4,
    complexity: 3,
    features: ["Location-based security", "Geographic verification", "Safe zone designation"]
  },
  {
    type: SpecializedVaultType.CROSS_CHAIN,
    title: "Cross-Chain Vault",
    description: "Manages assets across multiple blockchains for enhanced security",
    icon: "ri-link-m",
    color: "#8B00D7",
    security: 5,
    complexity: 4,
    features: ["Multi-blockchain support", "Chain-specific security", "Asset diversification"]
  },
  {
    type: SpecializedVaultType.SMART_CONTRACT,
    title: "Smart Contract Vault",
    description: "Automates processes based on pre-set conditions",
    icon: "ri-file-code-line",
    color: "#5271FF",
    security: 4,
    complexity: 5,
    features: ["Automated distributions", "Inheritance services", "Conditional triggers"]
  },
  {
    type: SpecializedVaultType.DYNAMIC,
    title: "Dynamic Vault",
    description: "Adjusts rules based on user behavior or external data",
    icon: "ri-settings-5-line",
    color: "#FF5151",
    security: 3,
    complexity: 5,
    features: ["Adaptive security", "Market-responsive adjustments", "AI-enhanced rules"]
  },
  {
    type: SpecializedVaultType.NFT_POWERED,
    title: "NFT-Powered Vault",
    description: "Secures assets tied to NFTs for unique digital assets management",
    icon: "ri-nft-line",
    color: "#CE19FF",
    security: 4,
    complexity: 4,
    features: ["NFT integration", "Fractional ownership", "Digital collectibles security"]
  }
];

interface VaultTypeSelectorProps {
  selectedType: SpecializedVaultType;
  onChange: (type: SpecializedVaultType) => void;
}

const VaultTypeSelector: React.FC<VaultTypeSelectorProps> = ({ selectedType, onChange }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {vaultTypeOptions.map((option) => (
          <Card 
            key={option.type}
            className={`cursor-pointer transition-all hover:shadow-md hover:border-${option.color.replace('#', '')} ${selectedType === option.type ? `border-2 border-${option.color.replace('#', '')} shadow-lg` : 'border border-gray-700'}`}
            onClick={() => {
              onChange(option.type);
            }}
          >
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="mt-1" style={{ color: option.color }}>
                  <i className={`${option.icon} text-2xl`}></i>
                </div>
                <div>
                  <h3 className="font-medium text-white">{option.title}</h3>
                  <p className="text-xs text-gray-400 mt-1">{option.description}</p>
                  
                  <div className="mt-3 space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">Security:</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <div 
                            key={i} 
                            className={`h-1.5 w-3 rounded-sm mx-0.5 ${i < option.security ? 'bg-' + option.color.replace('#', '') : 'bg-gray-700'}`}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">Complexity:</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <div 
                            key={i} 
                            className={`h-1.5 w-3 rounded-sm mx-0.5 ${i < option.complexity ? 'bg-gray-400' : 'bg-gray-700'}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 grid grid-cols-1 gap-1">
                    {option.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-xs">
                        <div className="h-1.5 w-1.5 mr-1.5 rounded-full" style={{ backgroundColor: option.color }} />
                        <span className="text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default VaultTypeSelector;
