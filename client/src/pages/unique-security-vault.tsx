import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { 
  Shield, 
  Lock, 
  Key, 
  Fingerprint, 
  Timer, 
  Settings, 
  Code,
  LockKeyhole, 
  Globe,
  Network,
  BrainCircuit,
  Server,
  AlertTriangle,
  Lightbulb,
  ChevronsUpDown,
  ChevronRight,
  Eye,
  EyeOff,
  LifeBuoy,
  RefreshCw,
  PlusCircle,
  MinusCircle,
  CheckCircle,
  Landmark,
  Cpu,
  FileCode2,
  ShieldAlert,
  Radar,
  HardDrive,
  ScanFace
} from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { BlockchainType } from '@/contexts/multi-chain-context';
import { useTon } from '@/contexts/ton-context';
import { useEthereum } from '@/contexts/ethereum-context';
import { useSolana } from '@/contexts/solana-context';
// import { AdvancedFeaturesDashboard } from '@/components/advanced-features-dashboard';
// We'll implement these utility functions directly in the component
// instead of importing from non-existent modules

// Simple security metrics calculator class
class MetricsCalculator {
  calculateSecurityScore(factors: Record<string, number>): number {
    return Object.values(factors).reduce((sum, value) => sum + value, 0);
  }

  getSecurityLevel(score: number): string {
    if (score >= 90) return 'Maximum';
    if (score >= 70) return 'Advanced';
    if (score >= 50) return 'Enhanced';
    if (score >= 30) return 'Standard';
    return 'Basic';
  }
}

// Advanced security types
type SecurityLayer = 'blockchain' | 'quantum' | 'biometric' | 'zkp' | 'enclave' | 'timelock' | 'mpc' | 'post-quantum' | 'social' | 'identity' | 'hardware';
type RecoveryMethod = 'seedPhrase' | 'social' | 'biometric' | 'hardware' | 'sharded' | 'legal' | 'quantum';
type VaultBackupStrategy = 'distributed' | 'encrypted' | 'sharded' | 'quantum' | 'offline' | 'hierarchical';
type Chain = 'ethereum' | 'ton' | 'solana' | 'bitcoin' | 'polygon' | 'avalanche' | 'polkadot' | 'cosmos' | 'arbitrum';
type AccessMethod = 'standard' | 'multisig' | 'guardians' | 'timelock' | 'zkproof' | 'mpc' | 'biometric' | 'device-based' | 'passwordless';
type IdentityProvider = 'self-sovereign' | 'decentralized' | 'blockchain' | 'federated' | 'social' | 'kyc' | 'biometric';
type EncryptionAlgorithm = 'aes256' | 'rsa4096' | 'ecc' | 'lattice' | 'blowfish' | 'kyber' | 'dilithium' | 'falcon';
type VaultRiskProfile = 'ultra-secure' | 'balanced' | 'custom';
type HardwareIntegration = 'ledger' | 'trezor' | 'grid+' | 'yubico' | 'onlykey' | 'jade' | 'keystone' | 'custom';
type ThreatModel = 'standard' | 'advanced' | 'nation-state' | 'quantum' | 'insider' | 'physical' | 'custom';
type EmergencyResponse = 'lockdown' | 'recovery' | 'destroy' | 'transfer' | 'alert' | 'duress';

// Guardian type for social recovery
interface Guardian {
  id: string;
  address: string;
  type: 'wallet' | 'email' | 'contract' | 'hardware' | 'institution';
  name: string;
  threshold?: number;
  timelock?: number;
}

// Biometric verification type
interface BiometricVerification {
  enabled: boolean;
  type: 'fingerprint' | 'facial' | 'iris' | 'voice' | 'behavioral' | 'multi';
  provider?: string;
  storageMethod: 'local' | 'encrypted' | 'zkp' | 'none';
  refreshInterval?: number;
}

// Advanced hardware security module
interface HardwareSecurity {
  enabled: boolean;
  type: HardwareIntegration;
  serialNumber?: string;
  passphraseProtection: boolean;
  pinProtection: boolean;
  connectionMethod: 'usb' | 'bluetooth' | 'nfc' | 'qr' | 'airgap';
}

// Geographic security constraints
interface GeoSecurity {
  enabled: boolean;
  allowedRegions: string[];
  deviceLocking: boolean;
  deviceAttestation: boolean;
  ipVerification: boolean;
}

// Verification Policy for access
interface VerificationPolicy {
  id: string;
  name: string;
  requiredFactors: number;
  methods: {
    passwordEnabled: boolean;
    twoFactorEnabled: boolean;
    biometricEnabled: boolean;
    hardwareEnabled: boolean;
    socialEnabled: boolean;
    zkpEnabled: boolean;
  };
  cooldownPeriod: number; // in minutes
  failedAttemptLimit: number;
}

// Custom recovery data sharing
interface RecoveryShare {
  id: string;
  name: string;
  shareType: 'digital' | 'physical' | 'mental' | 'institutional';
  contact?: string;
  threshold: number;
  totalShares: number;
  requiredShares: number;
  encryptionAlgorithm: EncryptionAlgorithm;
}

