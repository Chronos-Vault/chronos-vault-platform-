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
  | 'memory-capsule'
  | 'quantum-resistant'
  | 'composite-vault'
  | 'geo-temporal'
  | 'diamond-hands';

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
  MEMORY_CAPSULE: 'memory-capsule' as SpecializedVaultType,
  QUANTUM_RESISTANT: 'quantum-resistant' as SpecializedVaultType,
  COMPOSITE_VAULT: 'composite-vault' as SpecializedVaultType,
  GEO_TEMPORAL: 'geo-temporal' as SpecializedVaultType,
  DIAMOND_HANDS: 'diamond-hands' as SpecializedVaultType
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
        title="Standard Vault"
        description="Basic time-lock vault with essential features"
        icon="🔒"
        color="#6B00D7"
        isSelected={selectedType === 'standard'}
        onClick={() => onChange('standard')}
        securityLevel={3}
        complexityLevel={1}
        features={[
          "Time-based unlocking",
          "Basic encryption",
          "Owner & beneficiary access"
        ]}
      />
      
      <VaultTypeCard 
        type="multi-signature"
        title="Multi-Signature"
        description="Require multiple signatures to access vault"
        icon="📝"
        color="#FF5AF7"
        isSelected={selectedType === 'multi-signature'}
        onClick={() => onChange('multi-signature')}
        securityLevel={5}
        complexityLevel={3}
        features={[
          "Multiple approvers required",
          "Customizable signature threshold",
          "Team member management",
          "Enhanced security protocol"
        ]}
      />
      
      <VaultTypeCard 
        type="biometric"
        title="Biometric"
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
        title="Advanced Time-Lock"
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
        title="Geolocation"
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
        title="Cross-Chain"
        description="Secure assets across multiple blockchains"
        icon="⛓️"
        color="#8B00D7"
        isSelected={selectedType === 'cross-chain'}
        onClick={() => onChange('cross-chain')}
        securityLevel={5}
        complexityLevel={4}
        features={[
          "Triple-Chain Security", 
          "Cross-chain transactions",
          "Multi-network support",
          "Unified asset management" 
        ]}
      />
      
      <VaultTypeCard 
        type="smart-contract"
        title="Smart Contract"
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
        title="Dynamic"
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
        title="NFT-Powered"
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
        title="Unique Security"
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
        title="AI Intent Inheritance"
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
        type="memory-capsule"
        title="Memory Vault"
        description="Multimedia vault unlocking on set date"
        icon="📦"
        color="#FF3A8C"
        isSelected={selectedType === 'memory-capsule'}
        onClick={() => onChange('memory-capsule')}
        securityLevel={4}
        complexityLevel={3}
        features={[
          "Multimedia content support",
          "Synchronized asset unlocking",
          "Interactive memory experiences",
          "Gift messaging and personalization"
        ]}
      />

      <VaultTypeCard 
        type="quantum-resistant"
        title="Quantum-Resistant"
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
        title="Composite Vault"
        description="Fragment assets across multiple chains"
        icon="🧩"
        color="#00E5A0"
        isSelected={selectedType === 'composite-vault'}
        onClick={() => onChange('composite-vault')}
        securityLevel={5}
        complexityLevel={5}
        features={[
          "Multi-chain fragmentation",
          "Distributed asset storage",
          "Cross-chain verification mechanism",
          "Enhanced disaster recovery"
        ]}
      />

      <VaultTypeCard 
        type="geo-temporal"
        title="Geo-Temporal"
        description="Location and time-based restrictions"
        icon="🌎"
        color="#47A0FF"
        isSelected={selectedType === 'geo-temporal'}
        onClick={() => onChange('geo-temporal')}
        securityLevel={5}
        complexityLevel={4}
        features={[
          "Combined location & time validation",
          "Geographical access boundaries",
          "Temporal access windows",
          "Presence verification protocol"
        ]}
      />

      <VaultTypeCard 
        type="diamond-hands"
        title="Diamond Hands"
        description="Enforce investment holding periods"
        icon="💎"
        color="#3F51FF"
        isSelected={selectedType === 'diamond-hands'}
        onClick={() => onChange('diamond-hands')}
        securityLevel={4}
        complexityLevel={3}
        features={[
          "Programmed hodling enforcement",
          "Market condition triggers",
          "Strategic exit planning",
          "Investment discipline mechanisms"
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
    <div 
      className={`
        p-3 sm:p-4 rounded-lg cursor-pointer transition-all duration-200 h-full hover:translate-y-[-4px] flex flex-col
        ${isSelected ? 'bg-gradient-to-r from-black/40 to-black/20 shadow-lg' : 'border border-gray-700 bg-black/20 hover:bg-black/40'}
      `}
      style={{
        borderColor: isSelected ? color : undefined,
        borderWidth: isSelected ? '2px' : '1px',
        boxShadow: isSelected ? `0 0 15px ${color}40` : undefined
      }}
      onClick={onClick}
    >
      <div className="flex items-center mb-2 flex-col sm:flex-row text-center sm:text-left">
        <div 
          className={`w-9 h-9 rounded-full flex items-center justify-center mb-1 sm:mb-0 sm:mr-2 text-lg`}
          style={{ backgroundColor: `${color}40` }}
        >
          {icon}
        </div>
        <h3 
          className="font-medium text-sm sm:text-base"
          style={{ color: isSelected ? color : 'white' }}
        >
          {title}
        </h3>
      </div>
      <p className="text-xs text-gray-400 text-center sm:text-left mt-1">{description}</p>
      
      {/* Technology Badges */}
      <div className="mt-2 flex flex-wrap justify-center sm:justify-start gap-1">
        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#6B00D7]/20 text-[#FF5AF7] border border-[#6B00D7]/30">Triple-Chain</span>
        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#FF5AF7]/20 text-[#FF5AF7] border border-[#FF5AF7]/30">Cross-Chain</span>
        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#00D7C3]/20 text-[#00D7C3] border border-[#00D7C3]/30">Multi-Payment</span>
      </div>
      
      {/* Security Level Indicator */}
      <div className="flex flex-col items-center sm:flex-row sm:justify-between mt-3 mb-1 space-y-3 sm:space-y-0">
        <div className="flex flex-col items-center sm:items-center">
          <span className="text-[10px] sm:text-xs text-gray-500 mb-1 sm:mb-1.5">Security:</span>
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <div 
                key={`security-${i}`}
                className={`w-2 h-2.5 sm:h-3 mx-0.5 rounded-sm`}
                style={{ backgroundColor: i < securityLevel ? color : '#374151' }}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center sm:items-center">
          <span className="text-[10px] sm:text-xs text-gray-500 mb-1 sm:mb-1.5">Complexity:</span>
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <div 
                key={`complexity-${i}`}
                className={`w-2 h-2.5 sm:h-3 mx-0.5 rounded-sm`}
                style={{ backgroundColor: i < complexityLevel ? '#a0a0a0' : '#374151' }}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Features (visible when selected) */}
      {isSelected && features.length > 0 && (
        <div className="mt-3 pt-2 sm:pt-3 border-t border-gray-700 mt-auto">
          <p className="text-[10px] sm:text-xs font-medium text-gray-300 mb-1 text-center sm:text-left">Key Features:</p>
          <ul className="text-[10px] sm:text-xs text-gray-400">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start mb-1 sm:mb-2">
                <span style={{ color: color }} className="mr-1 mt-0.5 flex-shrink-0 text-sm">•</span>
                <span className="flex-1">{feature}</span>
              </li>
            ))}
          </ul>
          
          {/* Core Technology Features - Always shown when selected */}
          <div className="mt-2 pt-2 border-t border-gray-700">
            <p className="text-[10px] sm:text-xs font-medium text-gray-300 mb-1 text-center sm:text-left">Core Technologies:</p>
            <ul className="text-[10px] sm:text-xs text-gray-400">
              <li className="flex items-start mb-1 sm:mb-2">
                <span style={{ color: '#6B00D7' }} className="mr-1 mt-0.5 flex-shrink-0 text-sm">•</span>
                <span className="flex-1">Triple-Chain Security Architecture</span>
              </li>
              <li className="flex items-start mb-1 sm:mb-2">
                <span style={{ color: '#FF5AF7' }} className="mr-1 mt-0.5 flex-shrink-0 text-sm">•</span>
                <span className="flex-1">Cross-Chain Asset Storage</span>
              </li>
              <li className="flex items-start mb-1 sm:mb-2">
                <span style={{ color: '#00D7C3' }} className="mr-1 mt-0.5 flex-shrink-0 text-sm">•</span>
                <span className="flex-1">Multiple Payment Methods</span>
              </li>
              <li className="flex items-start">
                <span style={{ color: '#D76B00' }} className="mr-1 mt-0.5 flex-shrink-0 text-sm">•</span>
                <span className="flex-1">Zero-Knowledge Privacy Layer</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default VaultTypeSelector;