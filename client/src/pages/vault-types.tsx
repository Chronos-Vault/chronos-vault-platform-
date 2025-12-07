import { useState } from 'react';
import { useLocation } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Shield, 
  Lock, 
  Clock, 
  Sparkles, 
  CheckCircle, 
  KeyRound,
  Loader2,
  ExternalLink,
  AlertCircle,
  X,
  Wallet,
  Users,
  Calendar,
  Zap,
  Gem,
  MapPin,
  Heart,
  Brain,
  Globe
} from 'lucide-react';
import { SiBitcoin as Bitcoin } from 'react-icons/si';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';

interface VaultType {
  id: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  category: 'security' | 'blockchain' | 'investment' | 'legacy' | 'premium';
  features: string[];
  primaryChains: string[];
  securityLevel: number;
  documentationPath: string;
  tags: string[];
  status: 'beta' | 'ga' | 'coming-soon';
  icon: string;
  gradientColors: string;
  creationEndpoint?: string;
  securityProtocols: string[];
}

interface VaultCatalogResponse {
  success: boolean;
  totalVaults: number;
  categories: {
    security: number;
    blockchain: number;
    investment: number;
    legacy: number;
    premium: number;
  };
  vaultTypes: VaultType[];
}

interface VaultCreationResult {
  success: boolean;
  vaultId: string;
  ethereumTxHash?: string;
  solanaTxHash?: string;
  tonTxHash?: string;
  trinityHash?: string;
  message: string;
}

interface VaultCardProps {
  vault: VaultType;
  selected: boolean;
  onClick: () => void;
}