function UniqueSecurityVault() {
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const ton = useTon();
  const ethereum = useEthereum();
  const solana = useSolana();
  // Create a metrics calculator instance for security scoring
  const metricsCalculator = new MetricsCalculator();
  
  // UI State
  const [activeTab, setActiveTab] = useState<string>("basic");
  const [step, setStep] = useState<number>(1);
  const [progress, setProgress] = useState<number>(16);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDeploying, setIsDeploying] = useState<boolean>(false);
  const [deploymentProgress, setDeploymentProgress] = useState<number>(0);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [vaultId, setVaultId] = useState<string>("");
  const [showAdvancedSettings, setShowAdvancedSettings] = useState<boolean>(false);
  
  // Basic vault info
  const [vaultName, setVaultName] = useState<string>('');
  const [vaultDescription, setVaultDescription] = useState<string>('');
  const [securityScore, setSecurityScore] = useState<number>(0);
  const [riskProfile, setRiskProfile] = useState<VaultRiskProfile>('balanced');
  const [selectedAsset, setSelectedAsset] = useState<string>('BTC');
  const [selectedChains, setSelectedChains] = useState<Chain[]>(['ethereum', 'ton', 'solana']);
  const [primaryChain, setPrimaryChain] = useState<Chain>('ethereum');
  
  // Security layers
  const [securityLayers, setSecurityLayers] = useState<SecurityLayer[]>(['blockchain', 'quantum', 'zkp']);
  const [securityLevel, setSecurityLevel] = useState<number>(5);
  const [threatModel, setThreatModel] = useState<ThreatModel>('advanced');
  const [customThreatModelDescription, setCustomThreatModelDescription] = useState<string>('');
  
  // Access controls
  const [accessMethod, setAccessMethod] = useState<AccessMethod>('multisig');
  const [passwordProtection, setPasswordProtection] = useState<boolean>(true);
  const [passwordComplexity, setPasswordComplexity] = useState<number>(4);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [timelock, setTimelock] = useState<number>(24); // hours
  const [multisigThreshold, setMultisigThreshold] = useState<number>(2);
  
  // Guardians for social recovery
  const [guardians, setGuardians] = useState<Guardian[]>([
    { 
      id: '1', 
      address: '', 
      type: 'wallet',
      name: 'Primary Guardian',
      threshold: 1,
      timelock: 24
    }
  ]);
  
  // Recovery settings
  const [recoveryMethods, setRecoveryMethods] = useState<RecoveryMethod[]>(['seedPhrase', 'social']);
  const [customRecoveryEnabled, setCustomRecoveryEnabled] = useState<boolean>(false);
  const [recoveryEmail, setRecoveryEmail] = useState<string>('');
  const [recoveryShares, setRecoveryShares] = useState<RecoveryShare[]>([
    {
      id: '1',
      name: 'Digital Share',
      shareType: 'digital',
      threshold: 3,
      totalShares: 5,
      requiredShares: 3,
      encryptionAlgorithm: 'kyber'
    }
  ]);
  
  // Backup strategy
  const [backupStrategies, setBackupStrategies] = useState<VaultBackupStrategy[]>(['encrypted', 'sharded']);
  const [autoBackup, setAutoBackup] = useState<boolean>(true);
  const [backupFrequency, setBackupFrequency] = useState<number>(7); // days
  const [offlineBackupReminder, setOfflineBackupReminder] = useState<boolean>(true);
  
  // Biometric verification
  const [biometric, setBiometric] = useState<BiometricVerification>({
    enabled: false,
    type: 'fingerprint',
    storageMethod: 'zkp',
    refreshInterval: 90 // days
  });
  
  // Hardware security
  const [hardware, setHardware] = useState<HardwareSecurity>({
    enabled: false,
    type: 'ledger',
    passphraseProtection: true,
    pinProtection: true,
    connectionMethod: 'usb'
  });
  
  // Geographic security
  const [geoSecurity, setGeoSecurity] = useState<GeoSecurity>({
    enabled: false,
    allowedRegions: [],
    deviceLocking: true,
    deviceAttestation: true,
    ipVerification: true
  });
  
  // Identity verification
  const [identityVerification, setIdentityVerification] = useState<boolean>(false);
  const [identityProvider, setIdentityProvider] = useState<IdentityProvider>('self-sovereign');
  
  // Verification policies
  const [verificationPolicies, setVerificationPolicies] = useState<VerificationPolicy[]>([
    {
      id: '1',
      name: 'Standard Access',
      requiredFactors: 2,
      methods: {
        passwordEnabled: true,
        twoFactorEnabled: true,
        biometricEnabled: false,
        hardwareEnabled: false,
        socialEnabled: false,
        zkpEnabled: false
      },
      cooldownPeriod: 15,
      failedAttemptLimit: 5
    }
  ]);
  
  // Emergency protocols
  const [emergencyProtocolEnabled, setEmergencyProtocolEnabled] = useState<boolean>(true);
  const [emergencyResponses, setEmergencyResponses] = useState<EmergencyResponse[]>(['lockdown', 'alert']);
  const [emergencyTimelock, setEmergencyTimelock] = useState<number>(72); // hours
  const [emergencyContacts, setEmergencyContacts] = useState<string[]>(['']);
  
  // Post-Quantum security
  const [postQuantumEnabled, setPostQuantumEnabled] = useState<boolean>(true);
  const [quantumAlgorithm, setQuantumAlgorithm] = useState<string>('kyber-768');
  
  // Advanced encryption
  const [primaryEncryption, setPrimaryEncryption] = useState<EncryptionAlgorithm>('kyber');
  const [secondaryEncryption, setSecondaryEncryption] = useState<EncryptionAlgorithm>('aes256');
  const [keyRotationEnabled, setKeyRotationEnabled] = useState<boolean>(true);
  const [keyRotationFrequency, setKeyRotationFrequency] = useState<number>(90); // days
  
  // Side effects and handlers  
  useEffect(() => {
    // Calculate security score based on selected options
    calculateSecurityScore();
    
    // Update progress based on fields filled
    updateFormProgress();
  }, [
    vaultName, 
    securityLayers, 
    recoveryMethods,
    accessMethod,
    securityLevel,
    threatModel,
    biometric.enabled,
    hardware.enabled,
    geoSecurity.enabled,
    identityVerification,
    postQuantumEnabled,
    emergencyProtocolEnabled,
    selectedChains,
    primaryEncryption
  ]);
  
  // Update form progress
  const updateFormProgress = () => {
    let totalFields = 0;
    let filledFields = 0;
    
    // Basic fields
    totalFields += 3;
    if (vaultName) filledFields += 1;
    if (vaultDescription) filledFields += 1;
    if (selectedAsset) filledFields += 1;
    
    // Security fields
    totalFields += 3;
    if (securityLayers.length > 0) filledFields += 1;
    if (securityLevel > 0) filledFields += 1;
    if (threatModel) filledFields += 1;
    
    // Access fields
    totalFields += 2;
    if (accessMethod) filledFields += 1;
    if (accessMethod === 'standard' || password) filledFields += 1;
    
    // Recovery fields
    totalFields += 2;
    if (recoveryMethods.length > 0) filledFields += 1;
    if (backupStrategies.length > 0) filledFields += 1;
    
    // Calculate progress percentage
    const newProgress = Math.min(100, Math.round((filledFields / totalFields) * 100));
    setProgress(newProgress);
  };
  
  // Calculate security score based on selected options
  const calculateSecurityScore = () => {
    let score = 0;
    
    // Base security score from security level
    score += (securityLevel * 10);
    
    // Add points for each security layer
    score += (securityLayers.length * 5);
    
    // Add points for recovery methods
    score += (recoveryMethods.length * 3);
    
    // Add points for multiple chains
    if (selectedChains.length > 1) {
      score += (selectedChains.length * 2);
    }
    
    // Add points for advanced access methods
    if (accessMethod === 'multisig') score += 10;
    if (accessMethod === 'zkproof') score += 15;
    if (accessMethod === 'mpc') score += 15;
    
    // Add points for biometric verification
    if (biometric.enabled) score += 10;
    
    // Add points for hardware security
    if (hardware.enabled) score += 12;
    
    // Add points for geo security
    if (geoSecurity.enabled) score += 8;
    
    // Add points for identity verification
    if (identityVerification) score += 7;
    
    // Add points for post-quantum security
    if (postQuantumEnabled) score += 15;
    
    // Add points for emergency protocols
    if (emergencyProtocolEnabled) score += 9;
    
    // Cap the score at 100
    score = Math.min(100, score);
    
    setSecurityScore(score);
  };
  
  // Handlers for blockchains
  const handleChainSelect = (chain: Chain) => {
    if (selectedChains.includes(chain)) {
      setSelectedChains(selectedChains.filter(c => c !== chain));
      
      // If primary chain is removed, update primary chain
      if (primaryChain === chain && selectedChains.length > 1) {
        setPrimaryChain(selectedChains.find(c => c !== chain) || 'ethereum');
      }
    } else {
      setSelectedChains([...selectedChains, chain]);
    }
  };
  
  // Handler for setting primary chain
  const handleSetPrimaryChain = (chain: Chain) => {
    if (selectedChains.includes(chain)) {
      setPrimaryChain(chain);
    }
  };
  
  // Handler for security layers
  const handleSecurityLayerToggle = (layer: SecurityLayer) => {
    if (securityLayers.includes(layer)) {
      setSecurityLayers(securityLayers.filter(l => l !== layer));
    } else {
      setSecurityLayers([...securityLayers, layer]);
    }
  };
  
  // Handler for recovery methods
  const handleRecoveryMethodToggle = (method: RecoveryMethod) => {
    if (recoveryMethods.includes(method)) {
      setRecoveryMethods(recoveryMethods.filter(m => m !== method));
    } else {
      setRecoveryMethods([...recoveryMethods, method]);
    }
  };
  
  // Handler for backup strategies
  const handleBackupStrategyToggle = (strategy: VaultBackupStrategy) => {
    if (backupStrategies.includes(strategy)) {
      setBackupStrategies(backupStrategies.filter(s => s !== strategy));
    } else {
      setBackupStrategies([...backupStrategies, strategy]);
    }
  };
  
  // Handler for emergency responses
  const handleEmergencyResponseToggle = (response: EmergencyResponse) => {
    if (emergencyResponses.includes(response)) {
      setEmergencyResponses(emergencyResponses.filter(r => r !== response));
    } else {
      setEmergencyResponses([...emergencyResponses, response]);
    }
  };
  
  // Handlers for guardians
  const handleGuardianAdd = () => {
    setGuardians([
      ...guardians, 
      { 
        id: Date.now().toString(), 
        address: '', 
        type: 'wallet',
        name: `Guardian ${guardians.length + 1}`,
        threshold: 1,
        timelock: 24
      }
    ]);
  };
  
  const handleGuardianRemove = (id: string) => {
    setGuardians(guardians.filter(guardian => guardian.id !== id));
  };
  
  const handleGuardianChange = (id: string, field: keyof Guardian, value: any) => {
    setGuardians(guardians.map(guardian => {
      if (guardian.id === id) {
        return { ...guardian, [field]: value };
      }
      return guardian;
    }));
  };
  
  // Handlers for recovery shares
  const handleRecoveryShareAdd = () => {
    setRecoveryShares([
      ...recoveryShares, 
      {
        id: Date.now().toString(),
        name: `Share ${recoveryShares.length + 1}`,
        shareType: 'digital',
        threshold: 3,
        totalShares: 5,
        requiredShares: 3,
        encryptionAlgorithm: 'kyber'
      }
    ]);
  };
  
  const handleRecoveryShareRemove = (id: string) => {
    setRecoveryShares(recoveryShares.filter(share => share.id !== id));
  };
  
  const handleRecoveryShareChange = (id: string, field: keyof RecoveryShare, value: any) => {
    setRecoveryShares(recoveryShares.map(share => {
      if (share.id === id) {
        return { ...share, [field]: value };
      }
      return share;
    }));
  };
  
  // Handlers for verification policies
  const handleVerificationPolicyAdd = () => {
    setVerificationPolicies([
      ...verificationPolicies,
      {
        id: Date.now().toString(),
        name: `Policy ${verificationPolicies.length + 1}`,
        requiredFactors: 2,
        methods: {
          passwordEnabled: true,
          twoFactorEnabled: true,
          biometricEnabled: false,
          hardwareEnabled: false,
          socialEnabled: false,
          zkpEnabled: false
        },
        cooldownPeriod: 15,
        failedAttemptLimit: 5
      }
    ]);
  };
  
  const handleVerificationPolicyRemove = (id: string) => {
    setVerificationPolicies(verificationPolicies.filter(policy => policy.id !== id));
  };
  
  const handleVerificationPolicyChange = (id: string, field: string, value: any) => {
    setVerificationPolicies(verificationPolicies.map(policy => {
      if (policy.id === id) {
        if (field.startsWith('methods.')) {
          const methodField = field.split('.')[1];
          return {
            ...policy,
            methods: {
              ...policy.methods,
              [methodField]: value
            }
          };
        } else {
          return { ...policy, [field]: value };
        }
      }
      return policy;
    }));
  };
  
  // Handlers for emergency contacts
  const handleEmergencyContactAdd = () => {
    setEmergencyContacts([...emergencyContacts, '']);
  };
  
  const handleEmergencyContactRemove = (index: number) => {
    if (emergencyContacts.length > 1) {
      setEmergencyContacts(emergencyContacts.filter((_, i) => i !== index));
    } else {
      setEmergencyContacts(['']);
    }
  };
  
  const handleEmergencyContactChange = (index: number, value: string) => {
    const newContacts = [...emergencyContacts];
    newContacts[index] = value;
    setEmergencyContacts(newContacts);
  };
  
  // Check if wallet is connected for a blockchain
  const isWalletConnected = (blockchain: Chain): boolean => {
    switch(blockchain) {
      case 'ton':
        return Boolean(ton.isConnected && ton.walletInfo?.address);
      case 'ethereum':
        return Boolean(ethereum.isConnected);
      case 'solana':
        return Boolean(solana.isConnected);
      default:
        return false;
    };
  };
  
  // Input validation function
  const validateInputs = (): boolean => {
    if (!vaultName) {
      toast({
        title: "Vault Name Required",
        description: "Please provide a name for your security vault",
        variant: "destructive",
      });
      return false;
    }
    
    if (securityLayers.length === 0) {
      toast({
        title: "Security Layers Required",
        description: "Please select at least one security layer for your vault",
        variant: "destructive",
      });
      return false;
    }
    
    if (recoveryMethods.length === 0) {
      toast({
        title: "Recovery Methods Required",
        description: "Please select at least one recovery method for your vault",
        variant: "destructive",
      });
      return false;
    }
    
    if (accessMethod === 'multisig' && guardians.length < multisigThreshold) {
      toast({
        title: "More Guardians Required",
        description: `You need at least ${multisigThreshold} guardians for your chosen multisig threshold`,
        variant: "destructive",
      });
      return false;
    }
    
    if (passwordProtection && !password) {
      toast({
        title: "Password Required",
        description: "Please set a password for your vault",
        variant: "destructive",
      });
      return false;
    }
    
    if (customRecoveryEnabled && recoveryShares.length === 0) {
      toast({
        title: "Recovery Shares Required",
        description: "Please add at least one recovery share for custom recovery",
        variant: "destructive",
      });
      return false;
    }
    
    if (threatModel === 'custom' && !customThreatModelDescription) {
      toast({
        title: "Custom Threat Model Description Required",
        description: "Please describe your custom threat model",
        variant: "destructive",
      });
      return false;
    }
    
    if (emergencyProtocolEnabled && emergencyResponses.length === 0) {
      toast({
        title: "Emergency Responses Required",
        description: "Please select at least one emergency response action",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };
  
  // Form submission handler
  const handleCreateVault = async () => {
    if (!validateInputs()) return;
    
    setIsLoading(true);
    setIsDeploying(true);
    
    try {
      // Simulate deployment progress
      const interval = setInterval(() => {
        setDeploymentProgress(prev => {
          if (prev >= 95) {
            clearInterval(interval);
            return prev;
          }
          return prev + Math.floor(Math.random() * 5) + 1;
        });
      }, 800);
      
      // Prepare the vault configuration
      const vaultConfig = {
        name: vaultName,
        description: vaultDescription,
        chains: selectedChains,
        primaryChain: primaryChain,
        securityLayers,
        securityLevel,
        threatModel,
        customThreatModelDescription: threatModel === 'custom' ? customThreatModelDescription : undefined,
        accessMethod,
        passwordProtection,
        passwordComplexity,
        timelock,
        multisigThreshold,
        guardians: accessMethod === 'multisig' ? guardians : undefined,
        recoveryMethods,
        customRecoveryEnabled,
        recoveryEmail: recoveryEmail || undefined,
        recoveryShares: customRecoveryEnabled ? recoveryShares : undefined,
        backupStrategies,
        autoBackup,
        backupFrequency,
        offlineBackupReminder,
        biometric: biometric.enabled ? biometric : undefined,
        hardware: hardware.enabled ? hardware : undefined,
        geoSecurity: geoSecurity.enabled ? geoSecurity : undefined,
        identityVerification: identityVerification ? {
          enabled: true,
          provider: identityProvider
        } : undefined,
        verificationPolicies,
        emergencyProtocol: emergencyProtocolEnabled ? {
          enabled: true,
          responses: emergencyResponses,
          timelock: emergencyTimelock,
          contacts: emergencyContacts.filter(c => c)
        } : undefined,
        postQuantum: postQuantumEnabled ? {
          enabled: true,
          algorithm: quantumAlgorithm
        } : undefined,
        encryption: {
          primary: primaryEncryption,
          secondary: secondaryEncryption,
          keyRotation: {
            enabled: keyRotationEnabled,
            frequency: keyRotationFrequency
          }
        },
        riskProfile,
        securityScore,
        createdAt: new Date().toISOString(),
        version: '2.0'
      };
      
      // Create blockchain-specific configuration
      const blockchainConfig: Record<string, string> = {};
      selectedChains.forEach(chain => {
        switch(chain) {
          case 'ton':
            blockchainConfig.tonContractAddress = ton.walletInfo?.address || 'pending-deployment';
            break;
          case 'ethereum':
            blockchainConfig.ethereumContractAddress = ethereum.isConnected ? 'pending-deployment' : 'pending-deployment';
            break;
          case 'solana':
            blockchainConfig.solanaContractAddress = solana.isConnected ? 'pending-deployment' : 'pending-deployment';
            break;
          case 'bitcoin':
            blockchainConfig.bitcoinAddress = 'pending-derivation';
            break;
          case 'polygon':
            blockchainConfig.polygonContractAddress = 'pending-deployment';
            break;
          case 'avalanche':
            blockchainConfig.avalancheContractAddress = 'pending-deployment';
            break;
          case 'polkadot':
            blockchainConfig.polkadotAddress = 'pending-deployment';
            break;
          case 'cosmos':
            blockchainConfig.cosmosAddress = 'pending-deployment';
            break;
          case 'arbitrum':
            blockchainConfig.arbitrumContractAddress = 'pending-deployment';
            break;
        }
      });
      
      // Calculate vault creation date with timelock
      const unlockDate = new Date();
      unlockDate.setHours(unlockDate.getHours() + timelock);
      
      // Create vault data for API call
      const vaultData = {
        userId: 1, // This should be the actual user ID from auth
        name: vaultName,
        description: vaultDescription,
        vaultType: 'unique-security',
        chains: selectedChains,
        primaryChain: primaryChain,
        unlockDate: unlockDate.toISOString(),
        securityLevel: securityLevel,
        securityScore: securityScore,
        metadata: JSON.stringify(vaultConfig),
        ...blockchainConfig,
        quantumResistant: securityLayers.includes('quantum') || postQuantumEnabled,
        zeroKnowledge: securityLayers.includes('zkp'),
        multiSignature: accessMethod === 'multisig',
        timeLocked: accessMethod === 'timelock' || timelock > 0,
        hardwareProtected: hardware.enabled,
        biometricProtected: biometric.enabled,
        geoLocked: geoSecurity.enabled
      };
      
      // Simulate API call delay with success
      setTimeout(async () => {
        try {
          // Mock successful response for demo
          const mockResponse = {
            id: `USV-${Date.now().toString().slice(-8)}`,
            status: 'created',
            deploymentStatus: 'pending',
            securityScore: securityScore,
            createdAt: new Date().toISOString()
          };
          
          setVaultId(mockResponse.id);
          setDeploymentProgress(100);
          setIsSuccess(true);
          
          // Show success toast
          toast({
            title: "Security Vault Created Successfully",
            description: `Your Unique Security Vault (${mockResponse.id}) has been created with a security score of ${securityScore}/100.`,
            variant: "default",
          });
          
          // Simulate redirect after successful completion
          setTimeout(() => {
            navigate('/dashboard');
          }, 3000);
        } catch (error) {
          console.error("Error creating vault:", error);
          toast({
            title: "Error Creating Vault",
            description: "There was an error creating your security vault. Please try again.",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
          setIsDeploying(false);
        }
      }, 5000);
    } catch (error) {
      console.error("Error in vault creation process:", error);
      toast({
        title: "Error Creating Vault",
        description: "There was an error in the vault creation process. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
      setIsDeploying(false);
    }
  };
  
  // Render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case "basic":
        return (
          <div className="space-y-6">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="vault-name">Vault Name</Label>
              <Input
                id="vault-name"
                placeholder="Enter a name for your security vault"
                value={vaultName}
                onChange={(e) => setVaultName(e.target.value)}
              />
            </div>
            
            <div className="flex flex-col space-y-2">
              <Label htmlFor="vault-description">Description (Optional)</Label>
              <Textarea
                id="vault-description"
                placeholder="Enter a description of what this vault will protect"
                value={vaultDescription}
                onChange={(e) => setVaultDescription(e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="flex flex-col space-y-2">
              <Label htmlFor="risk-profile">Risk Profile</Label>
              <Select 
                value={riskProfile}
                onValueChange={(value) => setRiskProfile(value as VaultRiskProfile)}
              >
                <SelectTrigger id="risk-profile">
                  <SelectValue placeholder="Select risk profile" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ultra-secure">Ultra-Secure (Highest Protection)</SelectItem>
                  <SelectItem value="balanced">Balanced (Recommended)</SelectItem>
                  <SelectItem value="custom">Custom Configuration</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-400">
                {riskProfile === 'ultra-secure' && 'Maximum security with multiple protection layers and recovery options.'}
                {riskProfile === 'balanced' && 'Strong security with a balance of protection and convenience.'}
                {riskProfile === 'custom' && 'Customize all security parameters to your specific needs.'}
              </p>
            </div>
            
            <div className="flex flex-col space-y-2">
              <Label htmlFor="threat-model">Threat Model</Label>
              <Select 
                value={threatModel}
                onValueChange={(value) => setThreatModel(value as ThreatModel)}
              >
                <SelectTrigger id="threat-model">
                  <SelectValue placeholder="Select threat model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard (Common Threats)</SelectItem>
                  <SelectItem value="advanced">Advanced (Sophisticated Attackers)</SelectItem>
                  <SelectItem value="nation-state">Nation-State (Highest Threat Level)</SelectItem>
                  <SelectItem value="quantum">Quantum Computing Resistant</SelectItem>
                  <SelectItem value="insider">Insider Threat Protection</SelectItem>
                  <SelectItem value="physical">Physical Security Focus</SelectItem>
                  <SelectItem value="custom">Custom Threat Model</SelectItem>
                </SelectContent>
              </Select>
              
              {threatModel === 'custom' && (
                <div className="mt-2">
                  <Textarea
                    placeholder="Describe your custom threat model"
                    value={customThreatModelDescription}
                    onChange={(e) => setCustomThreatModelDescription(e.target.value)}
                    rows={3}
                  />
                </div>
              )}
            </div>
            
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="security-level">Security Level: {securityLevel}/5</Label>
              </div>
              <Slider
                id="security-level"
                min={1}
                max={5}
                step={1}
                value={[securityLevel]}
                onValueChange={(value) => setSecurityLevel(value[0])}
              />
              <div className="grid grid-cols-5 gap-1 mt-1">
                <div className={`h-1 rounded-l ${securityLevel >= 1 ? 'bg-green-500' : 'bg-gray-700'}`}></div>
                <div className={`h-1 ${securityLevel >= 2 ? 'bg-blue-500' : 'bg-gray-700'}`}></div>
                <div className={`h-1 ${securityLevel >= 3 ? 'bg-yellow-500' : 'bg-gray-700'}`}></div>
                <div className={`h-1 ${securityLevel >= 4 ? 'bg-orange-500' : 'bg-gray-700'}`}></div>
                <div className={`h-1 rounded-r ${securityLevel >= 5 ? 'bg-red-500' : 'bg-gray-700'}`}></div>
              </div>
              <div className="text-xs text-gray-400 flex justify-between">
                <span>Basic</span>
                <span>Enhanced</span>
                <span>Advanced</span>
                <span>Superior</span>
                <span>Maximum</span>
              </div>
            </div>
          </div>
        );
      
      case "blockchain":
        return (
          <div className="space-y-6">
            <div className="flex flex-col space-y-2">
              <Label className="text-lg">Blockchain Integration</Label>
              <p className="text-sm text-gray-400">Select which blockchains to integrate with your security vault</p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { id: 'ethereum', name: 'Ethereum', icon: '♦️', color: 'from-blue-600/30 to-indigo-600/30 border-blue-500/30' },
                { id: 'ton', name: 'TON', icon: '💎', color: 'from-blue-400/30 to-blue-600/30 border-blue-400/30' },
                { id: 'solana', name: 'Solana', icon: '◎', color: 'from-purple-600/30 to-fuchsia-600/30 border-purple-500/30' },
                { id: 'bitcoin', name: 'Bitcoin', icon: '₿', color: 'from-orange-600/30 to-amber-600/30 border-orange-500/30' },
                { id: 'polygon', name: 'Polygon', icon: '⬡', color: 'from-indigo-600/30 to-violet-600/30 border-indigo-500/30' },
                { id: 'avalanche', name: 'Avalanche', icon: '❄️', color: 'from-red-600/30 to-rose-600/30 border-red-500/30' },
                { id: 'polkadot', name: 'Polkadot', icon: '●', color: 'from-pink-600/30 to-rose-600/30 border-pink-500/30' },
                { id: 'cosmos', name: 'Cosmos', icon: '✧', color: 'from-cyan-600/30 to-blue-600/30 border-cyan-500/30' },
                { id: 'arbitrum', name: 'Arbitrum', icon: '⚡', color: 'from-blue-600/30 to-indigo-600/30 border-blue-500/30' }
              ].map(chain => (
                <div
                  key={chain.id}
                  onClick={() => handleChainSelect(chain.id as Chain)}
                  className={`
                    cursor-pointer p-4 rounded-xl 
                    transition-all duration-200 
                    bg-gradient-to-br border-2
                    ${selectedChains.includes(chain.id as Chain) 
                      ? chain.color + ' shadow-lg' 
                      : 'from-transparent to-transparent border-gray-700/50 hover:border-gray-600/50'}
                  `}
                >
                  <div className="flex flex-col items-center text-center space-y-2">
                    <span className="text-2xl">{chain.icon}</span>
                    <span className={`font-medium ${selectedChains.includes(chain.id as Chain) ? 'text-white' : 'text-gray-400'}`}>
                      {chain.name}
                    </span>
                    
                    {selectedChains.includes(chain.id as Chain) && (
                      <div className="mt-2 flex items-center space-x-1">
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSetPrimaryChain(chain.id as Chain);
                          }}
                          className={`
                            px-2 py-1 text-xs rounded-full 
                            ${primaryChain === chain.id 
                              ? 'bg-green-900/60 text-green-300 border border-green-500/30' 
                              : 'bg-gray-800/80 text-gray-400 border border-gray-700 hover:bg-gray-700/70'
                            }
                          `}
                        >
                          {primaryChain === chain.id ? 'Primary' : 'Set as primary'}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex flex-col space-y-2">
              <Label className="text-lg">Security Layers</Label>
              <p className="text-sm text-gray-400">Select protection layers for your vault</p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'blockchain', label: 'Blockchain', icon: <Globe className="h-3 w-3" /> },
                { id: 'quantum', label: 'Quantum Resistant', icon: <Cpu className="h-3 w-3" /> },
                { id: 'biometric', label: 'Biometric', icon: <Fingerprint className="h-3 w-3" /> },
                { id: 'zkp', label: 'Zero-Knowledge', icon: <Eye className="h-3 w-3" /> },
                { id: 'enclave', label: 'Secure Enclave', icon: <ShieldAlert className="h-3 w-3" /> },
                { id: 'timelock', label: 'Time Lock', icon: <Timer className="h-3 w-3" /> },
                { id: 'mpc', label: 'Multi-Party', icon: <Network className="h-3 w-3" /> },
                { id: 'post-quantum', label: 'Post-Quantum', icon: <Server className="h-3 w-3" /> },
                { id: 'social', label: 'Social Recovery', icon: <Globe className="h-3 w-3" /> },
                { id: 'identity', label: 'Identity Verified', icon: <Landmark className="h-3 w-3" /> },
                { id: 'hardware', label: 'Hardware Secured', icon: <HardDrive className="h-3 w-3" /> }
              ].map(layer => (
                <div 
                  key={layer.id}
                  onClick={() => handleSecurityLayerToggle(layer.id as SecurityLayer)}
                  className={`cursor-pointer flex items-center justify-center py-2 rounded-lg text-sm ${
                    securityLayers.includes(layer.id as SecurityLayer) 
                      ? 'bg-purple-900/40 text-white border border-purple-500/50' 
                      : 'bg-gray-800 text-gray-400 border border-gray-700'
                  }`}
                >
                  <span className="mr-1">{layer.icon}</span> {layer.label}
                </div>
              ))}
            </div>
          </div>
        );
        
      case "access":
        return (
          <div className="space-y-6">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="access-method">Access Method</Label>
              <Select 
                value={accessMethod}
                onValueChange={(value) => setAccessMethod(value as AccessMethod)}
              >
                <SelectTrigger id="access-method">
                  <SelectValue placeholder="Select access method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard (Password)</SelectItem>
                  <SelectItem value="multisig">Multi-Signature</SelectItem>
                  <SelectItem value="guardians">Social Guardians</SelectItem>
                  <SelectItem value="timelock">Time-Locked</SelectItem>
                  <SelectItem value="zkproof">Zero-Knowledge Proof</SelectItem>
                  <SelectItem value="mpc">Multi-Party Computation</SelectItem>
                  <SelectItem value="biometric">Biometric Verification</SelectItem>
                  <SelectItem value="device-based">Device-Based</SelectItem>
                  <SelectItem value="passwordless">Passwordless</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-400">
                {accessMethod === 'standard' && 'Traditional access with password protection'}
                {accessMethod === 'multisig' && 'Require multiple signatures to access the vault'}
                {accessMethod === 'guardians' && 'Trusted guardians can help recover access'}
                {accessMethod === 'timelock' && 'Access requires a time delay for security'}
                {accessMethod === 'zkproof' && 'Verify identity without revealing sensitive information'}
                {accessMethod === 'mpc' && 'Keys are never fully assembled in one place'}
                {accessMethod === 'biometric' && 'Use biometric traits for authentication'}
                {accessMethod === 'device-based' && 'Authentication tied to specific trusted devices'}
                {accessMethod === 'passwordless' && 'Modern authentication without password vulnerabilities'}
              </p>
            </div>
            
            {(accessMethod === 'standard' || passwordProtection) && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password-protection">Password Protection</Label>
                  <Switch 
                    id="password-protection" 
                    checked={passwordProtection}
                    onCheckedChange={setPasswordProtection}
                  />
                </div>
                
                {passwordProtection && (
                  <>
                    <div className="flex flex-col space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter a secure password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="password-complexity">Password Complexity: {passwordComplexity}/5</Label>
                      </div>
                      <Slider
                        id="password-complexity"
                        min={1}
                        max={5}
                        step={1}
                        value={[passwordComplexity]}
                        onValueChange={(value) => setPasswordComplexity(value[0])}
                      />
                      <div className="grid grid-cols-5 gap-1 mt-1">
                        <div className={`h-1 rounded-l ${passwordComplexity >= 1 ? 'bg-red-500' : 'bg-gray-700'}`}></div>
                        <div className={`h-1 ${passwordComplexity >= 2 ? 'bg-orange-500' : 'bg-gray-700'}`}></div>
                        <div className={`h-1 ${passwordComplexity >= 3 ? 'bg-yellow-500' : 'bg-gray-700'}`}></div>
                        <div className={`h-1 ${passwordComplexity >= 4 ? 'bg-green-500' : 'bg-gray-700'}`}></div>
                        <div className={`h-1 rounded-r ${passwordComplexity >= 5 ? 'bg-emerald-500' : 'bg-gray-700'}`}></div>
                      </div>
                      <div className="text-xs text-gray-400 flex justify-between">
                        <span>Basic</span>
                        <span>Medium</span>
                        <span>Strong</span>
                        <span>Complex</span>
                        <span>Maximum</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
            
            {(accessMethod === 'timelock' || timelock > 0) && (
              <div className="flex flex-col space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="timelock">Time Lock (hours): {timelock}</Label>
                </div>
                <Slider
                  id="timelock"
                  min={1}
                  max={72}
                  step={1}
                  value={[timelock]}
                  onValueChange={(value) => setTimelock(value[0])}
                />
                <p className="text-xs text-gray-400">
                  Requires a waiting period of {timelock} hours before access is granted
                </p>
              </div>
            )}
            
            {accessMethod === 'multisig' && (
              <div className="space-y-4">
                <div className="flex flex-col space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="multisig-threshold">Required Signatures: {multisigThreshold}</Label>
                  </div>
                  <Slider
                    id="multisig-threshold"
                    min={1}
                    max={5}
                    step={1}
                    value={[multisigThreshold]}
                    onValueChange={(value) => setMultisigThreshold(value[0])}
                  />
                  <p className="text-xs text-gray-400">
                    Requires {multisigThreshold} out of {guardians.length} signatures to access
                  </p>
                </div>
                
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Guardians</h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleGuardianAdd}
                  >
                    <PlusCircle className="h-4 w-4 mr-1" /> Add Guardian
                  </Button>
                </div>
                
                {guardians.map((guardian) => (
                  <div key={guardian.id} className="space-y-4 p-4 border rounded-lg relative">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => handleGuardianRemove(guardian.id)}
                      disabled={guardians.length <= 1}
                    >
                      <MinusCircle className="h-4 w-4" />
                    </Button>
                    
                    <div className="flex flex-col space-y-2">
                      <Label htmlFor={`guardian-name-${guardian.id}`}>Guardian Name</Label>
                      <Input
                        id={`guardian-name-${guardian.id}`}
                        value={guardian.name}
                        onChange={(e) => handleGuardianChange(guardian.id, 'name', e.target.value)}
                        placeholder="Enter guardian name or description"
                      />
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      <Label htmlFor={`guardian-address-${guardian.id}`}>Address</Label>
                      <Input
                        id={`guardian-address-${guardian.id}`}
                        value={guardian.address}
                        onChange={(e) => handleGuardianChange(guardian.id, 'address', e.target.value)}
                        placeholder="Enter guardian wallet address or identifier"
                      />
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      <Label htmlFor={`guardian-type-${guardian.id}`}>Type</Label>
                      <Select 
                        value={guardian.type}
                        onValueChange={(value) => handleGuardianChange(guardian.id, 'type', value)}
                      >
                        <SelectTrigger id={`guardian-type-${guardian.id}`}>
                          <SelectValue placeholder="Select guardian type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="wallet">Wallet</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="contract">Smart Contract</SelectItem>
                          <SelectItem value="hardware">Hardware Device</SelectItem>
                          <SelectItem value="institution">Institution</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {accessMethod === 'biometric' || (biometric.enabled && (
              <div className="space-y-4 mt-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="biometric-enabled">Biometric Verification</Label>
                  <Switch 
                    id="biometric-enabled" 
                    checked={biometric.enabled}
                    onCheckedChange={(checked) => setBiometric({...biometric, enabled: checked})}
                  />
                </div>
                
                {biometric.enabled && (
                  <>
                    <div className="flex flex-col space-y-2">
                      <Label htmlFor="biometric-type">Biometric Type</Label>
                      <Select 
                        value={biometric.type}
                        onValueChange={(value) => setBiometric({...biometric, type: value as any})}
                      >
                        <SelectTrigger id="biometric-type">
                          <SelectValue placeholder="Select biometric type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fingerprint">Fingerprint</SelectItem>
                          <SelectItem value="facial">Facial Recognition</SelectItem>
                          <SelectItem value="iris">Iris Scan</SelectItem>
                          <SelectItem value="voice">Voice Recognition</SelectItem>
                          <SelectItem value="behavioral">Behavioral Biometrics</SelectItem>
                          <SelectItem value="multi">Multi-Biometric</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      <Label htmlFor="biometric-storage">Storage Method</Label>
                      <Select 
                        value={biometric.storageMethod}
                        onValueChange={(value) => setBiometric({...biometric, storageMethod: value as any})}
                      >
                        <SelectTrigger id="biometric-storage">
                          <SelectValue placeholder="Select storage method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="local">Local Device</SelectItem>
                          <SelectItem value="encrypted">Encrypted Cloud</SelectItem>
                          <SelectItem value="zkp">Zero-Knowledge Proof</SelectItem>
                          <SelectItem value="none">No Storage (Verification Only)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
              </div>
            ))}
            
            {accessMethod === 'device-based' || (hardware.enabled && (
              <div className="space-y-4 mt-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="hardware-enabled">Hardware Security</Label>
                  <Switch 
                    id="hardware-enabled" 
                    checked={hardware.enabled}
                    onCheckedChange={(checked) => setHardware({...hardware, enabled: checked})}
                  />
                </div>
                
                {hardware.enabled && (
                  <>
                    <div className="flex flex-col space-y-2">
                      <Label htmlFor="hardware-type">Hardware Type</Label>
                      <Select 
                        value={hardware.type}
                        onValueChange={(value) => setHardware({...hardware, type: value as any})}
                      >
                        <SelectTrigger id="hardware-type">
                          <SelectValue placeholder="Select hardware type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ledger">Ledger</SelectItem>
                          <SelectItem value="trezor">Trezor</SelectItem>
                          <SelectItem value="grid+">Grid+</SelectItem>
                          <SelectItem value="yubico">Yubico</SelectItem>
                          <SelectItem value="onlykey">OnlyKey</SelectItem>
                          <SelectItem value="jade">Blockstream Jade</SelectItem>
                          <SelectItem value="keystone">Keystone</SelectItem>
                          <SelectItem value="custom">Custom Hardware</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      <Label htmlFor="hardware-connection">Connection Method</Label>
                      <Select 
                        value={hardware.connectionMethod}
                        onValueChange={(value) => setHardware({...hardware, connectionMethod: value as any})}
                      >
                        <SelectTrigger id="hardware-connection">
                          <SelectValue placeholder="Select connection method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="usb">USB</SelectItem>
                          <SelectItem value="bluetooth">Bluetooth</SelectItem>
                          <SelectItem value="nfc">NFC</SelectItem>
                          <SelectItem value="qr">QR Codes</SelectItem>
                          <SelectItem value="airgap">Air-Gapped</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="passphrase-protection">Passphrase Protection</Label>
                      <Switch 
                        id="passphrase-protection" 
                        checked={hardware.passphraseProtection}
                        onCheckedChange={(checked) => setHardware({...hardware, passphraseProtection: checked})}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="pin-protection">PIN Protection</Label>
                      <Switch 
                        id="pin-protection" 
                        checked={hardware.pinProtection}
                        onCheckedChange={(checked) => setHardware({...hardware, pinProtection: checked})}
                      />
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        );
        
      case "recovery":
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Recovery Methods</Label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'seedPhrase', label: 'Seed Phrase', icon: <Key className="h-3 w-3" /> },
                  { id: 'social', label: 'Social Recovery', icon: <Globe className="h-3 w-3" /> },
                  { id: 'biometric', label: 'Biometric', icon: <Fingerprint className="h-3 w-3" /> },
                  { id: 'hardware', label: 'Hardware Device', icon: <HardDrive className="h-3 w-3" /> },
                  { id: 'sharded', label: 'Sharded Keys', icon: <FileCode2 className="h-3 w-3" /> },
                  { id: 'legal', label: 'Legal Entity', icon: <Landmark className="h-3 w-3" /> },
                  { id: 'quantum', label: 'Quantum Backup', icon: <Server className="h-3 w-3" /> }
                ].map(method => (
                  <div 
                    key={method.id}
                    onClick={() => handleRecoveryMethodToggle(method.id as RecoveryMethod)}
                    className={`cursor-pointer flex items-center justify-center py-2 rounded-lg text-sm ${
                      recoveryMethods.includes(method.id as RecoveryMethod) 
                        ? 'bg-purple-900/40 text-white border border-purple-500/50' 
                        : 'bg-gray-800 text-gray-400 border border-gray-700'
                    }`}
                  >
                    <span className="mr-1">{method.icon}</span> {method.label}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Backup Strategies</Label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'distributed', label: 'Distributed', icon: <Network className="h-3 w-3" /> },
                  { id: 'encrypted', label: 'Encrypted', icon: <Lock className="h-3 w-3" /> },
                  { id: 'sharded', label: 'Sharded', icon: <FileCode2 className="h-3 w-3" /> },
                  { id: 'quantum', label: 'Quantum-Safe', icon: <Server className="h-3 w-3" /> },
                  { id: 'offline', label: 'Offline', icon: <HardDrive className="h-3 w-3" /> },
                  { id: 'hierarchical', label: 'Hierarchical', icon: <ChevronsUpDown className="h-3 w-3" /> }
                ].map(strategy => (
                  <div 
                    key={strategy.id}
                    onClick={() => handleBackupStrategyToggle(strategy.id as VaultBackupStrategy)}
                    className={`cursor-pointer flex items-center justify-center py-2 rounded-lg text-sm ${
                      backupStrategies.includes(strategy.id as VaultBackupStrategy) 
                        ? 'bg-purple-900/40 text-white border border-purple-500/50' 
                        : 'bg-gray-800 text-gray-400 border border-gray-700'
                    }`}
                  >
                    <span className="mr-1">{strategy.icon}</span> {strategy.label}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-backup">Automatic Backup</Label>
              <Switch 
                id="auto-backup" 
                checked={autoBackup}
                onCheckedChange={setAutoBackup}
              />
            </div>
            
            {autoBackup && (
              <div className="flex flex-col space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="backup-frequency">Backup Frequency: Every {backupFrequency} days</Label>
                </div>
                <Slider
                  id="backup-frequency"
                  min={1}
                  max={30}
                  step={1}
                  value={[backupFrequency]}
                  onValueChange={(value) => setBackupFrequency(value[0])}
                />
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <Label htmlFor="offline-backup-reminder">Offline Backup Reminders</Label>
              <Switch 
                id="offline-backup-reminder" 
                checked={offlineBackupReminder}
                onCheckedChange={setOfflineBackupReminder}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="custom-recovery">Custom Recovery Shares</Label>
              <Switch 
                id="custom-recovery" 
                checked={customRecoveryEnabled}
                onCheckedChange={setCustomRecoveryEnabled}
              />
            </div>
            
            {customRecoveryEnabled && (
              <div className="space-y-4">
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="recovery-email">Recovery Email (Optional)</Label>
                  <Input
                    id="recovery-email"
                    type="email"
                    placeholder="Enter a recovery email address"
                    value={recoveryEmail}
                    onChange={(e) => setRecoveryEmail(e.target.value)}
                  />
                </div>
                
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Recovery Shares</h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleRecoveryShareAdd}
                  >
                    <PlusCircle className="h-4 w-4 mr-1" /> Add Share
                  </Button>
                </div>
                
                {recoveryShares.map((share) => (
                  <div key={share.id} className="space-y-4 p-4 border rounded-lg relative">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => handleRecoveryShareRemove(share.id)}
                      disabled={recoveryShares.length <= 1}
                    >
                      <MinusCircle className="h-4 w-4" />
                    </Button>
                    
                    <div className="flex flex-col space-y-2">
                      <Label htmlFor={`share-name-${share.id}`}>Share Name</Label>
                      <Input
                        id={`share-name-${share.id}`}
                        value={share.name}
                        onChange={(e) => handleRecoveryShareChange(share.id, 'name', e.target.value)}
                        placeholder="Enter a name for this share"
                      />
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      <Label htmlFor={`share-type-${share.id}`}>Share Type</Label>
                      <Select 
                        value={share.shareType}
                        onValueChange={(value) => handleRecoveryShareChange(share.id, 'shareType', value)}
                      >
                        <SelectTrigger id={`share-type-${share.id}`}>
                          <SelectValue placeholder="Select share type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="digital">Digital</SelectItem>
                          <SelectItem value="physical">Physical</SelectItem>
                          <SelectItem value="mental">Mental</SelectItem>
                          <SelectItem value="institutional">Institutional</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      <Label htmlFor={`share-contact-${share.id}`}>Contact Info (Optional)</Label>
                      <Input
                        id={`share-contact-${share.id}`}
                        value={share.contact || ''}
                        onChange={(e) => handleRecoveryShareChange(share.id, 'contact', e.target.value)}
                        placeholder="Enter contact information for this share"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col space-y-2">
                        <Label htmlFor={`share-total-${share.id}`}>Total Shares: {share.totalShares}</Label>
                        <Slider
                          id={`share-total-${share.id}`}
                          min={2}
                          max={10}
                          step={1}
                          value={[share.totalShares]}
                          onValueChange={(value) => {
                            handleRecoveryShareChange(share.id, 'totalShares', value[0]);
                            if (share.requiredShares > value[0]) {
                              handleRecoveryShareChange(share.id, 'requiredShares', value[0]);
                            }
                          }}
                        />
                      </div>
                      
                      <div className="flex flex-col space-y-2">
                        <Label htmlFor={`share-required-${share.id}`}>Required: {share.requiredShares}</Label>
                        <Slider
                          id={`share-required-${share.id}`}
                          min={1}
                          max={share.totalShares}
                          step={1}
                          value={[share.requiredShares]}
                          onValueChange={(value) => handleRecoveryShareChange(share.id, 'requiredShares', value[0])}
                        />
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      <Label htmlFor={`encryption-algorithm-${share.id}`}>Encryption Algorithm</Label>
                      <Select 
                        value={share.encryptionAlgorithm}
                        onValueChange={(value) => handleRecoveryShareChange(share.id, 'encryptionAlgorithm', value as EncryptionAlgorithm)}
                      >
                        <SelectTrigger id={`encryption-algorithm-${share.id}`}>
                          <SelectValue placeholder="Select algorithm" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="aes256">AES-256</SelectItem>
                          <SelectItem value="rsa4096">RSA-4096</SelectItem>
                          <SelectItem value="ecc">ECC</SelectItem>
                          <SelectItem value="lattice">Lattice-Based</SelectItem>
                          <SelectItem value="blowfish">Blowfish</SelectItem>
                          <SelectItem value="kyber">CRYSTALS-Kyber</SelectItem>
                          <SelectItem value="dilithium">CRYSTALS-Dilithium</SelectItem>
                          <SelectItem value="falcon">FALCON</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
        
      case "advanced":
        return (
          <div className="space-y-6">
            <div className="flex flex-col space-y-4">
              <h3 className="text-lg font-medium">Advanced Security Options</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="geo-security" className="block">Geographic Security</Label>
                    <p className="text-xs text-gray-400">Restrict access based on geographic location</p>
                  </div>
                  <Switch 
                    id="geo-security" 
                    checked={geoSecurity.enabled}
                    onCheckedChange={(checked) => setGeoSecurity({...geoSecurity, enabled: checked})}
                  />
                </div>
                
                {geoSecurity.enabled && (
                  <div className="space-y-4 p-4 border border-gray-700 rounded-lg">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="device-locking">Device Locking</Label>
                      <Switch 
                        id="device-locking" 
                        checked={geoSecurity.deviceLocking}
                        onCheckedChange={(checked) => setGeoSecurity({...geoSecurity, deviceLocking: checked})}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="device-attestation">Device Attestation</Label>
                      <Switch 
                        id="device-attestation" 
                        checked={geoSecurity.deviceAttestation}
                        onCheckedChange={(checked) => setGeoSecurity({...geoSecurity, deviceAttestation: checked})}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="ip-verification">IP Verification</Label>
                      <Switch 
                        id="ip-verification" 
                        checked={geoSecurity.ipVerification}
                        onCheckedChange={(checked) => setGeoSecurity({...geoSecurity, ipVerification: checked})}
                      />
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="identity-verification" className="block">Identity Verification</Label>
                    <p className="text-xs text-gray-400">Verify the identity of users accessing the vault</p>
                  </div>
                  <Switch 
                    id="identity-verification" 
                    checked={identityVerification}
                    onCheckedChange={setIdentityVerification}
                  />
                </div>
                
                {identityVerification && (
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="identity-provider">Identity Provider</Label>
                    <Select 
                      value={identityProvider}
                      onValueChange={(value) => setIdentityProvider(value as IdentityProvider)}
                    >
                      <SelectTrigger id="identity-provider">
                        <SelectValue placeholder="Select identity provider" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="self-sovereign">Self-Sovereign Identity</SelectItem>
                        <SelectItem value="decentralized">Decentralized Identity</SelectItem>
                        <SelectItem value="blockchain">Blockchain Verification</SelectItem>
                        <SelectItem value="federated">Federated Identity</SelectItem>
                        <SelectItem value="social">Social Identity</SelectItem>
                        <SelectItem value="kyc">KYC Provider</SelectItem>
                        <SelectItem value="biometric">Biometric Identity</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="post-quantum" className="block">Post-Quantum Security</Label>
                    <p className="text-xs text-gray-400">Protection against quantum computing attacks</p>
                  </div>
                  <Switch 
                    id="post-quantum" 
                    checked={postQuantumEnabled}
                    onCheckedChange={setPostQuantumEnabled}
                  />
                </div>
                
                {postQuantumEnabled && (
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="quantum-algorithm">Quantum Algorithm</Label>
                    <Select 
                      value={quantumAlgorithm}
                      onValueChange={setQuantumAlgorithm}
                    >
                      <SelectTrigger id="quantum-algorithm">
                        <SelectValue placeholder="Select quantum algorithm" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kyber-512">CRYSTALS-Kyber (512)</SelectItem>
                        <SelectItem value="kyber-768">CRYSTALS-Kyber (768)</SelectItem>
                        <SelectItem value="kyber-1024">CRYSTALS-Kyber (1024)</SelectItem>
                        <SelectItem value="dilithium-2">CRYSTALS-Dilithium (2)</SelectItem>
                        <SelectItem value="dilithium-3">CRYSTALS-Dilithium (3)</SelectItem>
                        <SelectItem value="falcon-512">FALCON (512)</SelectItem>
                        <SelectItem value="falcon-1024">FALCON (1024)</SelectItem>
                        <SelectItem value="frodo-640">FrodoKEM (640)</SelectItem>
                        <SelectItem value="frodo-976">FrodoKEM (976)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              
              <Separator className="my-4" />
              
              <h3 className="text-lg font-medium">Encryption Settings</h3>
              
              <div className="space-y-4">
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="primary-encryption">Primary Encryption</Label>
                  <Select 
                    value={primaryEncryption}
                    onValueChange={(value) => setPrimaryEncryption(value as EncryptionAlgorithm)}
                  >
                    <SelectTrigger id="primary-encryption">
                      <SelectValue placeholder="Select primary encryption" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aes256">AES-256</SelectItem>
                      <SelectItem value="rsa4096">RSA-4096</SelectItem>
                      <SelectItem value="ecc">ECC</SelectItem>
                      <SelectItem value="lattice">Lattice-Based</SelectItem>
                      <SelectItem value="blowfish">Blowfish</SelectItem>
                      <SelectItem value="kyber">CRYSTALS-Kyber</SelectItem>
                      <SelectItem value="dilithium">CRYSTALS-Dilithium</SelectItem>
                      <SelectItem value="falcon">FALCON</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="secondary-encryption">Secondary Encryption</Label>
                  <Select 
                    value={secondaryEncryption}
                    onValueChange={(value) => setSecondaryEncryption(value as EncryptionAlgorithm)}
                  >
                    <SelectTrigger id="secondary-encryption">
                      <SelectValue placeholder="Select secondary encryption" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aes256">AES-256</SelectItem>
                      <SelectItem value="rsa4096">RSA-4096</SelectItem>
                      <SelectItem value="ecc">ECC</SelectItem>
                      <SelectItem value="lattice">Lattice-Based</SelectItem>
                      <SelectItem value="blowfish">Blowfish</SelectItem>
                      <SelectItem value="kyber">CRYSTALS-Kyber</SelectItem>
                      <SelectItem value="dilithium">CRYSTALS-Dilithium</SelectItem>
                      <SelectItem value="falcon">FALCON</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="key-rotation">Key Rotation</Label>
                  <Switch 
                    id="key-rotation" 
                    checked={keyRotationEnabled}
                    onCheckedChange={setKeyRotationEnabled}
                  />
                </div>
                
                {keyRotationEnabled && (
                  <div className="flex flex-col space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="key-rotation-frequency">Rotation Frequency: Every {keyRotationFrequency} days</Label>
                    </div>
                    <Slider
                      id="key-rotation-frequency"
                      min={30}
                      max={365}
                      step={30}
                      value={[keyRotationFrequency]}
                      onValueChange={(value) => setKeyRotationFrequency(value[0])}
                    />
                  </div>
                )}
              </div>
              
              <Separator className="my-4" />
              
              <h3 className="text-lg font-medium">Emergency Protocols</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="emergency-protocol">Emergency Protocol</Label>
                  <Switch 
                    id="emergency-protocol" 
                    checked={emergencyProtocolEnabled}
                    onCheckedChange={setEmergencyProtocolEnabled}
                  />
                </div>
                
                {emergencyProtocolEnabled && (
                  <>
                    <div className="space-y-2">
                      <Label>Emergency Responses</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: 'lockdown', label: 'Lockdown', icon: <Lock className="h-3 w-3" /> },
                          { id: 'recovery', label: 'Recovery', icon: <RefreshCw className="h-3 w-3" /> },
                          { id: 'destroy', label: 'Destroy', icon: <AlertTriangle className="h-3 w-3" /> },
                          { id: 'transfer', label: 'Transfer', icon: <ChevronsUpDown className="h-3 w-3" /> },
                          { id: 'alert', label: 'Alert', icon: <Radar className="h-3 w-3" /> },
                          { id: 'duress', label: 'Duress', icon: <ShieldAlert className="h-3 w-3" /> }
                        ].map(response => (
                          <div 
                            key={response.id}
                            onClick={() => handleEmergencyResponseToggle(response.id as EmergencyResponse)}
                            className={`cursor-pointer flex items-center justify-center py-2 rounded-lg text-sm ${
                              emergencyResponses.includes(response.id as EmergencyResponse) 
                                ? 'bg-purple-900/40 text-white border border-purple-500/50' 
                                : 'bg-gray-800 text-gray-400 border border-gray-700'
                            }`}
                          >
                            <span className="mr-1">{response.icon}</span> {response.label}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="emergency-timelock">Emergency Timelock: {emergencyTimelock} hours</Label>
                      </div>
                      <Slider
                        id="emergency-timelock"
                        min={1}
                        max={168}
                        step={1}
                        value={[emergencyTimelock]}
                        onValueChange={(value) => setEmergencyTimelock(value[0])}
                      />
                      <p className="text-xs text-gray-400">
                        Time before emergency protocols are executed
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="emergency-contacts">Emergency Contacts</Label>
                      {emergencyContacts.map((contact, index) => (
                        <div key={index} className="flex space-x-2">
                          <Input
                            value={contact}
                            onChange={(e) => handleEmergencyContactChange(index, e.target.value)}
                            placeholder="Enter emergency contact info"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEmergencyContactRemove(index)}
                            disabled={emergencyContacts.length <= 1}
                          >
                            <MinusCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleEmergencyContactAdd}
                      >
                        <PlusCircle className="h-4 w-4 mr-1" /> Add Contact
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        );
        
      case "review":
        return (
          <div className="space-y-6">
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Security Vault Summary</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-400">Security Score:</span>
                  <Badge className={`
                    ${securityScore >= 90 ? 'bg-green-900/60 text-green-300' : 
                      securityScore >= 70 ? 'bg-blue-900/60 text-blue-300' : 
                      securityScore >= 50 ? 'bg-yellow-900/60 text-yellow-300' : 
                      'bg-red-900/60 text-red-300'}
                  `}>
                    {securityScore}/100
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Vault Name:</span>
                    <span className="font-medium">{vaultName || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Security Level:</span>
                    <span className="font-medium">{securityLevel}/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Risk Profile:</span>
                    <span className="font-medium">{riskProfile.replace('-', ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Threat Model:</span>
                    <span className="font-medium">{threatModel.replace('-', ' ')}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Access Method:</span>
                    <span className="font-medium">{accessMethod.replace('-', ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Primary Chain:</span>
                    <span className="font-medium">{primaryChain.charAt(0).toUpperCase() + primaryChain.slice(1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Recovery Methods:</span>
                    <span className="font-medium">{recoveryMethods.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Security Layers:</span>
                    <span className="font-medium">{securityLayers.length}</span>
                  </div>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-2">
                <h4 className="font-medium">Blockchains:</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedChains.map(chain => (
                    <Badge key={chain} variant="outline" className={
                      chain === primaryChain 
                        ? 'bg-green-900/40 text-green-300 border-green-600/30'
                        : 'bg-gray-800'
                    }>
                      {chain.charAt(0).toUpperCase() + chain.slice(1)}
                      {chain === primaryChain && ' (Primary)'}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2 mt-4">
                <h4 className="font-medium">Security Layers:</h4>
                <div className="flex flex-wrap gap-2">
                  {securityLayers.map(layer => (
                    <Badge key={layer} variant="outline" className="bg-purple-900/40 text-purple-300 border-purple-600/30">
                      {layer.charAt(0).toUpperCase() + layer.slice(1).replace(/([A-Z])/g, ' $1')}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2 mt-4">
                <h4 className="font-medium">Recovery Methods:</h4>
                <div className="flex flex-wrap gap-2">
                  {recoveryMethods.map(method => (
                    <Badge key={method} variant="outline" className="bg-blue-900/40 text-blue-300 border-blue-600/30">
                      {method.charAt(0).toUpperCase() + method.slice(1).replace(/([A-Z])/g, ' $1')}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {(emergencyProtocolEnabled || postQuantumEnabled || hardware.enabled || biometric.enabled) && (
                <div className="space-y-2 mt-4">
                  <h4 className="font-medium">Advanced Protections:</h4>
                  <div className="space-y-1">
                    {emergencyProtocolEnabled && (
                      <div className="flex justify-between text-sm">
                        <span>Emergency Protocol:</span>
                        <span>{emergencyResponses.length} response types</span>
                      </div>
                    )}
                    {postQuantumEnabled && (
                      <div className="flex justify-between text-sm">
                        <span>Post-Quantum Security:</span>
                        <span>{quantumAlgorithm}</span>
                      </div>
                    )}
                    {hardware.enabled && (
                      <div className="flex justify-between text-sm">
                        <span>Hardware Security:</span>
                        <span>{hardware.type}</span>
                      </div>
                    )}
                    {biometric.enabled && (
                      <div className="flex justify-between text-sm">
                        <span>Biometric Security:</span>
                        <span>{biometric.type}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-2">Deployment Information</h3>
              <div className="text-sm space-y-4">
                <p className="text-gray-400">
                  Your Unique Security Vault will be deployed to {selectedChains.length} blockchain{selectedChains.length > 1 ? 's' : ''} with {securityLayers.length} security layer{securityLayers.length > 1 ? 's' : ''}.
                </p>
                <div className="space-y-1">
                  <p className="text-gray-400">This vault includes enhanced protections:</p>
                  <ul className="list-disc list-inside space-y-1 pl-2">
                    {securityLayers.includes('quantum') && <li className="text-gray-400">Quantum-Resistant Encryption</li>}
                    {securityLayers.includes('zkp') && <li className="text-gray-400">Zero-Knowledge Privacy</li>}
                    {securityLayers.includes('timelock') && <li className="text-gray-400">Time-Locked Access Controls</li>}
                    {securityLayers.includes('mpc') && <li className="text-gray-400">Multi-Party Computation</li>}
                    {keyRotationEnabled && <li className="text-gray-400">Automatic Key Rotation</li>}
                    {customRecoveryEnabled && <li className="text-gray-400">Advanced Recovery Mechanism</li>}
                  </ul>
                </div>
                <p className="text-gray-400 italic">
                  By creating this vault, you agree to the terms and conditions of Chronos Vault platform.
                </p>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  // Main component render
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex flex-col items-center mb-8">
        <div className="h-14 w-14 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-900/30 mb-4">
          <Shield className="h-7 w-7 text-white" />
        </div>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
          Unique Security Vault
        </h1>
        <p className="text-gray-400 mt-2 text-center max-w-2xl">
          Create an ultra-secure vault with state-of-the-art protection mechanisms, quantum-resistant encryption, and customizable recovery options.
        </p>
      </div>
      
      <div className="mb-8">
        <Progress value={progress} className="h-2 bg-gray-700" />
        <div className="flex justify-between mt-2 text-xs text-gray-400">
          <span>Basic Setup</span>
          <span>Security</span>
          <span>Access</span>
          <span>Recovery</span>
          <span>Advanced</span>
          <span>Review</span>
        </div>
      </div>
      
      {isSuccess ? (
        <Card className="w-full bg-gray-800/50 border-green-500/30">
          <CardHeader className="pb-2">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
            <CardTitle className="text-center text-2xl">Vault Successfully Created!</CardTitle>
            <CardDescription className="text-center">
              Your Unique Security Vault is being deployed to the blockchain
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-900/50 p-4 rounded-lg">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Vault ID:</span>
                <span className="font-mono">{vaultId}</span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-gray-400">Security Score:</span>
                <span className={`
                  ${securityScore >= 90 ? 'text-green-400' : 
                    securityScore >= 70 ? 'text-blue-400' : 
                    securityScore >= 50 ? 'text-yellow-400' : 
                    'text-red-400'}
                `}>
                  {securityScore}/100
                </span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-gray-400">Status:</span>
                <span className="text-green-400">Deploying</span>
              </div>
            </div>
            <p className="text-center text-gray-400">
              You will be redirected to your dashboard in a moment...
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="w-full border-purple-500/20 bg-gradient-to-b from-gray-800/90 to-gray-900/90 backdrop-blur-sm shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">Create Your Unique Security Vault</CardTitle>
            <CardDescription>
              Configure advanced security protocols to create the ultimate secure vault for your blockchain assets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-6 w-full">
                <TabsTrigger value="basic">
                  <span className="hidden sm:inline">Basic</span>
                  <span className="sm:hidden">1</span>
                </TabsTrigger>
                <TabsTrigger value="blockchain">
                  <span className="hidden sm:inline">Security</span>
                  <span className="sm:hidden">2</span>
                </TabsTrigger>
                <TabsTrigger value="access">
                  <span className="hidden sm:inline">Access</span>
                  <span className="sm:hidden">3</span>
                </TabsTrigger>
                <TabsTrigger value="recovery">
                  <span className="hidden sm:inline">Recovery</span>
                  <span className="sm:hidden">4</span>
                </TabsTrigger>
                <TabsTrigger value="advanced">
                  <span className="hidden sm:inline">Advanced</span>
                  <span className="sm:hidden">5</span>
                </TabsTrigger>
                <TabsTrigger value="review">
                  <span className="hidden sm:inline">Review</span>
                  <span className="sm:hidden">6</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value={activeTab}>
                {renderTabContent()}
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="w-full sm:w-auto order-2 sm:order-1">
              <Button 
                variant="outline" 
                onClick={() => {
                  const tabOrder = ["basic", "blockchain", "access", "recovery", "advanced", "review"];
                  const currentIndex = tabOrder.indexOf(activeTab);
                  if (currentIndex > 0) {
                    setActiveTab(tabOrder[currentIndex - 1]);
                  }
                }}
                disabled={activeTab === "basic" || isLoading}
                className="w-full sm:w-auto"
              >
                Previous
              </Button>
            </div>
            <div className="w-full sm:w-auto order-1 sm:order-2 space-x-2 flex">
              {activeTab !== "review" ? (
                <Button 
                  onClick={() => {
                    const tabOrder = ["basic", "blockchain", "access", "recovery", "advanced", "review"];
                    const currentIndex = tabOrder.indexOf(activeTab);
                    if (currentIndex < tabOrder.length - 1) {
                      setActiveTab(tabOrder[currentIndex + 1]);
                    }
                  }}
                  disabled={isLoading}
                  className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  Next <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              ) : (
                <Button 
                  onClick={handleCreateVault} 
                  disabled={isLoading}
                  className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  {isDeploying ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Deploying... {deploymentProgress}%
                    </>
                  ) : (
                    'Create Vault'
                  )}
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}

export default UniqueSecurityVault;