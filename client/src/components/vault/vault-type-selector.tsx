import React from 'react';

// Define as both type and enum for backward compatibility
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
  | 'diamond-hands'
  | 'ai-investment'
  | 'milestone-based'
  | 'family-heritage';

// Create an object with the values as a namespace
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
  AI_INVESTMENT: 'ai-investment' as SpecializedVaultType,
  MILESTONE_BASED: 'milestone-based' as SpecializedVaultType,
  FAMILY_HERITAGE: 'family-heritage' as SpecializedVaultType
};

interface VaultTypeProps {
  selectedType: SpecializedVaultType;
  onChange: (type: SpecializedVaultType) => void;
}

const VaultTypeSelector: React.FC<VaultTypeProps> = ({ selectedType, onChange }) => {
  console.log("VaultTypeSelector rendering with selectedType:", selectedType);
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 gap-4 max-w-7xl mx-auto">
      <VaultTypeCard 
        type="standard"
        title="Sovereign Fortress Vault™"
        description="Ultimate all-in-one vault with supreme security & flexibility"
        icon="👑"
        color="#6B00D7"
        isSelected={selectedType === 'standard'}
        onClick={() => onChange('standard')}
        securityLevel={5}
        complexityLevel={3}
        features={[
          "Adaptive Multi-Layered Security",
          "Quantum-Resistant Encryption",
          "Triple-Chain Protection System",
          "Instant Disaster Recovery",
          "Flexible Access Control Systems",
          "Customizable Security Protocols",
          "Intuitive Ownership Management" 
        ]}
      />
      
      <VaultTypeCard 
        type="multi-signature"
        title="Multi-Signature Vault™"
        description="Our advanced implementation with Triple-Chain security"
        icon="🔐"
        color="#FF5AF7"
        isSelected={selectedType === 'multi-signature'}
        onClick={() => onChange('multi-signature')}
        securityLevel={5}
        complexityLevel={3}
        features={[
          "Triple-Chain verification",
          "Hardware key authentication",
          "Advanced transaction signing",
          "Biometric security options"
        ]}
      />
      
      <VaultTypeCard 
        type="biometric"
        title="Biometric Vault™"
        description="Secure with fingerprint or facial recognition"
        icon="👆"
        color="#00D7C3"
        isSelected={selectedType === 'biometric'}
        onClick={() => onChange('biometric')}
        securityLevel={4}
        complexityLevel={2}
        features={[
          "Fingerprint verification",
          "Facial recognition options",
          "Multi-factor authentication",
          "Tamper-proof security"
        ]}
      />
      
      <VaultTypeCard 
        type="time-lock"
        title="Advanced Time-Lock™"
        description="Schedule complex time-based unlocking"
        icon="⏱️"
        color="#D76B00"
        isSelected={selectedType === 'time-lock'}
        onClick={() => onChange('time-lock')}
        securityLevel={4}
        complexityLevel={3}
        features={[
          "Scheduled unlocking periods", 
          "Multiple time conditions",
          "Calendar-based scheduling",
          "Emergency override options" 
        ]}
      />
      
      <VaultTypeCard 
        type="geolocation"
        title="Geolocation Vault™"
        description="Access only from specific locations"
        icon="📍"
        color="#00D74B"
        isSelected={selectedType === 'geolocation'}
        onClick={() => onChange('geolocation')}
        securityLevel={4}
        complexityLevel={3}
        features={[
          "Location-based access", 
          "Multiple safe zones",
          "GPS verification",
          "Travel permissions" 
        ]}
      />
      
      <VaultTypeCard 
        type="cross-chain"
        title="Cross-Chain Verification™"
        description="Verify assets across multiple blockchains"
        icon="⛓️"
        color="#8B00D7"
        isSelected={selectedType === 'cross-chain'}
        onClick={() => onChange('cross-chain')}
        securityLevel={5}
        complexityLevel={4}
        features={[
          "Triple-Chain Security", 
          "Cross-chain verification protocols",
          "Multi-network validation",
          "Unified security monitoring" 
        ]}
      />
      
      <VaultTypeCard 
        type="smart-contract"
        title="Smart Contract Vault™"
        description="Automated rules and conditions"
        icon="📜"
        color="#5271FF"
        isSelected={selectedType === 'smart-contract'}
        onClick={() => onChange('smart-contract')}
        securityLevel={4}
        complexityLevel={5}
        features={[
          "Conditional access rules", 
          "Automated actions",
          "Event-based triggers",
          "Custom logic implementation" 
        ]}
      />
      
      <VaultTypeCard 
        type="dynamic"
        title="Dynamic Vault™"
        description="Adapt to market or user behavior"
        icon="📊"
        color="#FF5151"
        isSelected={selectedType === 'dynamic'}
        onClick={() => onChange('dynamic')}
        securityLevel={4}
        complexityLevel={5}
        features={[
          "Behavioral adaptability", 
          "Market response strategies",
          "Self-adjusting security",
          "Custom security settings" 
        ]}
      />
      
      <VaultTypeCard 
        type="nft-powered"
        title="NFT-Powered Vault™"
        description="Use NFTs as access keys to your vault"
        icon="🖼️"
        color="#CE19FF"
        isSelected={selectedType === 'nft-powered'}
        onClick={() => onChange('nft-powered')}
        securityLevel={4}
        complexityLevel={3}
        features={[
          "NFT access verification", 
          "Transferable vault access",
          "Digital collectible integration",
          "NFT-based permissions" 
        ]}
      />
      
      <VaultTypeCard 
        type="unique"
        title="Unique Security Vault™"
        description="Enhanced security with custom protocols"
        icon="🛡️"
        color="#fca103"
        isSelected={selectedType === 'unique'}
        onClick={() => onChange('unique')}
        securityLevel={5}
        complexityLevel={4}
        features={[
          "Zero-Knowledge Privacy Layer", 
          "Military-grade encryption",
          "Quantum-resistant protocols",
          "Custom security combinations" 
        ]}
      />
      
      <VaultTypeCard 
        type="ai-intent-inheritance"
        title="AI Intent Inheritance Vault™"
        description="Natural language inheritance planning"
        icon="🧠"
        color="#9E00FF"
        isSelected={selectedType === 'ai-intent-inheritance'}
        onClick={() => onChange('ai-intent-inheritance')}
        securityLevel={5}
        complexityLevel={3}
        features={[
          "Express intent in plain language", 
          "AI-powered smart contract generation",
          "Conditional inheritance rules",
          "Adaptable to complex real-world scenarios"
        ]}
      />

      {/* New specialized vaults */}
      <VaultTypeCard 
        type="memory-vault"
        title="Time-Locked Memory Vault™"
        description="Digital assets with multimedia memories"
        icon="📦"
        color="#FF3A8C"
        isSelected={selectedType === 'memory-vault'}
        onClick={() => onChange('memory-vault')}
        securityLevel={4}
        complexityLevel={3}
        features={[
          "Combined assets and personal media",
          "Photos, videos and messages storage",
          "Synchronized unlocking on future date",
          "Perfect for gifts and personal time capsules"
        ]}
      />

      <VaultTypeCard 
        type="quantum-resistant"
        title="Quantum-Resistant Vault™"
        description="Progressive security that scales with value"
        icon="🔐"
        color="#00B8FF"
        isSelected={selectedType === 'quantum-resistant'}
        onClick={() => onChange('quantum-resistant')}
        securityLevel={5}
        complexityLevel={4}
        features={[
          "Auto-scaling security tiers",
          "Post-quantum cryptography",
          "Value-based security enforcement",
          "Adaptive security protocols"
        ]}
      />

      <VaultTypeCard 
        type="composite-vault"
        title="Cross-Chain Fragment Vault"
        description="Splits your assets across multiple blockchains"
        icon="🧩"
        color="#00E5A0"
        isSelected={selectedType === 'composite-vault'}
        onClick={() => onChange('composite-vault')}
        securityLevel={5}
        complexityLevel={5}
        features={[
          "Asset splitting across chains",
          "Multiple blockchain storage",
          "Fragmented recovery system",
          "Protection from single-chain failures"
        ]}
      />

      <VaultTypeCard 
        type="geo-temporal"
        title="Location-Time Restricted Vault"
        description="Access only at specific locations during set times"
        icon="🌎"
        color="#47A0FF"
        isSelected={selectedType === 'geo-temporal'}
        onClick={() => onChange('geo-temporal')}
        securityLevel={5}
        complexityLevel={4}
        features={[
          "Dual verification: location + time window",
          "Physical presence requirement",
          "Scheduled access periods",
          "Perfect for location-sensitive business assets"
        ]}
      />

      <VaultTypeCard 
        type="diamond-hands"
        title="Investment Discipline Vault"
        description="Prevents emotional selling during market volatility"
        icon="💎"
        color="#3F51FF"
        isSelected={selectedType === 'diamond-hands'}
        onClick={() => onChange('diamond-hands')}
        securityLevel={4}
        complexityLevel={3}
        features={[
          "Programmable exit conditions",
          "Market event-based triggers",
          "Time-locked investment periods",
          "Protection from panic-selling"
        ]}
      />

      {/* New Innovative Vault Types */}
      <VaultTypeCard 
        type="ai-investment"
        title="AI-Assisted Investment Vault"
        description="AI-powered market analysis for optimal trading"
        icon="🤖"
        color="#00E676"
        isSelected={selectedType === 'ai-investment'}
        onClick={() => onChange('ai-investment')}
        securityLevel={5}
        complexityLevel={4}
        features={[
          "AI market trend analysis",
          "Smart trading suggestions",
          "Customizable investment strategies",
          "Automated risk assessment"
        ]}
      />

      <VaultTypeCard 
        type="milestone-based"
        title="Milestone-Based Release Vault"
        description="Unlocks assets when you achieve personal goals"
        icon="🏆"
        color="#FF9800"
        isSelected={selectedType === 'milestone-based'}
        onClick={() => onChange('milestone-based')}
        securityLevel={4}
        complexityLevel={3}
        features={[
          "Achievement-based unlocking",
          "Progressive asset release",
          "Customizable goal verification",
          "Reward system integration"
        ]}
      />

      <VaultTypeCard 
        type="family-heritage"
        title="Family Heritage Vault"
        description="Secure generational wealth transfer with education"
        icon="👪"
        color="#E040FB"
        isSelected={selectedType === 'family-heritage'}
        onClick={() => onChange('family-heritage')}
        securityLevel={5}
        complexityLevel={4}
        features={[
          "Multi-generational planning",
          "Educational content integration",
          "Gradual inheritance mechanism",
          "Family governance protocols"
        ]}
      />
    </div>
  );
};

