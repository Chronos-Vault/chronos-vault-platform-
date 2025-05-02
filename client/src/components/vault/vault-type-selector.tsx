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
  | 'unique';

interface VaultTypeProps {
  selectedType: SpecializedVaultType;
  onChange: (type: SpecializedVaultType) => void;
}

const VaultTypeSelector: React.FC<VaultTypeProps> = ({ selectedType, onChange }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
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
        p-3 sm:p-4 rounded-lg cursor-pointer transition-all duration-200 h-full
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
      
      {/* Security Level Indicator */}
      <div className="flex justify-between items-center mt-3 mb-1">
        <div className="flex items-center">
          <span className="text-xs text-gray-500 mr-2">Security:</span>
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <div 
                key={`security-${i}`}
                className={`w-1.5 h-3 mx-0.5 rounded-sm ${i < securityLevel ? `bg-[${color}]` : 'bg-gray-700'}`}
                style={{ backgroundColor: i < securityLevel ? color : undefined }}
              />
            ))}
          </div>
        </div>
        <div className="flex items-center">
          <span className="text-xs text-gray-500 mr-2">Complexity:</span>
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <div 
                key={`complexity-${i}`}
                className={`w-1.5 h-3 mx-0.5 rounded-sm ${i < complexityLevel ? 'bg-gray-400' : 'bg-gray-700'}`}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Features (visible when selected) */}
      {isSelected && features.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-700">
          <p className="text-xs font-medium text-gray-300 mb-1">Key Features:</p>
          <ul className="text-xs text-gray-400">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start mb-1">
                <span style={{ color: color }} className="mr-1 mt-0.5">•</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default VaultTypeSelector;