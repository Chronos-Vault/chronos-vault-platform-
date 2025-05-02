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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <VaultTypeCard 
        type="standard"
        title="Standard Vault"
        description="Basic time-lock vault with essential features"
        icon="🔒"
        color="#6B00D7"
        isSelected={selectedType === 'standard'}
        onClick={() => onChange('standard')}
      />
      
      <VaultTypeCard 
        type="multi-signature"
        title="Multi-Signature"
        description="Require multiple signatures to access vault"
        icon="📝"
        color="#FF5AF7"
        isSelected={selectedType === 'multi-signature'}
        onClick={() => onChange('multi-signature')}
      />
      
      <VaultTypeCard 
        type="biometric"
        title="Biometric"
        description="Secure with fingerprint or facial recognition"
        icon="👆"
        color="#00D7C3"
        isSelected={selectedType === 'biometric'}
        onClick={() => onChange('biometric')}
      />
      
      <VaultTypeCard 
        type="time-lock"
        title="Advanced Time-Lock"
        description="Schedule complex time-based unlocking"
        icon="⏱️"
        color="#D76B00"
        isSelected={selectedType === 'time-lock'}
        onClick={() => onChange('time-lock')}
      />
      
      <VaultTypeCard 
        type="geolocation"
        title="Geolocation"
        description="Access only from specific locations"
        icon="📍"
        color="#00D74B"
        isSelected={selectedType === 'geolocation'}
        onClick={() => onChange('geolocation')}
      />
      
      <VaultTypeCard 
        type="cross-chain"
        title="Cross-Chain"
        description="Secure assets across multiple blockchains"
        icon="⛓️"
        color="#8B00D7"
        isSelected={selectedType === 'cross-chain'}
        onClick={() => onChange('cross-chain')}
      />
      
      <VaultTypeCard 
        type="smart-contract"
        title="Smart Contract"
        description="Automated rules and conditions"
        icon="📜"
        color="#5271FF"
        isSelected={selectedType === 'smart-contract'}
        onClick={() => onChange('smart-contract')}
      />
      
      <VaultTypeCard 
        type="dynamic"
        title="Dynamic"
        description="Adapt to market or user behavior"
        icon="📊"
        color="#FF5151"
        isSelected={selectedType === 'dynamic'}
        onClick={() => onChange('dynamic')}
      />
      
      <VaultTypeCard 
        type="nft-powered"
        title="NFT-Powered"
        description="Use NFTs as access keys to your vault"
        icon="🖼️"
        color="#CE19FF"
        isSelected={selectedType === 'nft-powered'}
        onClick={() => onChange('nft-powered')}
      />
      
      <VaultTypeCard 
        type="unique"
        title="Unique Security"
        description="Enhanced security with custom protocols"
        icon="🛡️"
        color="#fca103"
        isSelected={selectedType === 'unique'}
        onClick={() => onChange('unique')}
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
}

const VaultTypeCard: React.FC<VaultTypeCardProps> = ({ 
  title, 
  description, 
  icon, 
  color, 
  isSelected, 
  onClick 
}) => {
  return (
    <div 
      className={`
        p-4 rounded-lg cursor-pointer transition-all duration-200 
        ${isSelected ? `border-2 border-[${color}] bg-[${color}]/10` : 'border border-gray-700 bg-black/20 hover:bg-black/40'}
      `}
      onClick={onClick}
    >
      <div className="flex items-center mb-2">
        <div 
          className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 text-lg`}
          style={{ backgroundColor: `${color}40` }}
        >
          {icon}
        </div>
        <h3 
          className="font-medium text-base"
          style={{ color: isSelected ? color : 'white' }}
        >
          {title}
        </h3>
      </div>
      <p className="text-xs text-gray-400">{description}</p>
    </div>
  );
};

export default VaultTypeSelector;