interface VaultTypeCardProps {
  type: SpecializedVaultType;
  title: string;
  description: string;
  icon: string;
  color: string;
  isSelected: boolean;
  onClick: () => void;
  securityLevel?: number;
  complexityLevel?: number;
  features?: string[];
}

const VaultTypeCard: React.FC<VaultTypeCardProps> = ({ 
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
    <div className="h-full">
      <div 
        className={`
          p-4 rounded-lg cursor-pointer transition-all duration-200 h-full flex flex-col items-center text-center
          ${isSelected ? 'shadow-lg' : 'shadow'} 
          ${isSelected 
            ? 'bg-black/60 border-2' 
            : 'bg-black/40 hover:bg-black/50 border border-gray-800 hover:border-gray-700'
          }
        `}
        style={{
          borderColor: isSelected ? color : undefined,
          boxShadow: isSelected ? `0 0 15px ${color}30` : undefined,
        }}
        onClick={onClick}
      >
        {/* Top section - icon and title */}
        <div 
          className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 text-xl
            ${isSelected 
              ? 'bg-black/70 border border-white/20' 
              : 'bg-black/60'
            }
          `}
          style={{
            boxShadow: isSelected ? `0 0 10px ${color}30` : undefined,
            borderColor: isSelected ? color : undefined
          }}
        >
          {icon}
        </div>
        
        <h3 className={`font-semibold text-base mb-1 ${isSelected ? 'text-white' : 'text-gray-200'}`}>
          {title}
        </h3>
        
        <p className="text-xs text-gray-400 mb-3 max-w-[90%] mx-auto">{description}</p>
        
        {/* Key Technologies */}
        <div className="flex flex-wrap justify-center gap-2 mb-4 w-full">
          <span 
            className="text-[10px] px-2 py-0.5 rounded-full bg-[#6B00D7]/10 border border-[#6B00D7]/30"
            style={{ color: '#8B00D7' }}
          >
            Triple-Chain
          </span>
          <span 
            className="text-[10px] px-2 py-0.5 rounded-full bg-[#FF5AF7]/10 border border-[#FF5AF7]/30"
            style={{ color: '#FF5AF7' }}
          >
            Zero-Knowledge
          </span>
          {securityLevel >= 4 && (
            <span 
              className="text-[10px] px-2 py-0.5 rounded-full bg-[#00D7C3]/10 border border-[#00D7C3]/30"
              style={{ color: '#00D7C3' }}
            >
              Advanced Security
            </span>
          )}
          {securityLevel >= 5 && (
            <span 
              className="text-[10px] px-2 py-0.5 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/30"
              style={{ color: '#FFD700' }}
            >
              Quantum-Resistant
            </span>
          )}
        </div>
        
        {/* Security & Complexity Levels */}
        <div className="grid grid-cols-2 gap-4 mb-4 w-full">
          <div className="flex flex-col items-center">
            <div className="flex justify-center items-center mb-1">
              <span className="text-[10px] text-gray-400 mr-1">Security</span>
              <span className="text-[10px]" style={{ color }}>{securityLevel}/5</span>
            </div>
            <div className="w-full h-2 bg-gray-900 rounded overflow-hidden">
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
          <div className="flex flex-col items-center">
            <div className="flex justify-center items-center mb-1">
              <span className="text-[10px] text-gray-400 mr-1">Complexity</span>
              <span className="text-[10px] text-amber-500">{complexityLevel}/5</span>
            </div>
            <div className="w-full h-2 bg-gray-900 rounded overflow-hidden">
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
        
        {/* Key Features with Center Alignment */}
        <div className="mt-auto w-full">
          <h4 className="text-xs font-semibold text-gray-300 mb-3 text-center">Key Features:</h4>
          <div className="flex flex-col items-center">
            {features.slice(0, 4).map((feature, i) => (
              <div key={i} className="mb-2 flex items-center justify-center">
                <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ backgroundColor: color }}></span>
                <span className="text-[11px]" style={{ color }}>{feature}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Selected indicator */}
        {isSelected && (
          <div className="mt-3 flex justify-center">
            <span className="text-xs bg-black/50 text-white px-3 py-1 rounded-full border border-white/10 flex items-center">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse" />
              Selected
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default VaultTypeSelector;