const VaultCard = ({ vault, selected, onClick }: VaultCardProps) => {
  const { name, shortDescription, icon, securityLevel, features, tags, gradientColors, primaryChains } = vault;
  
  const getColorFromGradient = (gradient: string): string => {
    if (gradient.includes('purple')) return '#6B00D7';
    if (gradient.includes('pink')) return '#FF5AF7';
    if (gradient.includes('blue')) return '#3B82F6';
    if (gradient.includes('green')) return '#10B981';
    if (gradient.includes('amber') || gradient.includes('orange')) return '#F59E0B';
    if (gradient.includes('red')) return '#EF4444';
    if (gradient.includes('cyan')) return '#06B6D4';
    if (gradient.includes('violet')) return '#8B5CF6';
    if (gradient.includes('emerald')) return '#10B981';
    if (gradient.includes('gray') || gradient.includes('slate')) return '#6B7280';
    return '#6B00D7';
  };
  
  const color = getColorFromGradient(gradientColors);
  
  return (
    <motion.div 
      className={`relative rounded-xl p-6 transition-all duration-300 cursor-pointer ${
        selected ? 'bg-white/10 border-2' : 'bg-black/40 border border-gray-800 hover:bg-white/5'
      }`}
      style={{ borderColor: selected ? color : undefined }}
      onClick={onClick}
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      data-testid={`vault-card-${vault.id}`}
    >
      <div className="flex items-start mb-3">
        <div className="text-2xl mr-3">{icon}</div>
        <div>
          <h3 className="text-lg font-bold text-white">{name}</h3>
          <div className="text-sm opacity-60">{shortDescription}</div>
        </div>
      </div>
      
      <div className="flex justify-between mb-4">
        <div className="w-1/2 pr-2">
          <div className="text-xs uppercase tracking-wider opacity-60 mb-1">Security</div>
          <div className="flex items-center">
            {Array(5).fill(0).map((_, i) => (
              <div 
                key={i} 
                className="w-4 h-1 rounded-full mr-1" 
                style={{ 
                  backgroundColor: i < securityLevel 
                    ? color
                    : 'rgba(255,255,255,0.1)'
                }}
              />
            ))}
            <span className="text-xs ml-1">{securityLevel}/5</span>
          </div>
        </div>
        <div className="w-1/2 pl-2">
          <div className="text-xs uppercase tracking-wider opacity-60 mb-1">Chains</div>
          <div className="flex items-center gap-1">
            {primaryChains.slice(0, 3).map((chain) => (
              <span key={chain} className="text-xs px-1.5 py-0.5 bg-white/10 rounded">
                {chain.charAt(0).toUpperCase()}
              </span>
            ))}
            {primaryChains.length > 3 && (
              <span className="text-xs opacity-60">+{primaryChains.length - 3}</span>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-3">
        {tags.slice(0, 3).map((tag) => (
          <span 
            key={tag} 
            className="inline-block px-2 py-1 text-xs rounded-md"
            style={{ backgroundColor: `${color}20` }}
          >
            {tag}
          </span>
        ))}
      </div>
      
      {selected && (
        <motion.div 
          className="mt-4"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-xs uppercase tracking-wider opacity-60 mb-2">Key Features</div>
          <ul className="space-y-1">
            {features.slice(0, 4).map((feature, idx) => (
              <li key={idx} className="flex items-start text-sm">
                <Check className="h-4 w-4 mr-2 mt-0.5" style={{ color }} />
                {feature}
              </li>
            ))}
          </ul>
        </motion.div>
      )}
      
      {selected && (
        <div 
          className="absolute -right-2 -top-2 w-5 h-5 rounded-full flex items-center justify-center"
          style={{ backgroundColor: color }}
        >
          <Check className="h-3 w-3 text-black" />
        </div>
      )}
    </motion.div>
  );
};

interface SecurityFeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const SecurityFeatureCard = ({ title, description, icon, color }: SecurityFeatureCardProps) => (
  <div className="bg-black/30 backdrop-blur-sm border border-gray-800 rounded-xl p-6 transition-all hover:border-gray-700">
    <div className="flex items-center mb-3">
      <div 
        className="w-10 h-10 rounded-lg flex items-center justify-center mr-3"
        style={{ backgroundColor: `${color}20` }}
      >
        {icon}
      </div>
      <h3 className="text-lg font-bold">{title}</h3>
    </div>
    <p className="text-gray-400">{description}</p>
  </div>
);

type CategoryKey = 'all' | 'premium' | 'security' | 'investment' | 'legacy' | 'blockchain';

const VaultTypesPage = () => {
  const [selectedVaultId, setSelectedVaultId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createVaultType, setCreateVaultType] = useState<VaultType | null>(null);
  const [creationResult, setCreationResult] = useState<VaultCreationResult | null>(null);
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  const { data: catalogData, isLoading, error } = useQuery<VaultCatalogResponse>({
    queryKey: ['/api/vault-catalog'],
  });
  
  const vaultTypes = catalogData?.vaultTypes || [];
  const selectedVault = vaultTypes.find(v => v.id === selectedVaultId) || vaultTypes[0];
  
  const vaultCategories: Record<CategoryKey, { title: string; color: string; icon: string; vaults: VaultType[] }> = {
    all: {
      title: 'All Vaults',
      color: '#6B00D7',
      icon: '🏰',
      vaults: vaultTypes
    },
    premium: {
      title: 'Premium Vaults',
      color: '#FF5AF7',
      icon: '👑',
      vaults: vaultTypes.filter(v => v.category === 'premium' || v.securityLevel === 5)
    },
    security: {
      title: 'Security Vaults',
      color: '#10B981',
      icon: '🛡️',
      vaults: vaultTypes.filter(v => v.category === 'security')
    },
    investment: {
      title: 'Investment Vaults',
      color: '#3B82F6',
      icon: '💎',
      vaults: vaultTypes.filter(v => v.category === 'investment')
    },
    legacy: {
      title: 'Legacy & Inheritance',
      color: '#795548',
      icon: '👪',
      vaults: vaultTypes.filter(v => v.category === 'legacy')
    },
    blockchain: {
      title: 'Blockchain Vaults',
      color: '#8B5CF6',
      icon: '⛓️',
      vaults: vaultTypes.filter(v => v.category === 'blockchain')
    }
  };
  
  const currentVaults = vaultCategories[activeCategory].vaults;
  
  const handleCreateVault = (vault: VaultType) => {
    setCreateVaultType(vault);
    setCreationResult(null);
    setShowCreateModal(true);
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1F0C3D] via-[#1C0533] to-black text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#6B00D7] mx-auto mb-4" />
          <p className="text-gray-400">Loading Chronos Vault catalog...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1F0C3D] via-[#1C0533] to-black text-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-400">Failed to load vault catalog</p>
          <Button 
            className="mt-4"
            onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/vault-catalog'] })}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1F0C3D] via-[#1C0533] to-black text-white pb-16">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#6B00D7]/30 to-transparent"></div>
      </div>
      
      <div className="container mx-auto px-4 pt-8 relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Chronos Vault Types</h1>
            <p className="text-gray-400 mt-1">
              {catalogData?.totalVaults || 0} vault types powered by Trinity Protocol™
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="text-white hover:text-white border border-[#FF5AF7] bg-black/20"
              onClick={() => navigate('/monitoring')}
              data-testid="btn-trinity-scan"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Trinity Scan
            </Button>
            <Button
              variant="outline"
              className="text-white hover:text-white border border-[#6B00D7] bg-black/20"
              onClick={() => navigate('/my-vaults')}
              data-testid="btn-my-vaults"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              My Vaults
            </Button>
          </div>
        </div>
        
        <div className="bg-black/40 backdrop-blur-sm p-4 mb-8 text-center rounded-xl border border-purple-500/20">
          <p className="text-gray-300 mb-3">
            Ready to secure your digital assets with Trinity Protocol™?
          </p>
          <Button 
            className="w-full md:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-2 px-6 rounded-lg shadow-lg"
            onClick={() => selectedVault && handleCreateVault(selectedVault)}
            disabled={!selectedVault}
            data-testid="btn-create-vault-main"
          >
            Create {selectedVault?.name || 'Vault'} <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <motion.div
          className="w-full mb-10 overflow-hidden rounded-2xl relative"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-black/70 to-blue-900/30 z-0"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(76,29,149,0.2),transparent_70%)]"></div>
          
          <div className="relative z-10 p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-black/60 rounded-xl p-6 border border-purple-500/30">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Trinity Protocol™ Security</h3>
                    <p className="text-sm text-gray-400">2-of-3 Multi-Chain Consensus</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-black/40 rounded-lg p-3 text-center border border-purple-500/20">
                    <img src="https://cryptologos.cc/logos/arbitrum-arb-logo.svg" alt="Arbitrum" className="h-8 w-8 mx-auto mb-2" />
                    <span className="text-xs text-gray-300">Arbitrum</span>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-xs text-green-400">Active</span>
                    </div>
                  </div>
                  <div className="bg-black/40 rounded-lg p-3 text-center border border-green-500/20">
                    <img src="https://cryptologos.cc/logos/solana-sol-logo.svg" alt="Solana" className="h-8 w-8 mx-auto mb-2" />
                    <span className="text-xs text-gray-300">Solana</span>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-xs text-green-400">Active</span>
                    </div>
                  </div>
                  <div className="bg-black/40 rounded-lg p-3 text-center border border-blue-500/20">
                    <img src="https://cryptologos.cc/logos/toncoin-ton-logo.svg" alt="TON" className="h-8 w-8 mx-auto mb-2" />
                    <span className="text-xs text-gray-300">TON</span>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-xs text-green-400">Active</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-black/60 rounded-xl p-6 border border-pink-500/30">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-pink-400" />
                  Trinity Protocol™ Features
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400 mt-0.5" />
                    <span className="text-sm text-gray-300">Cross-chain verification</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400 mt-0.5" />
                    <span className="text-sm text-gray-300">Quantum-resistant encryption</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400 mt-0.5" />
                    <span className="text-sm text-gray-300">Zero-knowledge proofs</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400 mt-0.5" />
                    <span className="text-sm text-gray-300">Hardware TEE isolation</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Protocol Version</span>
                    <span className="text-sm font-mono text-[#FF5AF7]">v3.5.21</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        <div className="mb-8">
          <Tabs value={activeCategory} onValueChange={(v) => setActiveCategory(v as CategoryKey)}>
            <TabsList className="bg-black/40 border border-gray-800 p-1 flex flex-wrap gap-1">
              {(Object.keys(vaultCategories) as CategoryKey[]).map((key) => (
                <TabsTrigger 
                  key={key}
                  value={key}
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#6B00D7] data-[state=active]:to-[#FF5AF7] px-4 py-2"
                  data-testid={`tab-${key}`}
                >
                  <span className="mr-2">{vaultCategories[key].icon}</span>
                  {vaultCategories[key].title}
                  <span className="ml-2 text-xs opacity-60">({vaultCategories[key].vaults.length})</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {currentVaults.map((vault) => (
            <VaultCard
              key={vault.id}
              vault={vault}
              selected={selectedVaultId === vault.id}
              onClick={() => setSelectedVaultId(vault.id)}
            />
          ))}
        </div>
        
        {selectedVault && (
          <motion.div 
            className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            key={selectedVault.id}
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <span className="text-4xl">{selectedVault.icon}</span>
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedVault.name}</h2>
                  <p className="text-gray-400">{selectedVault.shortDescription}</p>
                </div>
              </div>
              <Button
                className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] text-white"
                onClick={() => handleCreateVault(selectedVault)}
                data-testid="btn-create-selected-vault"
              >
                Create This Vault <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            
            <p className="text-gray-300 mb-6">{selectedVault.longDescription}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm uppercase tracking-wider text-gray-400 mb-3">Features</h4>
                <ul className="space-y-2">
                  {selectedVault.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-[#FF5AF7] mt-0.5" />
                      <span className="text-sm text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm uppercase tracking-wider text-gray-400 mb-3">Security Protocols</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedVault.securityProtocols.map((protocol, idx) => (
                    <span 
                      key={idx}
                      className="px-3 py-1.5 bg-[#6B00D7]/20 border border-[#6B00D7]/40 rounded-lg text-sm text-white"
                    >
                      {protocol}
                    </span>
                  ))}
                </div>
                
                <h4 className="text-sm uppercase tracking-wider text-gray-400 mb-3 mt-6">Supported Chains</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedVault.primaryChains.map((chain, idx) => (
                    <span 
                      key={idx}
                      className="px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg text-sm text-white capitalize"
                    >
                      {chain}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4 mb-12">
          <SecurityFeatureCard
            title="Trinity Protocol™"
            description="2-of-3 consensus across Arbitrum, Solana & TON"
            icon={<img src="https://cryptologos.cc/logos/ethereum-eth-logo.svg" alt="ETH" className="h-5 w-5" />}
            color="#6B00D7"
          />
          <SecurityFeatureCard
            title="Zero-Knowledge"
            description="Advanced ZK proofs for complete privacy"
            icon={<Shield className="h-5 w-5 text-pink-400" />}
            color="#FF5AF7"
          />
          <SecurityFeatureCard
            title="Quantum-Resistant"
            description="ML-KEM-1024 & CRYSTALS-Dilithium-5"
            icon={<Lock className="h-5 w-5 text-green-400" />}
            color="#10B981"
          />
          <SecurityFeatureCard
            title="Time-Lock Tech"
            description="VDF-based mathematical time locks"
            icon={<Clock className="h-5 w-5 text-blue-400" />}
            color="#3B82F6"
          />
          <SecurityFeatureCard
            title="Military-Grade"
            description="Exceeds DoD security standards"
            icon={<Sparkles className="h-5 w-5 text-amber-400" />}
            color="#F59E0B"
          />
        </div>
      </div>
      
      <VaultCreationModal
        vault={createVaultType}
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setCreationResult(null);
        }}
        onSuccess={(result) => {
          setCreationResult(result);
          toast({
            title: "Vault Created Successfully!",
            description: `Your ${createVaultType?.name} has been deployed via Trinity Protocol™`,
          });
        }}
        result={creationResult}
      />
    </div>
  );
};

interface VaultFormConfig {
  variant: 'timelock' | 'multisig' | 'fragment' | 'biometric' | 'quantum' | 'nft' | 'geo' | 'inheritance' | 'ai' | 'bitcoin' | 'social' | 'premium' | 'zk' | 'intent' | 'milestone' | 'discipline';
  accentColor: string;
  borderColor: string;
  requirements: string[];
  delivers: string[];
  specificFields: string[];
  isAvailable: boolean;
}

const getVaultFormConfig = (vaultId: string): VaultFormConfig => {
  const configs: Record<string, VaultFormConfig> = {
    'time-lock-vault': {
      variant: 'timelock',
      accentColor: '#3B82F6',
      borderColor: 'border-blue-500/30',
      requirements: ['Wallet address', 'Lock amount', 'Unlock date/time'],
      delivers: ['Time-locked security', 'VDF-based protection', 'Automatic unlock'],
      specificFields: ['unlockTimestamp'],
      isAvailable: true
    },
    'multi-signature-vault': {
      variant: 'multisig',
      accentColor: '#8B5CF6',
      borderColor: 'border-purple-500/30',
      requirements: ['Multiple signer addresses', 'Signature threshold (M-of-N)', 'Lock amount'],
      delivers: ['Distributed control', 'No single point of failure', 'DAO-ready governance'],
      specificFields: ['signers', 'threshold'],
      isAvailable: true
    },
    'cross-chain-fragment-vault': {
      variant: 'fragment',
      accentColor: '#10B981',
      borderColor: 'border-emerald-500/30',
      requirements: ['Wallet address', 'Total amount', 'Chain distribution (40/30/30)'],
      delivers: ['Cross-chain redundancy', 'Fragment recovery (2-of-3)', 'Maximum security'],
      specificFields: ['fragmentDistribution'],
      isAvailable: true
    },
    'biometric-vault': {
      variant: 'biometric',
      accentColor: '#14B8A6',
      borderColor: 'border-teal-500/30',
      requirements: ['Wallet address', 'Biometric type selection', 'Device binding'],
      delivers: ['Zero-knowledge biometric auth', 'Privacy-preserving verification', 'Hardware attestation'],
      specificFields: ['biometricType', 'deviceBinding'],
      isAvailable: true
    },
    'quantum-resistant-vault': {
      variant: 'quantum',
      accentColor: '#06B6D4',
      borderColor: 'border-cyan-500/30',
      requirements: ['Wallet address', 'Security tier', 'Quantum algorithm selection'],
      delivers: ['ML-KEM-1024 encryption', 'CRYSTALS-Dilithium-5 signatures', 'Future-proof security'],
      specificFields: ['quantumTier', 'algorithm'],
      isAvailable: true
    },
    'quantum-progressive-vault': {
      variant: 'quantum',
      accentColor: '#0891B2',
      borderColor: 'border-cyan-600/30',
      requirements: ['Wallet address', 'Starting security tier', 'Upgrade schedule'],
      delivers: ['Progressive quantum resistance', 'Automatic security upgrades', 'Migration path'],
      specificFields: ['startingTier', 'upgradeSchedule'],
      isAvailable: true
    },
    'nft-powered-vault': {
      variant: 'nft',
      accentColor: '#EC4899',
      borderColor: 'border-pink-500/30',
      requirements: ['NFT collection address', 'Token ID', 'Ownership proof'],
      delivers: ['NFT-gated access', 'Transferable ownership', 'Collection-based permissions'],
      specificFields: ['nftCollection', 'tokenId'],
      isAvailable: true
    },
    'geo-location-vault': {
      variant: 'geo',
      accentColor: '#F59E0B',
      borderColor: 'border-amber-500/30',
      requirements: ['Wallet address', 'Geofence coordinates', 'Access radius'],
      delivers: ['Location-based unlocking', 'Geofence protection', 'Travel-aware security'],
      specificFields: ['latitude', 'longitude', 'radius'],
      isAvailable: true
    },
    'family-heritage-vault': {
      variant: 'inheritance',
      accentColor: '#795548',
      borderColor: 'border-amber-700/30',
      requirements: ['Owner address', 'Beneficiary addresses', 'Release schedule'],
      delivers: ['Multi-generational transfer', 'Scheduled inheritance', 'Family tree support'],
      specificFields: ['beneficiaries', 'releaseSchedule'],
      isAvailable: true
    },
    'time-locked-memory-vault': {
      variant: 'inheritance',
      accentColor: '#9CA3AF',
      borderColor: 'border-gray-500/30',
      requirements: ['Owner address', 'Recipients', 'Memory unlock date'],
      delivers: ['Time-capsule storage', 'Scheduled message delivery', 'Legacy preservation'],
      specificFields: ['recipients', 'memoryUnlockDate'],
      isAvailable: true
    },
    'ai-assisted-investment-vault': {
      variant: 'ai',
      accentColor: '#A855F7',
      borderColor: 'border-violet-500/30',
      requirements: ['Wallet address', 'Risk tolerance', 'Investment strategy'],
      delivers: ['AI-powered allocation', 'Automated rebalancing', 'Risk management'],
      specificFields: ['riskTolerance', 'strategy'],
      isAvailable: true
    },
    'bitcoin-halving-vault': {
      variant: 'bitcoin',
      accentColor: '#F7931A',
      borderColor: 'border-orange-500/30',
      requirements: ['Wallet address', 'Target halving epoch', 'Lock amount'],
      delivers: ['Halving-aligned unlocking', 'Bitcoin cycle strategy', 'Long-term HODL support'],
      specificFields: ['targetHalving', 'bitcoinAddress'],
      isAvailable: true
    },
    'social-recovery-vault': {
      variant: 'social',
      accentColor: '#22C55E',
      borderColor: 'border-green-500/30',
      requirements: ['Owner address', 'Guardian addresses', 'Recovery threshold'],
      delivers: ['Social recovery network', 'Guardian-based restoration', 'No seed phrase needed'],
      specificFields: ['guardians', 'recoveryThreshold'],
      isAvailable: true
    },
    'diamond-hands-vault': {
      variant: 'timelock',
      accentColor: '#60A5FA',
      borderColor: 'border-blue-400/30',
      requirements: ['Wallet address', 'Lock duration', 'No-unlock commitment'],
      delivers: ['Unbreakable time-lock', 'HODL enforcement', 'Panic-sell prevention'],
      specificFields: ['lockDuration', 'commitment'],
      isAvailable: true
    },
    'sovereign-fortress-vault': {
      variant: 'premium',
      accentColor: '#FFD700',
      borderColor: 'border-yellow-500/30',
      requirements: ['Wallet address', 'All security layers', 'Premium activation'],
      delivers: ['8-layer security', 'All Trinity features', 'Maximum protection'],
      specificFields: ['allLayers'],
      isAvailable: true
    },
    'chronos-vault-optimized': {
      variant: 'premium',
      accentColor: '#FF5AF7',
      borderColor: 'border-pink-500/30',
      requirements: ['Wallet address', 'ERC-4626 compliance', 'Yield strategy'],
      delivers: ['Optimized yield', 'Gas-efficient operations', 'DeFi integration'],
      specificFields: ['yieldStrategy'],
      isAvailable: true
    },
    'smart-contract-vault': {
      variant: 'fragment',
      accentColor: '#3B82F6',
      borderColor: 'border-blue-500/30',
      requirements: ['Wallet address', 'Contract parameters', 'Lock amount'],
      delivers: ['ERC-4626 standard', 'Programmable logic', 'DeFi compatibility'],
      specificFields: ['contractParams'],
      isAvailable: true
    },
    'cross-chain-vault': {
      variant: 'fragment',
      accentColor: '#8B5CF6',
      borderColor: 'border-purple-500/30',
      requirements: ['Wallet address', 'Target chains', 'Bridge configuration'],
      delivers: ['Multi-chain presence', 'Unified management', 'Cross-chain transfers'],
      specificFields: ['targetChains'],
      isAvailable: true
    },
    'zk-privacy-vault': {
      variant: 'zk',
      accentColor: '#374151',
      borderColor: 'border-gray-600/30',
      requirements: ['Wallet address', 'Privacy level', 'Commitment value'],
      delivers: ['Groth16 ZK proofs', 'Hidden transactions', 'Anonymous operations'],
      specificFields: ['privacyLevel', 'commitmentValue'],
      isAvailable: true
    },
    'intent-inheritance-vault': {
      variant: 'intent',
      accentColor: '#D97706',
      borderColor: 'border-amber-600/30',
      requirements: ['Owner address', 'Natural language intent', 'Beneficiaries'],
      delivers: ['AI-powered intent parsing', 'Smart contract generation', 'Complex inheritance rules'],
      specificFields: ['intentDescription', 'beneficiaries'],
      isAvailable: true
    },
    'milestone-based-vault': {
      variant: 'milestone',
      accentColor: '#EA580C',
      borderColor: 'border-orange-600/30',
      requirements: ['Wallet address', 'Milestone description', 'Oracle source'],
      delivers: ['Achievement-based unlocking', 'Third-party verification', 'Partial releases'],
      specificFields: ['milestoneDescription', 'oracleSource', 'releasePercentage'],
      isAvailable: true
    },
    'investment-discipline-vault': {
      variant: 'discipline',
      accentColor: '#0284C7',
      borderColor: 'border-sky-600/30',
      requirements: ['Wallet address', 'DCA schedule', 'Withdrawal cooldown'],
      delivers: ['Automated DCA', 'Emotion-free investing', 'Strategy enforcement'],
      specificFields: ['dcaSchedule', 'cooldownPeriod'],
      isAvailable: true
    }
  };
  
  return configs[vaultId] || {
    variant: 'fragment',
    accentColor: '#6B00D7',
    borderColor: 'border-purple-500/30',
    requirements: ['Wallet address', 'Lock amount'],
    delivers: ['Trinity Protocol security', 'Cross-chain verification'],
    specificFields: [],
    isAvailable: true
  };
};

interface VaultCreationModalProps {
  vault: VaultType | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (result: VaultCreationResult) => void;
  result: VaultCreationResult | null;
}

const VaultCreationModal = ({ vault, isOpen, onClose, onSuccess, result }: VaultCreationModalProps) => {
  const [, navigate] = useLocation();
  const [formData, setFormData] = useState({
    ownerAddress: '',
    amount: '',
    unlockTimestamp: '',
    signers: [''],
    threshold: 2,
    vaultName: '',
    vaultDescription: '',
    biometricType: 'fingerprint',
    quantumTier: 'standard',
    nftCollection: '',
    tokenId: '',
    latitude: '',
    longitude: '',
    radius: '100',
    beneficiaries: [''],
    guardians: [''],
    recoveryThreshold: 2,
    riskTolerance: 'moderate',
    targetHalving: '2028',
    lockDuration: '365',
    privacyLevel: 'standard',
    intentDescription: '',
    milestoneDescription: '',
    oracleSource: 'chainlink',
    releasePercentage: '25',
    dcaSchedule: 'weekly',
    cooldownPeriod: '7'
  });
  
  const { toast } = useToast();
  const config = vault ? getVaultFormConfig(vault.id) : null;
  
  const createVaultMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      let endpoint = '/api/vault-creation/fragment';
      let payload: Record<string, unknown> = {
        ownerAddress: data.ownerAddress,
        amount: data.amount,
        vaultName: data.vaultName,
        vaultDescription: data.vaultDescription
      };
      
      if (config?.variant === 'timelock') {
        endpoint = '/api/vault-creation/time-lock';
        payload.unlockTimestamp = Math.floor(new Date(data.unlockTimestamp).getTime() / 1000);
      } else if (config?.variant === 'multisig') {
        endpoint = '/api/vault-creation/multi-sig';
        payload = {
          signers: data.signers.filter(s => s.trim() !== ''),
          threshold: data.threshold,
          amount: data.amount,
          vaultName: data.vaultName,
          vaultDescription: data.vaultDescription
        };
      } else if (config?.variant === 'biometric') {
        payload.biometricType = data.biometricType;
      } else if (config?.variant === 'quantum') {
        payload.quantumTier = data.quantumTier;
      } else if (config?.variant === 'nft') {
        payload.nftCollection = data.nftCollection;
        payload.tokenId = data.tokenId;
      } else if (config?.variant === 'geo') {
        payload.latitude = parseFloat(data.latitude);
        payload.longitude = parseFloat(data.longitude);
        payload.radius = parseFloat(data.radius);
      } else if (config?.variant === 'inheritance') {
        payload.beneficiaries = data.beneficiaries.filter(b => b.trim() !== '');
      } else if (config?.variant === 'social') {
        payload.guardians = data.guardians.filter(g => g.trim() !== '');
        payload.recoveryThreshold = data.recoveryThreshold;
      } else if (config?.variant === 'ai') {
        payload.riskTolerance = data.riskTolerance;
      } else if (config?.variant === 'bitcoin') {
        payload.targetHalving = data.targetHalving;
      }
      
      const response = await apiRequest('POST', endpoint, payload);
      return await response.json() as VaultCreationResult;
    },
    onSuccess: (data) => {
      onSuccess(data);
      queryClient.invalidateQueries({ queryKey: ['/api/vaults'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Creation Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  
  const handleSubmit = () => {
    if (!vault) return;
    createVaultMutation.mutate(formData);
  };
  
  const isPending = createVaultMutation.isPending;
  
  const addSigner = () => setFormData(prev => ({ ...prev, signers: [...prev.signers, ''] }));
  const updateSigner = (index: number, value: string) => setFormData(prev => ({ ...prev, signers: prev.signers.map((s, i) => i === index ? value : s) }));
  const addBeneficiary = () => setFormData(prev => ({ ...prev, beneficiaries: [...prev.beneficiaries, ''] }));
  const updateBeneficiary = (index: number, value: string) => setFormData(prev => ({ ...prev, beneficiaries: prev.beneficiaries.map((b, i) => i === index ? value : b) }));
  const addGuardian = () => setFormData(prev => ({ ...prev, guardians: [...prev.guardians, ''] }));
  const updateGuardian = (index: number, value: string) => setFormData(prev => ({ ...prev, guardians: prev.guardians.map((g, i) => i === index ? value : g) }));
  
  if (!vault || !config) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-br from-[#1F0C3D] to-black border border-purple-500/30 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <span className="text-3xl">{vault.icon}</span>
            Create {vault.name}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Deploy your vault using Trinity Protocol™ across Arbitrum, Solana, and TON
          </DialogDescription>
        </DialogHeader>
        
        {result ? (
          <div className="space-y-6 py-4">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Vault Created Successfully!</h3>
              <p className="text-gray-400">Your vault has been deployed via Trinity Protocol™</p>
            </div>
            
            <div className="bg-black/40 rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Vault ID</span>
                <span className="font-mono text-[#FF5AF7]">{result.vaultId}</span>
              </div>
              {result.ethereumTxHash && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Arbitrum Tx</span>
                  <span className="font-mono text-xs text-purple-400 truncate max-w-[200px]">
                    {result.ethereumTxHash}
                  </span>
                </div>
              )}
              {result.solanaTxHash && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Solana Tx</span>
                  <span className="font-mono text-xs text-green-400 truncate max-w-[200px]">
                    {result.solanaTxHash}
                  </span>
                </div>
              )}
              {result.tonTxHash && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">TON Tx</span>
                  <span className="font-mono text-xs text-blue-400 truncate max-w-[200px]">
                    {result.tonTxHash}
                  </span>
                </div>
              )}
              {result.trinityHash && (
                <div className="flex justify-between items-center pt-2 border-t border-gray-700">
                  <span className="text-gray-400">Trinity Verification</span>
                  <span className="font-mono text-xs text-[#FF5AF7] truncate max-w-[200px]">
                    {result.trinityHash}
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex gap-3">
              <Button
                className="flex-1 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]"
                onClick={() => navigate('/monitoring')}
                data-testid="btn-view-on-trinity-scan"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                View on Trinity Scan
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-purple-500/50"
                onClick={() => navigate('/my-vaults')}
              >
                Go to My Vaults
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="rounded-lg p-3" style={{ backgroundColor: `${config.accentColor}15`, border: `1px solid ${config.accentColor}40` }}>
                <div className="text-xs uppercase tracking-wider opacity-60 mb-2">Requires</div>
                <ul className="space-y-1">
                  {config.requirements.map((req, i) => (
                    <li key={i} className="flex items-center text-xs">
                      <div className="w-1.5 h-1.5 rounded-full mr-2" style={{ backgroundColor: config.accentColor }} />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-lg p-3" style={{ backgroundColor: `${config.accentColor}15`, border: `1px solid ${config.accentColor}40` }}>
                <div className="text-xs uppercase tracking-wider opacity-60 mb-2">Delivers</div>
                <ul className="space-y-1">
                  {config.delivers.map((del, i) => (
                    <li key={i} className="flex items-center text-xs">
                      <CheckCircle className="w-3 h-3 mr-2" style={{ color: config.accentColor }} />
                      {del}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vaultName">Vault Name</Label>
                <Input
                  id="vaultName"
                  placeholder="My Secure Vault"
                  value={formData.vaultName}
                  onChange={(e) => setFormData(prev => ({ ...prev, vaultName: e.target.value }))}
                  className="bg-black/40 border-gray-700"
                  style={{ borderColor: `${config.accentColor}40` }}
                  data-testid="input-vault-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (ETH)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.1"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                  className="bg-black/40 border-gray-700"
                  style={{ borderColor: `${config.accentColor}40` }}
                  data-testid="input-amount"
                />
              </div>
            </div>
            
            {config.variant !== 'multisig' && (
              <div className="space-y-2">
                <Label htmlFor="ownerAddress">Owner Wallet Address</Label>
                <div className="flex gap-2">
                  <Wallet className="h-5 w-5 mt-2" style={{ color: config.accentColor }} />
                  <Input
                    id="ownerAddress"
                    placeholder="0x..."
                    value={formData.ownerAddress}
                    onChange={(e) => setFormData(prev => ({ ...prev, ownerAddress: e.target.value }))}
                    className="bg-black/40 border-gray-700 flex-1"
                    style={{ borderColor: `${config.accentColor}40` }}
                    data-testid="input-owner-address"
                  />
                </div>
              </div>
            )}
            
            {config.variant === 'timelock' && (
              <div className="space-y-2">
                <Label htmlFor="unlockTimestamp" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" style={{ color: config.accentColor }} />
                  Unlock Date & Time
                </Label>
                <Input
                  id="unlockTimestamp"
                  type="datetime-local"
                  value={formData.unlockTimestamp}
                  onChange={(e) => setFormData(prev => ({ ...prev, unlockTimestamp: e.target.value }))}
                  className="bg-black/40 border-gray-700"
                  style={{ borderColor: `${config.accentColor}40` }}
                  data-testid="input-unlock-time"
                />
                <p className="text-xs text-gray-400">Assets will be locked until this date</p>
              </div>
            )}
            
            {config.variant === 'multisig' && (
              <>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Users className="h-4 w-4" style={{ color: config.accentColor }} />
                    Signer Addresses ({formData.signers.length} signers)
                  </Label>
                  {formData.signers.map((signer, idx) => (
                    <div key={idx} className="flex gap-2">
                      <span className="w-6 h-8 flex items-center justify-center text-xs rounded" style={{ backgroundColor: `${config.accentColor}20` }}>{idx + 1}</span>
                      <Input
                        placeholder={`Signer ${idx + 1} address (0x...)`}
                        value={signer}
                        onChange={(e) => updateSigner(idx, e.target.value)}
                        className="bg-black/40 border-gray-700 flex-1"
                        style={{ borderColor: `${config.accentColor}40` }}
                        data-testid={`input-signer-${idx}`}
                      />
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={addSigner} className="mt-2" style={{ borderColor: config.accentColor, color: config.accentColor }}>
                    + Add Signer
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="threshold">Required Signatures (M-of-N)</Label>
                  <div className="flex items-center gap-3">
                    <Input
                      id="threshold"
                      type="number"
                      min="1"
                      max={formData.signers.length}
                      value={formData.threshold}
                      onChange={(e) => setFormData(prev => ({ ...prev, threshold: parseInt(e.target.value) || 2 }))}
                      className="bg-black/40 border-gray-700 w-24"
                      style={{ borderColor: `${config.accentColor}40` }}
                      data-testid="input-threshold"
                    />
                    <p className="text-xs text-gray-400">
                      {formData.threshold} of {formData.signers.length} signatures required
                    </p>
                  </div>
                </div>
              </>
            )}
            
            {config.variant === 'biometric' && (
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Shield className="h-4 w-4" style={{ color: config.accentColor }} />
                  Biometric Authentication Type
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  {['fingerprint', 'face', 'iris'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, biometricType: type }))}
                      className={`p-3 rounded-lg border text-center capitalize transition-all ${
                        formData.biometricType === type 
                          ? 'border-teal-500 bg-teal-500/20' 
                          : 'border-gray-700 bg-black/40 hover:border-gray-600'
                      }`}
                      data-testid={`btn-biometric-${type}`}
                    >
                      <span className="text-2xl block mb-1">{type === 'fingerprint' ? '👆' : type === 'face' ? '👤' : '👁️'}</span>
                      <span className="text-xs">{type}</span>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-400">Zero-knowledge proof ensures your biometric data never leaves your device</p>
              </div>
            )}
            
            {config.variant === 'quantum' && (
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Zap className="h-4 w-4" style={{ color: config.accentColor }} />
                  Quantum Security Tier
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  {['standard', 'enhanced', 'maximum'].map((tier) => (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, quantumTier: tier }))}
                      className={`p-3 rounded-lg border text-center capitalize transition-all ${
                        formData.quantumTier === tier 
                          ? 'border-cyan-500 bg-cyan-500/20' 
                          : 'border-gray-700 bg-black/40 hover:border-gray-600'
                      }`}
                      data-testid={`btn-quantum-${tier}`}
                    >
                      <span className="text-2xl block mb-1">{tier === 'standard' ? '🔐' : tier === 'enhanced' ? '🛡️' : '⚛️'}</span>
                      <span className="text-xs">{tier}</span>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-400">Uses ML-KEM-1024 and CRYSTALS-Dilithium-5 for post-quantum security</p>
              </div>
            )}
            
            {config.variant === 'nft' && (
              <>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Gem className="h-4 w-4" style={{ color: config.accentColor }} />
                    NFT Collection Address
                  </Label>
                  <Input
                    placeholder="0x... (NFT collection contract)"
                    value={formData.nftCollection}
                    onChange={(e) => setFormData(prev => ({ ...prev, nftCollection: e.target.value }))}
                    className="bg-black/40 border-gray-700"
                    style={{ borderColor: `${config.accentColor}40` }}
                    data-testid="input-nft-collection"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Token ID</Label>
                  <Input
                    placeholder="Token ID for access control"
                    value={formData.tokenId}
                    onChange={(e) => setFormData(prev => ({ ...prev, tokenId: e.target.value }))}
                    className="bg-black/40 border-gray-700"
                    style={{ borderColor: `${config.accentColor}40` }}
                    data-testid="input-token-id"
                  />
                </div>
                <p className="text-xs text-gray-400">Only the holder of this NFT can access the vault</p>
              </>
            )}
            
            {config.variant === 'geo' && (
              <>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" style={{ color: config.accentColor }} />
                    Geofence Location
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      placeholder="Latitude (e.g., 40.7128)"
                      value={formData.latitude}
                      onChange={(e) => setFormData(prev => ({ ...prev, latitude: e.target.value }))}
                      className="bg-black/40 border-gray-700"
                      style={{ borderColor: `${config.accentColor}40` }}
                      data-testid="input-latitude"
                    />
                    <Input
                      placeholder="Longitude (e.g., -74.0060)"
                      value={formData.longitude}
                      onChange={(e) => setFormData(prev => ({ ...prev, longitude: e.target.value }))}
                      className="bg-black/40 border-gray-700"
                      style={{ borderColor: `${config.accentColor}40` }}
                      data-testid="input-longitude"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Access Radius (meters)</Label>
                  <Input
                    type="number"
                    placeholder="100"
                    value={formData.radius}
                    onChange={(e) => setFormData(prev => ({ ...prev, radius: e.target.value }))}
                    className="bg-black/40 border-gray-700 w-32"
                    style={{ borderColor: `${config.accentColor}40` }}
                    data-testid="input-radius"
                  />
                </div>
                <p className="text-xs text-gray-400">Vault can only be unlocked within this geographic area</p>
              </>
            )}
            
            {config.variant === 'inheritance' && (
              <>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Heart className="h-4 w-4" style={{ color: config.accentColor }} />
                    Beneficiary Addresses
                  </Label>
                  {formData.beneficiaries.map((beneficiary, idx) => (
                    <div key={idx} className="flex gap-2">
                      <span className="w-6 h-8 flex items-center justify-center text-xs rounded" style={{ backgroundColor: `${config.accentColor}20` }}>{idx + 1}</span>
                      <Input
                        placeholder={`Beneficiary ${idx + 1} address (0x...)`}
                        value={beneficiary}
                        onChange={(e) => updateBeneficiary(idx, e.target.value)}
                        className="bg-black/40 border-gray-700 flex-1"
                        style={{ borderColor: `${config.accentColor}40` }}
                        data-testid={`input-beneficiary-${idx}`}
                      />
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={addBeneficiary} className="mt-2" style={{ borderColor: config.accentColor, color: config.accentColor }}>
                    + Add Beneficiary
                  </Button>
                </div>
                <p className="text-xs text-gray-400">Assets will transfer to beneficiaries according to the release schedule</p>
              </>
            )}
            
            {config.variant === 'social' && (
              <>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Users className="h-4 w-4" style={{ color: config.accentColor }} />
                    Guardian Addresses ({formData.guardians.length} guardians)
                  </Label>
                  {formData.guardians.map((guardian, idx) => (
                    <div key={idx} className="flex gap-2">
                      <span className="w-6 h-8 flex items-center justify-center text-xs rounded" style={{ backgroundColor: `${config.accentColor}20` }}>{idx + 1}</span>
                      <Input
                        placeholder={`Guardian ${idx + 1} address (0x...)`}
                        value={guardian}
                        onChange={(e) => updateGuardian(idx, e.target.value)}
                        className="bg-black/40 border-gray-700 flex-1"
                        style={{ borderColor: `${config.accentColor}40` }}
                        data-testid={`input-guardian-${idx}`}
                      />
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={addGuardian} className="mt-2" style={{ borderColor: config.accentColor, color: config.accentColor }}>
                    + Add Guardian
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label>Recovery Threshold</Label>
                  <div className="flex items-center gap-3">
                    <Input
                      type="number"
                      min="1"
                      max={formData.guardians.length}
                      value={formData.recoveryThreshold}
                      onChange={(e) => setFormData(prev => ({ ...prev, recoveryThreshold: parseInt(e.target.value) || 2 }))}
                      className="bg-black/40 border-gray-700 w-24"
                      style={{ borderColor: `${config.accentColor}40` }}
                      data-testid="input-recovery-threshold"
                    />
                    <p className="text-xs text-gray-400">
                      {formData.recoveryThreshold} of {formData.guardians.length} guardians needed for recovery
                    </p>
                  </div>
                </div>
              </>
            )}
            
            {config.variant === 'ai' && (
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Brain className="h-4 w-4" style={{ color: config.accentColor }} />
                  Risk Tolerance
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  {['conservative', 'moderate', 'aggressive'].map((risk) => (
                    <button
                      key={risk}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, riskTolerance: risk }))}
                      className={`p-3 rounded-lg border text-center capitalize transition-all ${
                        formData.riskTolerance === risk 
                          ? 'border-violet-500 bg-violet-500/20' 
                          : 'border-gray-700 bg-black/40 hover:border-gray-600'
                      }`}
                      data-testid={`btn-risk-${risk}`}
                    >
                      <span className="text-2xl block mb-1">{risk === 'conservative' ? '🐢' : risk === 'moderate' ? '⚖️' : '🚀'}</span>
                      <span className="text-xs">{risk}</span>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-400">AI will optimize your portfolio based on this risk profile</p>
              </div>
            )}
            
            {config.variant === 'bitcoin' && (
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Bitcoin className="h-4 w-4" style={{ color: config.accentColor }} />
                  Target Bitcoin Halving
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  {['2024', '2028', '2032'].map((year) => (
                    <button
                      key={year}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, targetHalving: year }))}
                      className={`p-3 rounded-lg border text-center transition-all ${
                        formData.targetHalving === year 
                          ? 'border-orange-500 bg-orange-500/20' 
                          : 'border-gray-700 bg-black/40 hover:border-gray-600'
                      }`}
                      data-testid={`btn-halving-${year}`}
                    >
                      <span className="text-2xl block mb-1">₿</span>
                      <span className="text-xs">{year} Halving</span>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-400">Vault unlocks at the selected Bitcoin halving event</p>
              </div>
            )}
            
            {config.variant === 'fragment' && (
              <div className="rounded-lg p-4 border" style={{ backgroundColor: `${config.accentColor}10`, borderColor: `${config.accentColor}40` }}>
                <Label className="flex items-center gap-2 mb-3">
                  <Globe className="h-4 w-4" style={{ color: config.accentColor }} />
                  Cross-Chain Distribution
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center p-2 rounded bg-purple-500/10 border border-purple-500/30">
                    <div className="text-lg font-bold text-purple-400">40%</div>
                    <div className="text-xs text-gray-400">Arbitrum L2</div>
                  </div>
                  <div className="text-center p-2 rounded bg-green-500/10 border border-green-500/30">
                    <div className="text-lg font-bold text-green-400">30%</div>
                    <div className="text-xs text-gray-400">Solana</div>
                  </div>
                  <div className="text-center p-2 rounded bg-blue-500/10 border border-blue-500/30">
                    <div className="text-lg font-bold text-blue-400">30%</div>
                    <div className="text-xs text-gray-400">TON</div>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-2">2-of-3 fragments required for recovery</p>
              </div>
            )}
            
            {config.variant === 'premium' && (
              <div className="rounded-lg p-4 border" style={{ backgroundColor: `${config.accentColor}10`, borderColor: `${config.accentColor}40` }}>
                <Label className="flex items-center gap-2 mb-3">
                  <Shield className="h-4 w-4" style={{ color: config.accentColor }} />
                  8-Layer Security Stack
                </Label>
                <div className="grid grid-cols-4 gap-2">
                  {['ZK Proofs', 'Formal Verify', 'MPC Keys', 'VDF Locks', 'AI Guard', 'Quantum', 'Trinity', 'TEE'].map((layer, i) => (
                    <div key={layer} className="text-center p-2 rounded bg-yellow-500/10 border border-yellow-500/30">
                      <div className="text-xs font-bold" style={{ color: config.accentColor }}>L{i + 1}</div>
                      <div className="text-[10px] text-gray-400">{layer}</div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-2">Maximum protection with all Trinity Protocol layers</p>
              </div>
            )}
            
            {config.variant === 'zk' && (
              <div className="space-y-4">
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <Lock className="h-4 w-4" style={{ color: config.accentColor }} />
                    Privacy Level
                  </Label>
                  <div className="grid grid-cols-3 gap-2">
                    {['standard', 'enhanced', 'maximum'].map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, privacyLevel: level }))}
                        className={`p-3 rounded-lg border text-center capitalize transition-all ${
                          formData.privacyLevel === level 
                            ? 'border-gray-500 bg-gray-500/20' 
                            : 'border-gray-700 bg-black/40 hover:border-gray-600'
                        }`}
                        data-testid={`btn-privacy-${level}`}
                      >
                        <span className="text-2xl block mb-1">{level === 'standard' ? '🕶️' : level === 'enhanced' ? '👻' : '🔮'}</span>
                        <span className="text-xs">{level}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="rounded-lg p-3 bg-gray-800/50 border border-gray-700">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                    <Shield className="h-4 w-4" /> Groth16 ZK-SNARK Protection
                  </div>
                  <p className="text-xs text-gray-400">Transaction amounts, sender, and recipient are hidden using zero-knowledge proofs</p>
                </div>
              </div>
            )}
            
            {config.variant === 'intent' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" style={{ color: config.accentColor }} />
                    Inheritance Intent (Natural Language)
                  </Label>
                  <textarea
                    placeholder="Describe your inheritance wishes in plain English. Example: 'Give 50% to my daughter when she turns 25, and split the rest between my children when I'm gone for 2 years...'"
                    value={formData.intentDescription}
                    onChange={(e) => setFormData(prev => ({ ...prev, intentDescription: e.target.value }))}
                    className="w-full min-h-[100px] p-3 rounded-lg bg-black/40 border border-gray-700 text-sm resize-none"
                    style={{ borderColor: `${config.accentColor}40` }}
                    data-testid="input-intent-description"
                  />
                </div>
                <div className="rounded-lg p-3 bg-amber-900/20 border border-amber-700/30">
                  <div className="flex items-center gap-2 text-sm font-medium text-amber-400 mb-2">
                    <Brain className="h-4 w-4" /> AI-Powered Intent Parsing
                  </div>
                  <p className="text-xs text-gray-400">Claude AI will convert your wishes into enforceable smart contract logic</p>
                </div>
              </div>
            )}
            
            {config.variant === 'milestone' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" style={{ color: config.accentColor }} />
                    Milestone Description
                  </Label>
                  <Input
                    placeholder="e.g., Graduate from university, Launch product, Reach $1M revenue..."
                    value={formData.milestoneDescription}
                    onChange={(e) => setFormData(prev => ({ ...prev, milestoneDescription: e.target.value }))}
                    className="bg-black/40 border-gray-700"
                    style={{ borderColor: `${config.accentColor}40` }}
                    data-testid="input-milestone-description"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Oracle Source</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {['chainlink', 'custom'].map((source) => (
                        <button
                          key={source}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, oracleSource: source }))}
                          className={`p-2 rounded-lg border text-center capitalize transition-all text-sm ${
                            formData.oracleSource === source 
                              ? 'border-orange-500 bg-orange-500/20' 
                              : 'border-gray-700 bg-black/40 hover:border-gray-600'
                          }`}
                          data-testid={`btn-oracle-${source}`}
                        >
                          {source === 'chainlink' ? '🔗 Chainlink' : '⚙️ Custom'}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Release %</Label>
                    <Input
                      type="number"
                      min="1"
                      max="100"
                      value={formData.releasePercentage}
                      onChange={(e) => setFormData(prev => ({ ...prev, releasePercentage: e.target.value }))}
                      className="bg-black/40 border-gray-700"
                      style={{ borderColor: `${config.accentColor}40` }}
                      data-testid="input-release-percentage"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-400">Oracle will verify milestone completion before releasing {formData.releasePercentage}% of funds</p>
              </div>
            )}
            
            {config.variant === 'discipline' && (
              <div className="space-y-4">
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <Clock className="h-4 w-4" style={{ color: config.accentColor }} />
                    DCA Schedule
                  </Label>
                  <div className="grid grid-cols-4 gap-2">
                    {['daily', 'weekly', 'biweekly', 'monthly'].map((schedule) => (
                      <button
                        key={schedule}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, dcaSchedule: schedule }))}
                        className={`p-2 rounded-lg border text-center capitalize transition-all text-sm ${
                          formData.dcaSchedule === schedule 
                            ? 'border-sky-500 bg-sky-500/20' 
                            : 'border-gray-700 bg-black/40 hover:border-gray-600'
                        }`}
                        data-testid={`btn-dca-${schedule}`}
                      >
                        {schedule}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Withdrawal Cooldown (days)</Label>
                  <div className="flex items-center gap-3">
                    <Input
                      type="number"
                      min="1"
                      max="365"
                      value={formData.cooldownPeriod}
                      onChange={(e) => setFormData(prev => ({ ...prev, cooldownPeriod: e.target.value }))}
                      className="bg-black/40 border-gray-700 w-24"
                      style={{ borderColor: `${config.accentColor}40` }}
                      data-testid="input-cooldown-period"
                    />
                    <p className="text-xs text-gray-400">
                      You must wait {formData.cooldownPeriod} days between withdrawals
                    </p>
                  </div>
                </div>
                <div className="rounded-lg p-3 bg-sky-900/20 border border-sky-700/30">
                  <p className="text-xs text-gray-400">This vault prevents emotional trading by enforcing your investment strategy</p>
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="vaultDescription">Description (Optional)</Label>
              <Input
                id="vaultDescription"
                placeholder="Describe your vault's purpose..."
                value={formData.vaultDescription}
                onChange={(e) => setFormData(prev => ({ ...prev, vaultDescription: e.target.value }))}
                className="bg-black/40 border-gray-700"
                data-testid="input-description"
              />
            </div>
            
            <div className="bg-black/40 rounded-xl p-4 border border-purple-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-5 w-5 text-[#FF5AF7]" />
                <span className="font-medium">Trinity Protocol™ Deployment</span>
              </div>
              <p className="text-sm text-gray-400">
                Your vault will be deployed across all three chains with 2-of-3 consensus verification.
                Transaction hashes from Arbitrum, Solana, and TON will be provided upon creation.
              </p>
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                className="flex-1 border-gray-700"
                onClick={onClose}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]"
                onClick={handleSubmit}
                disabled={isPending || !formData.ownerAddress || !formData.amount}
                data-testid="btn-submit-create-vault"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Vault...
                  </>
                ) : (
                  <>
                    Create Vault <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default VaultTypesPage;
