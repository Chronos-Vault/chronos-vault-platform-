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
  Calendar
} from 'lucide-react';
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
    vaultDescription: ''
  });
  
  const { toast } = useToast();
  
  const createTimeLockMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await apiRequest('POST', '/api/vault-creation/time-lock', {
        ownerAddress: data.ownerAddress,
        amount: data.amount,
        unlockTimestamp: Math.floor(new Date(data.unlockTimestamp).getTime() / 1000),
        vaultName: data.vaultName,
        vaultDescription: data.vaultDescription
      });
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
  
  const createMultiSigMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await apiRequest('POST', '/api/vault-creation/multi-sig', {
        signers: data.signers.filter(s => s.trim() !== ''),
        threshold: data.threshold,
        amount: data.amount,
        vaultName: data.vaultName,
        vaultDescription: data.vaultDescription
      });
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
  
  const createFragmentMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await apiRequest('POST', '/api/vault-creation/fragment', {
        ownerAddress: data.ownerAddress,
        amount: data.amount,
        vaultName: data.vaultName,
        vaultDescription: data.vaultDescription
      });
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
    
    const vaultId = vault.id;
    
    if (vaultId.includes('time-lock') || vaultId.includes('timelock')) {
      createTimeLockMutation.mutate(formData);
    } else if (vaultId.includes('multi-sig') || vaultId.includes('multisig')) {
      createMultiSigMutation.mutate(formData);
    } else if (vaultId.includes('fragment') || vaultId.includes('cross-chain')) {
      createFragmentMutation.mutate(formData);
    } else {
      createFragmentMutation.mutate(formData);
    }
  };
  
  const isPending = createTimeLockMutation.isPending || createMultiSigMutation.isPending || createFragmentMutation.isPending;
  
  const addSigner = () => {
    setFormData(prev => ({
      ...prev,
      signers: [...prev.signers, '']
    }));
  };
  
  const updateSigner = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      signers: prev.signers.map((s, i) => i === index ? value : s)
    }));
  };
  
  const isTimeLock = vault?.id.includes('time-lock') || vault?.id.includes('timelock');
  const isMultiSig = vault?.id.includes('multi-sig') || vault?.id.includes('multisig');
  
  if (!vault) return null;
  
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vaultName">Vault Name</Label>
                <Input
                  id="vaultName"
                  placeholder="My Secure Vault"
                  value={formData.vaultName}
                  onChange={(e) => setFormData(prev => ({ ...prev, vaultName: e.target.value }))}
                  className="bg-black/40 border-gray-700"
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
                  data-testid="input-amount"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ownerAddress">Owner Wallet Address</Label>
              <div className="flex gap-2">
                <Wallet className="h-5 w-5 text-gray-400 mt-2" />
                <Input
                  id="ownerAddress"
                  placeholder="0x..."
                  value={formData.ownerAddress}
                  onChange={(e) => setFormData(prev => ({ ...prev, ownerAddress: e.target.value }))}
                  className="bg-black/40 border-gray-700 flex-1"
                  data-testid="input-owner-address"
                />
              </div>
            </div>
            
            {isTimeLock && (
              <div className="space-y-2">
                <Label htmlFor="unlockTimestamp">Unlock Date & Time</Label>
                <div className="flex gap-2">
                  <Calendar className="h-5 w-5 text-gray-400 mt-2" />
                  <Input
                    id="unlockTimestamp"
                    type="datetime-local"
                    value={formData.unlockTimestamp}
                    onChange={(e) => setFormData(prev => ({ ...prev, unlockTimestamp: e.target.value }))}
                    className="bg-black/40 border-gray-700 flex-1"
                    data-testid="input-unlock-time"
                  />
                </div>
              </div>
            )}
            
            {isMultiSig && (
              <>
                <div className="space-y-2">
                  <Label>Signer Addresses</Label>
                  {formData.signers.map((signer, idx) => (
                    <div key={idx} className="flex gap-2">
                      <Users className="h-5 w-5 text-gray-400 mt-2" />
                      <Input
                        placeholder={`Signer ${idx + 1} address (0x...)`}
                        value={signer}
                        onChange={(e) => updateSigner(idx, e.target.value)}
                        className="bg-black/40 border-gray-700 flex-1"
                        data-testid={`input-signer-${idx}`}
                      />
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addSigner}
                    className="mt-2"
                  >
                    + Add Signer
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="threshold">Required Signatures</Label>
                  <Input
                    id="threshold"
                    type="number"
                    min="1"
                    max={formData.signers.length}
                    value={formData.threshold}
                    onChange={(e) => setFormData(prev => ({ ...prev, threshold: parseInt(e.target.value) || 2 }))}
                    className="bg-black/40 border-gray-700 w-24"
                    data-testid="input-threshold"
                  />
                  <p className="text-xs text-gray-400">
                    {formData.threshold} of {formData.signers.length} signatures required
                  </p>
                </div>
              </>
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
