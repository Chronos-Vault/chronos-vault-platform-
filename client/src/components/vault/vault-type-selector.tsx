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
  MEMORY_VAULT: 'memory-vault' as SpecializedVaultType,
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
        title="Multi-Signature Vault"
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
        title="Cross-Chain Verification"
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
        type="memory-vault"
        title="Time-Locked Memory Vault"
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
  const [rotate, setRotate] = React.useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = React.useState(false);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isHovered && !isSelected) return;
    
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 25;
    const rotateY = (centerX - x) / 25;
    
    setRotate({ x: rotateX, y: rotateY });
  };
  
  const resetRotation = () => {
    setRotate({ x: 0, y: 0 });
    setIsHovered(false);
  };
  
  return (
    <div 
      className="perspective-1000 transform-gpu h-full"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={resetRotation}
    >
      <div 
        className={`
          p-3 sm:p-4 rounded-lg cursor-pointer transition-all duration-300 h-full flex flex-col
          ${isHovered || isSelected ? 'shadow-xl' : 'shadow'}
          ${isSelected 
            ? 'bg-gradient-to-b from-black/60 to-black/40 border-2' 
            : 'bg-gradient-to-b from-black/40 to-black/20 hover:bg-black/30 border border-gray-800 hover:border-gray-700'
          }
        `}
        style={{
          borderColor: isSelected ? color : undefined,
          boxShadow: isSelected ? `0 0 20px ${color}40` : undefined,
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
          transition: isHovered ? 'transform 0.1s ease-out, box-shadow 0.3s ease, background 0.3s ease, border-color 0.3s ease' : 'transform 0.5s ease-out, box-shadow 0.3s ease, background 0.3s ease, border-color 0.3s ease',
        }}
        onClick={onClick}
      >
        {/* Holographic overlay effect */}
        <div className={`absolute inset-0 holographic-overlay rounded-lg pointer-events-none ${isSelected ? 'opacity-30' : ''}`} />
        
        {/* Security beams - only visible when selected */}
        {isSelected && (
          <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
            <div className="absolute inset-0 opacity-20">
              {Array.from({ length: securityLevel }).map((_, i) => (
                <div 
                  key={i}
                  className="absolute inset-0 rounded-full blur-3xl"
                  style={{
                    backgroundColor: color,
                    opacity: 0.05 + (i * 0.02),
                    transform: `scale(${0.6 + (i * 0.1)})`,
                    animation: `pulse ${3 + i}s infinite ease-in-out`,
                  }}
                />
              ))}
            </div>
          </div>
        )}
        
        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center mb-3 flex-col sm:flex-row text-center sm:text-left">
            <div 
              className={`w-11 h-11 rounded-full flex items-center justify-center mb-2 sm:mb-0 sm:mr-3 text-xl
                ${isSelected 
                  ? 'bg-gradient-to-br from-black/50 to-black/20 backdrop-blur-sm border border-white/10' 
                  : 'bg-black/50'
                }
              `}
              style={{
                boxShadow: isSelected ? `0 0 10px ${color}80` : `0 0 5px ${color}40`,
                background: isSelected 
                  ? `radial-gradient(circle, ${color}40 0%, ${color}10 70%, transparent 100%)`
                  : `radial-gradient(circle, ${color}30 0%, ${color}05 70%, transparent 100%)`
              }}
            >
              {icon}
            </div>
            <h3 
              className={`font-semibold text-sm sm:text-base ${isSelected ? 'text-white' : 'text-gray-200'}`}
              style={{ 
                color: isSelected ? 'white' : undefined,
                textShadow: isSelected ? `0 0 8px ${color}80` : undefined 
              }}
            >
              {title}
            </h3>
          </div>
          
          <p className="text-xs text-gray-400 text-center sm:text-left mb-3">{description}</p>
          
          {/* Technology Badges */}
          <div className="flex flex-wrap justify-center sm:justify-start gap-1 mb-3">
            <span 
              className="text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-full bg-[#6B00D7]/10 border border-[#6B00D7]/30"
              style={{ color: '#8B00D7' }}
            >
              Triple-Chain
            </span>
            <span 
              className="text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-full bg-[#FF5AF7]/10 border border-[#FF5AF7]/30"
              style={{ color: '#FF5AF7' }}
            >
              Cross-Chain
            </span>
            <span 
              className="text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-full bg-[#00D7C3]/10 border border-[#00D7C3]/30"
              style={{ color: '#00D7C3' }}
            >
              Multi-Payment
            </span>
          </div>
          
          {/* Security & Complexity indicators with larger bars */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] sm:text-xs text-gray-500">Security</span>
                <span className="text-[10px] sm:text-xs" style={{ color }}>{securityLevel}/5</span>
              </div>
              <div className="flex h-2 bg-gray-900 rounded overflow-hidden">
                <div 
                  className="h-full rounded"
                  style={{ 
                    width: `${(securityLevel / 5) * 100}%`,
                    background: `linear-gradient(90deg, ${color}60, ${color})`,
                    boxShadow: isSelected ? `0 0 8px ${color}80` : undefined
                  }}
                />
              </div>
            </div>
            
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] sm:text-xs text-gray-500">Complexity</span>
                <span className="text-[10px] sm:text-xs text-gray-400">{complexityLevel}/5</span>
              </div>
              <div className="flex h-2 bg-gray-900 rounded overflow-hidden">
                <div 
                  className="h-full rounded bg-gray-500"
                  style={{ 
                    width: `${(complexityLevel / 5) * 100}%`,
                    opacity: isSelected ? 0.9 : 0.6
                  }}
                />
              </div>
            </div>
          </div>
          
          {/* Features List */}
          {(isSelected || isHovered) && features.length > 0 && (
            <div 
              className={`
                mt-3 pt-3 border-t border-gray-800 ${isSelected ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300
                ${isHovered && !isSelected ? 'opacity-100' : ''}
              `}
            >
              <p className="text-[10px] sm:text-xs font-medium text-gray-300 mb-2">
                <span className="inline-block mr-1 w-2 h-2 rounded-full" style={{ backgroundColor: color }}></span>
                Key Features:
              </p>
              <ul className="text-[9px] sm:text-[10px] text-gray-400 grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-1">
                {features.slice(0, 6).map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span style={{ color }} className="mr-1 flex-shrink-0">•</span>
                    <span className="flex-1">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Bottom action indicator - only on selected */}
          {isSelected && (
            <div className="mt-3 pt-3 border-t border-gray-800 text-center">
              <span 
                className="inline-block text-[10px] font-medium px-3 py-1 rounded-full"
                style={{ 
                  background: `linear-gradient(90deg, ${color}20, ${color}50, ${color}20)`,
                  color: 'white',
                  textShadow: `0 0 4px ${color}`,
                  boxShadow: `0 0 10px ${color}50`
                }}
              >
                Selected
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VaultTypeSelector;