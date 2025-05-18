import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  ArrowRight,
  Plus,
  Trash2,
  Edit,
  Save,
  ArrowUpDown,
  Activity,
  XCircle,
  Check,
  BarChart3,
  Layers,
  Shield,
  Gauge,
  Calendar,
  Clock,
  ChartLine,
  Zap,
  Settings2,
  Workflow
} from 'lucide-react';

// Interfaces
interface DynamicRule {
  id: string;
  type: 'timeCondition' | 'marketCondition' | 'securityLevel' | 'userActivity' | 'networkState' | 'custom';
  name: string;
  condition: string;
  value: string | number;
  action: 'increaseSecurityLevel' | 'decreaseSecurityLevel' | 'notifyUser' | 'freezeAssets' | 'adjustAccessRules' | 'customLogic';
  actionValue?: string | number;
  priority: 'high' | 'medium' | 'low';
  isActive: boolean;
}

interface SecurityLevel {
  id: string;
  name: string;
  description: string;
  requirementCount: number;
  requirements: Array<{
    type: 'keyCount' | 'verification' | 'timeDelay' | 'approval' | 'passwordLength';
    value: number | string;
  }>;
}

interface BlockchainSettings {
  chain: 'ethereum' | 'ton' | 'solana' | 'bitcoin';
  settings: {
    recoveryEnabled: boolean;
    confirmationsRequired: number;
    fallbackChains: Array<'ethereum' | 'ton' | 'solana' | 'bitcoin'>;
    customVerification?: string;
  };
}

// Component
const DynamicVaultForm: React.FC = () => {
  const { toast } = useToast();
  const [currentTab, setCurrentTab] = useState('basics');
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentProgress, setDeploymentProgress] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [vaultId, setVaultId] = useState('');
  
  // Basic vault details
  const [vaultName, setVaultName] = useState('My Dynamic Vault');
  const [vaultDescription, setVaultDescription] = useState('');
  const [defaultSecurityLevel, setDefaultSecurityLevel] = useState<string>('standard');
  const [adaptationSpeed, setAdaptationSpeed] = useState<number>(50);
  const [enableRealTimeMonitoring, setEnableRealTimeMonitoring] = useState<boolean>(true);
  const [allowOwnerOverride, setAllowOwnerOverride] = useState<boolean>(true);
  
  // Dynamic rules
  const [rules, setRules] = useState<DynamicRule[]>([
    {
      id: `rule-${Date.now()}`,
      type: 'timeCondition',
      name: 'After Hours Protection',
      condition: 'time is between',
      value: '22:00-06:00',
      action: 'increaseSecurityLevel',
      actionValue: 'high',
      priority: 'medium',
      isActive: true
    }
  ]);
  const [selectedRuleId, setSelectedRuleId] = useState<string | null>(rules[0]?.id || null);
  
  // Security Levels
  const [securityLevels, setSecurityLevels] = useState<SecurityLevel[]>([
    {
      id: 'standard',
      name: 'Standard',
      description: 'Basic security for everyday operations',
      requirementCount: 1,
      requirements: [
        { type: 'keyCount', value: 1 }
      ]
    },
    {
      id: 'enhanced',
      name: 'Enhanced',
      description: 'Added protection for sensitive operations',
      requirementCount: 2,
      requirements: [
        { type: 'keyCount', value: 1 },
        { type: 'timeDelay', value: 30 }
      ]
    },
    {
      id: 'maximum',
      name: 'Maximum',
      description: 'Highest security for critical assets',
      requirementCount: 3,
      requirements: [
        { type: 'keyCount', value: 2 },
        { type: 'timeDelay', value: 60 },
        { type: 'verification', value: 'authenticator' }
      ]
    }
  ]);
  const [selectedSecurityLevelId, setSelectedSecurityLevelId] = useState<string | null>('standard');
  
  // Blockchain settings
  const [blockchainSettings, setBlockchainSettings] = useState<BlockchainSettings[]>([
    {
      chain: 'ton',
      settings: {
        recoveryEnabled: true,
        confirmationsRequired: 3,
        fallbackChains: ['ethereum'],
        customVerification: undefined
      }
    },
    {
      chain: 'ethereum',
      settings: {
        recoveryEnabled: true,
        confirmationsRequired: 12,
        fallbackChains: [],
        customVerification: undefined
      }
    }
  ]);
  const [selectedChain, setSelectedChain] = useState<'ethereum' | 'ton' | 'solana' | 'bitcoin'>('ton');
  
  // Alert settings
  const [alertThresholds, setAlertThresholds] = useState({
    securityLevelChange: true,
    unusualActivity: true,
    ruleActivation: true,
    multipleFailedAttempts: true,
    notificationType: 'email'
  });
  
  // Performance metrics
  const [performanceScores, setPerformanceScores] = useState({
    adaptability: 0,
    efficiency: 0,
    securityRating: 0,
    ruleOptimization: 0
  });
  
  // Calculate performance scores
  useEffect(() => {
    // Calculate adaptability score
    const adaptabilityBase = 50;
    const ruleBonus = Math.min(rules.length * 5, 25);
    const adaptationBonus = adaptationSpeed / 2;
    
    // Calculate efficiency
    const efficiencyBase = 60;
    const overheadPenalty = rules.filter(r => r.priority === 'high').length * 5;
    
    // Calculate security rating
    const securityBase = 40;
    const levelBonus = 
      defaultSecurityLevel === 'standard' ? 0 :
      defaultSecurityLevel === 'enhanced' ? 20 :
      defaultSecurityLevel === 'maximum' ? 40 : 0;
    const monitoringBonus = enableRealTimeMonitoring ? 15 : 0;
    
    // Calculate rule optimization
    const ruleOptBase = 50;
    const activeRulesRatio = rules.filter(r => r.isActive).length / Math.max(rules.length, 1);
    const priorityBalance = 
      (rules.filter(r => r.priority === 'high').length / Math.max(rules.length, 1)) * 0.4 +
      (rules.filter(r => r.priority === 'medium').length / Math.max(rules.length, 1)) * 0.4 +
      (rules.filter(r => r.priority === 'low').length / Math.max(rules.length, 1)) * 0.2;
    
    setPerformanceScores({
      adaptability: Math.min(Math.round(adaptabilityBase + ruleBonus + adaptationBonus), 100),
      efficiency: Math.min(Math.round(efficiencyBase - overheadPenalty + (adaptationSpeed * 0.2)), 100),
      securityRating: Math.min(Math.round(securityBase + levelBonus + monitoringBonus), 100),
      ruleOptimization: Math.min(Math.round(ruleOptBase + (activeRulesRatio * 25) + (priorityBalance * 25)), 100)
    });
  }, [rules, defaultSecurityLevel, adaptationSpeed, enableRealTimeMonitoring]);
  
  // Helper functions
  const getSelectedRule = () => rules.find(r => r.id === selectedRuleId) || null;
  const getSelectedSecurityLevel = () => securityLevels.find(level => level.id === selectedSecurityLevelId) || null;
  const getSelectedBlockchainSettings = () => blockchainSettings.find(bs => bs.chain === selectedChain) || null;
  
  // Rule operations
  const addRule = () => {
    const newRule: DynamicRule = {
      id: `rule-${Date.now()}`,
      type: 'timeCondition',
      name: `Rule ${rules.length + 1}`,
      condition: 'time is between',
      value: '09:00-17:00',
      action: 'adjustAccessRules',
      actionValue: 'standard',
      priority: 'medium',
      isActive: true
    };
    
    setRules([...rules, newRule]);
    setSelectedRuleId(newRule.id);
    setCurrentTab('rules');
  };
  
  const updateRule = (id: string, updates: Partial<DynamicRule>) => {
    setRules(rules.map(rule => 
      rule.id === id ? { ...rule, ...updates } : rule
    ));
  };
  
  const deleteRule = (id: string) => {
    if (rules.length <= 1) {
      toast({
        title: "Cannot delete rule",
        description: "You need at least one rule defined",
        variant: "destructive"
      });
      return;
    }
    
    setRules(rules.filter(rule => rule.id !== id));
    
    if (selectedRuleId === id) {
      setSelectedRuleId(rules.find(r => r.id !== id)?.id || null);
    }
  };
  
  // Security level operations
  const addSecurityLevel = () => {
    const newLevel: SecurityLevel = {
      id: `level-${Date.now()}`,
      name: `Level ${securityLevels.length + 1}`,
      description: 'Custom security level',
      requirementCount: 1,
      requirements: [
        { type: 'keyCount', value: 1 }
      ]
    };
    
    setSecurityLevels([...securityLevels, newLevel]);
    setSelectedSecurityLevelId(newLevel.id);
  };
  
  const updateSecurityLevel = (id: string, updates: Partial<SecurityLevel>) => {
    setSecurityLevels(securityLevels.map(level => 
      level.id === id ? { ...level, ...updates } : level
    ));
  };
  
  const deleteSecurityLevel = (id: string) => {
    // Don't allow deleting built-in levels
    if (['standard', 'enhanced', 'maximum'].includes(id)) {
      toast({
        title: "Cannot delete built-in level",
        description: "This is a system-defined security level",
        variant: "destructive"
      });
      return;
    }
    
    // Check if this level is used in any rules
    const usedInRules = rules.some(rule => 
      (rule.action === 'increaseSecurityLevel' || rule.action === 'decreaseSecurityLevel') && 
      rule.actionValue === id
    );
    
    if (usedInRules) {
      toast({
        title: "Cannot delete level",
        description: "This level is used in one or more rules",
        variant: "destructive"
      });
      return;
    }
    
    // If this is the default level, reset the default
    if (defaultSecurityLevel === id) {
      setDefaultSecurityLevel('standard');
    }
    
    setSecurityLevels(securityLevels.filter(level => level.id !== id));
    
    if (selectedSecurityLevelId === id) {
      setSelectedSecurityLevelId('standard');
    }
  };
  
  const addRequirement = (levelId: string) => {
    const level = securityLevels.find(l => l.id === levelId);
    if (!level) return;
    
    const updatedLevel = {
      ...level,
      requirementCount: level.requirementCount + 1,
      requirements: [
        ...level.requirements,
        { type: 'verification', value: 'email' }
      ]
    };
    
    updateSecurityLevel(levelId, updatedLevel);
  };
  
  const updateRequirement = (levelId: string, index: number, updates: Partial<{ type: string, value: any }>) => {
    const level = securityLevels.find(l => l.id === levelId);
    if (!level) return;
    
    const updatedRequirements = [...level.requirements];
    updatedRequirements[index] = {
      ...updatedRequirements[index],
      ...updates
    };
    
    updateSecurityLevel(levelId, { requirements: updatedRequirements });
  };
  
  const removeRequirement = (levelId: string, index: number) => {
    const level = securityLevels.find(l => l.id === levelId);
    if (!level || level.requirements.length <= 1) return;
    
    const updatedRequirements = level.requirements.filter((_, i) => i !== index);
    updateSecurityLevel(levelId, { 
      requirements: updatedRequirements,
      requirementCount: level.requirementCount - 1
    });
  };
  
  // Blockchain operations
  const addBlockchain = (chain: 'ethereum' | 'ton' | 'solana' | 'bitcoin') => {
    // Check if this chain already exists
    if (blockchainSettings.some(bs => bs.chain === chain)) {
      toast({
        title: "Chain already added",
        description: `${chain.toUpperCase()} is already configured`,
        variant: "destructive"
      });
      return;
    }
    
    const newBlockchainSetting: BlockchainSettings = {
      chain,
      settings: {
        recoveryEnabled: true,
        confirmationsRequired: 
          chain === 'ethereum' ? 12 :
          chain === 'ton' ? 3 :
          chain === 'solana' ? 32 :
          chain === 'bitcoin' ? 6 : 1,
        fallbackChains: []
      }
    };
    
    setBlockchainSettings([...blockchainSettings, newBlockchainSetting]);
    setSelectedChain(chain);
  };
  
  const updateBlockchainSetting = (chain: string, updates: Partial<BlockchainSettings['settings']>) => {
    setBlockchainSettings(blockchainSettings.map(bs => 
      bs.chain === chain ? { ...bs, settings: { ...bs.settings, ...updates } } : bs
    ));
  };
  
  const removeBlockchain = (chain: string) => {
    // Don't allow removing if it's the only chain
    if (blockchainSettings.length <= 1) {
      toast({
        title: "Cannot remove chain",
        description: "At least one blockchain must be configured",
        variant: "destructive"
      });
      return;
    }
    
    // If removing the selected chain, select another one
    if (selectedChain === chain) {
      const anotherChain = blockchainSettings.find(bs => bs.chain !== chain)?.chain;
      if (anotherChain) {
        setSelectedChain(anotherChain as any);
      }
    }
    
    // Remove any fallback references to this chain
    const updatedSettings = blockchainSettings.map(bs => ({
      ...bs,
      settings: {
        ...bs.settings,
        fallbackChains: bs.settings.fallbackChains.filter(fc => fc !== chain)
      }
    }));
    
    setBlockchainSettings(updatedSettings.filter(bs => bs.chain !== chain));
  };
  
  const toggleFallbackChain = (primaryChain: string, fallbackChain: 'ethereum' | 'ton' | 'solana' | 'bitcoin') => {
    const chainSetting = blockchainSettings.find(bs => bs.chain === primaryChain);
    if (!chainSetting) return;
    
    let updatedFallbacks: Array<'ethereum' | 'ton' | 'solana' | 'bitcoin'>;
    
    if (chainSetting.settings.fallbackChains.includes(fallbackChain)) {
      // Remove it
      updatedFallbacks = chainSetting.settings.fallbackChains.filter(fc => fc !== fallbackChain);
    } else {
      // Add it
      updatedFallbacks = [...chainSetting.settings.fallbackChains, fallbackChain];
    }
    
    updateBlockchainSetting(primaryChain, { fallbackChains: updatedFallbacks });
  };
  
  // Deploy vault
  const deployVault = () => {
    if (!validateForm()) return;
    
    setIsDeploying(true);
    setDeploymentProgress(0);
    
    const interval = setInterval(() => {
      setDeploymentProgress(prev => {
        const newProgress = prev + Math.floor(Math.random() * 5) + 1;
        
        if (newProgress >= 100) {
          clearInterval(interval);
          setIsDeploying(false);
          setIsSuccess(true);
          
          // Generate a random vault ID
          const id = `dynamic-${Math.random().toString(36).substring(2, 10)}`;
          setVaultId(id);
          
          toast({
            title: "Vault Deployed Successfully",
            description: "Your dynamic vault is now live and will adapt based on your rules",
          });
          
          return 100;
        }
        
        return newProgress;
      });
    }, 120);
  };
  
  // Form validation
  const validateForm = (): boolean => {
    if (!vaultName.trim()) {
      toast({
        title: "Vault name required",
        description: "Please provide a name for your vault",
        variant: "destructive"
      });
      return false;
    }
    
    if (rules.length === 0) {
      toast({
        title: "No rules defined",
        description: "Your dynamic vault needs at least one rule",
        variant: "destructive"
      });
      return false;
    }
    
    if (blockchainSettings.length === 0) {
      toast({
        title: "No blockchain configured",
        description: "Please configure at least one blockchain",
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };
  
  // Render helpers
  const getRuleTypeIcon = (type: string) => {
    switch(type) {
      case 'timeCondition': return <Clock className="h-5 w-5" />;
      case 'marketCondition': return <ChartLine className="h-5 w-5" />;
      case 'securityLevel': return <Shield className="h-5 w-5" />;
      case 'userActivity': return <Activity className="h-5 w-5" />;
      case 'networkState': return <Zap className="h-5 w-5" />;
      case 'custom': return <Settings2 className="h-5 w-5" />;
      default: return <Workflow className="h-5 w-5" />;
    }
  };
  
  const getActionDescription = (action: string, value?: string | number) => {
    switch(action) {
      case 'increaseSecurityLevel': 
        return `Increase security to ${value || 'higher level'}`;
      case 'decreaseSecurityLevel': 
        return `Decrease security to ${value || 'lower level'}`;
      case 'notifyUser': 
        return 'Send notification to user';
      case 'freezeAssets': 
        return 'Temporarily freeze assets';
      case 'adjustAccessRules': 
        return `Adjust access requirements to ${value || 'specified level'}`;
      case 'customLogic': 
        return 'Execute custom logic';
      default: 
        return 'Perform action';
    }
  };
  
  const getChainIcon = (chain: string) => {
    switch(chain) {
      case 'ethereum': return '₿';
      case 'solana': return '◎';
      case 'ton': return '💎';
      case 'bitcoin': return '₿';
      default: return '🔗';
    }
  };
  
  const getSecurityRequirementDescription = (type: string, value: string | number) => {
    switch(type) {
      case 'keyCount': 
        return `${value} key${parseInt(value.toString()) !== 1 ? 's' : ''} required`;
      case 'verification': 
        return `${value} verification`;
      case 'timeDelay': 
        return `${value} minute delay`;
      case 'approval': 
        return `${value} approval required`;
      case 'passwordLength': 
        return `Password min length: ${value}`;
      default: 
        return `${type}: ${value}`;
    }
  };
  
  // Success state
  if (isSuccess) {
    return (
      <div className="container mx-auto px-4 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-[#FF5151]/20 mb-8">
            <Activity className="h-12 w-12 text-[#FF5151]" />
          </div>
          
          <h1 className="text-3xl font-bold mb-4">Dynamic Vault Deployed!</h1>
          <p className="text-xl text-gray-300 mb-8">
            Your dynamic security vault is now live and ready to adapt to changing conditions with {rules.length} active rules.
          </p>
          
          <Card className="bg-[#151515] border-[#333] mb-8">
            <CardHeader>
              <CardTitle>Vault Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between bg-[#1A1A1A] p-3 rounded-md mb-4">
                <div className="font-mono text-sm text-gray-300">{vaultId}</div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    navigator.clipboard.writeText(vaultId);
                    toast({
                      title: "Vault ID copied",
                      description: "Vault ID copied to clipboard",
                    });
                  }}
                  className="text-[#FF5151] hover:text-[#FF7171] hover:bg-[#FF5151]/10"
                >
                  Copy ID
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Default Security</p>
                  <p className="text-white font-medium">
                    {securityLevels.find(l => l.id === defaultSecurityLevel)?.name || 'Standard'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Primary Blockchain</p>
                  <p className="text-white font-medium">
                    {blockchainSettings[0]?.chain.toUpperCase() || 'TON'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Adaptability Score</p>
                  <p className="text-white font-medium">{performanceScores.adaptability}/100</p>
                </div>
                <div>
                  <p className="text-gray-500">Security Rating</p>
                  <p className="text-white font-medium">{performanceScores.securityRating}/100</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center">
            <Link href="/dashboard">
              <Button 
                className="bg-gradient-to-r from-[#FF5151] to-[#FF9B51] hover:from-[#FF7171] hover:to-[#FFBB71] text-white px-8 py-6 h-auto text-lg rounded-xl shadow-lg"
              >
                Go to Dashboard
              </Button>
            </Link>
            <Button 
              variant="outline"
              className="border-[#FF5151]/50 text-[#FF5151] hover:bg-[#FF5151]/10"
              onClick={() => {
                setIsSuccess(false);
                setVaultName('My Dynamic Vault');
                setVaultDescription('');
                setDeploymentProgress(0);
                setVaultId('');
                setCurrentTab('basics');
              }}
            >
              Create Another Vault
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <Link href="/vault-types">
          <Button variant="ghost" className="mb-4 hover:bg-[#FF5151]/10">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Vault Types
          </Button>
        </Link>

        <div className="flex items-center mb-4">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#FF5151] to-[#FF9B51] flex items-center justify-center shadow-lg shadow-[#FF5151]/30 mr-4">
            <Activity className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#FF5151] to-[#FF9B51]">
            Dynamic Security Vault
          </h1>
        </div>
        
        <p className="text-lg text-gray-300 max-w-3xl">
          Create a self-adapting vault that dynamically adjusts its security parameters based on real-time conditions, activity patterns, and threat levels.
        </p>
        
        <div className="flex flex-wrap gap-3 mt-4">
          <Badge variant="secondary" className="bg-[#FF5151]/20 text-[#FF5151] border-[#FF5151]/50">
            <Activity className="h-3 w-3 mr-1" /> Adaptive Security
          </Badge>
          <Badge variant="secondary" className="bg-[#FF9B51]/20 text-[#FF9B51] border-[#FF9B51]/50">
            <BarChart3 className="h-3 w-3 mr-1" /> Behavioral Analysis
          </Badge>
          <Badge variant="secondary" className="bg-[#FF7151]/20 text-[#FF7151] border-[#FF7151]/50">
            <Shield className="h-3 w-3 mr-1" /> Real-Time Protection
          </Badge>
        </div>
      </div>
      
      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Vault Setup */}
        <div className="lg:col-span-2">
          <Tabs 
            value={currentTab} 
            onValueChange={setCurrentTab}
            className="bg-black/30 backdrop-blur-sm rounded-xl border border-gray-800 p-6"
          >
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value="basics" className="data-[state=active]:bg-[#FF5151]/30">
                <div className="flex flex-col items-center py-1">
                  <Layers className="h-5 w-5 mb-1" />
                  <span>Basics</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="rules" className="data-[state=active]:bg-[#FF7151]/30">
                <div className="flex flex-col items-center py-1">
                  <Workflow className="h-5 w-5 mb-1" />
                  <span>Rules</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="security" className="data-[state=active]:bg-[#FF9B51]/30">
                <div className="flex flex-col items-center py-1">
                  <Shield className="h-5 w-5 mb-1" />
                  <span>Security</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="blockchain" className="data-[state=active]:bg-[#FFC151]/30">
                <div className="flex flex-col items-center py-1">
                  <Layers className="h-5 w-5 mb-1" />
                  <span>Blockchain</span>
                </div>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="basics" className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Basic Configuration</h2>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="vault-name">Vault Name</Label>
                    <Input 
                      id="vault-name"
                      value={vaultName}
                      onChange={(e) => setVaultName(e.target.value)}
                      className="bg-black/30 border-gray-700"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="vault-description">Description (Optional)</Label>
                    <Textarea
                      id="vault-description"
                      value={vaultDescription}
                      onChange={(e) => setVaultDescription(e.target.value)}
                      className="bg-black/30 border-gray-700 min-h-[100px]"
                      placeholder="Describe the purpose of this dynamic vault"
                    />
                  </div>
                </div>
                
                <Separator className="my-6 bg-gray-800" />
                
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Default Security Level</h2>
                  <p className="text-sm text-gray-400">
                    Choose the base security level for your vault when no rules are active
                  </p>
                  
                  <RadioGroup 
                    value={defaultSecurityLevel} 
                    onValueChange={setDefaultSecurityLevel}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2"
                  >
                    {securityLevels.map(level => (
                      <div 
                        key={level.id}
                        className="flex items-center space-x-2 border border-gray-800 rounded-lg p-3 hover:bg-[#FF5151]/5 cursor-pointer"
                      >
                        <RadioGroupItem value={level.id} id={`level-${level.id}`} className="text-[#FF5151]" />
                        <Label htmlFor={`level-${level.id}`} className="cursor-pointer flex-1">
                          <div className="flex flex-col">
                            <span className="font-medium">{level.name}</span>
                            <span className="text-xs text-gray-400">{level.description}</span>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                
                <Separator className="my-6 bg-gray-800" />
                
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Adaptation Settings</h2>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="adaptation-speed">Adaptation Speed</Label>
                      <span>{adaptationSpeed}%</span>
                    </div>
                    <Slider
                      id="adaptation-speed"
                      min={0}
                      max={100}
                      step={5}
                      value={[adaptationSpeed]}
                      onValueChange={(value) => setAdaptationSpeed(value[0])}
                      className="[&>span]:bg-[#FF5151]"
                    />
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Slower, more gradual</span>
                      <span>Faster, immediate</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between border-b border-gray-800 py-4">
                    <div>
                      <Label htmlFor="enable-monitoring" className="cursor-pointer font-medium">
                        Real-Time Condition Monitoring
                      </Label>
                      <p className="text-sm text-gray-400">
                        Continuously monitor conditions for rule evaluation
                      </p>
                    </div>
                    <Switch 
                      id="enable-monitoring"
                      checked={enableRealTimeMonitoring}
                      onCheckedChange={setEnableRealTimeMonitoring}
                      className="data-[state=checked]:bg-[#FF5151]"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between pt-4">
                    <div>
                      <Label htmlFor="owner-override" className="cursor-pointer font-medium">
                        Owner Override
                      </Label>
                      <p className="text-sm text-gray-400">
                        Allow owner to manually override security levels
                      </p>
                    </div>
                    <Switch 
                      id="owner-override"
                      checked={allowOwnerOverride}
                      onCheckedChange={setAllowOwnerOverride}
                      className="data-[state=checked]:bg-[#FF5151]"
                    />
                  </div>
                </div>
              </div>
              
              <div className="pt-4 flex justify-end">
                <Button 
                  onClick={() => setCurrentTab('rules')}
                  className="bg-[#FF5151] hover:bg-[#FF7171] text-white"
                >
                  Continue to Rules
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="rules" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Rules List */}
                <div className="lg:col-span-1 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Dynamic Rules</h2>
                  </div>
                  
                  <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                    {rules.map(rule => (
                      <div 
                        key={rule.id}
                        className={`flex items-center space-x-3 p-3 rounded-md cursor-pointer transition-colors ${
                          selectedRuleId === rule.id 
                            ? 'bg-[#FF5151]/20 border border-[#FF5151]/40' 
                            : 'bg-black/20 border border-gray-800 hover:border-gray-700'
                        }`}
                        onClick={() => setSelectedRuleId(rule.id)}
                      >
                        <div className="bg-black/30 h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0">
                          {getRuleTypeIcon(rule.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{rule.name}</p>
                          <div className="flex items-center text-xs text-gray-400">
                            <span className="truncate">{getActionDescription(rule.action, rule.actionValue)}</span>
                            {!rule.isActive && (
                              <Badge variant="outline" className="ml-2 text-gray-500 border-gray-500 px-1.5 py-0">
                                Disabled
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full border-dashed flex items-center justify-center space-x-2 hover:bg-[#FF5151]/5 hover:border-[#FF5151]/30 border-gray-700"
                    onClick={addRule}
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Rule</span>
                  </Button>
                </div>
                
                {/* Rule Editor */}
                <div className="lg:col-span-2 space-y-4">
                  {selectedRuleId ? (
                    <>
                      <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Rule Configuration</h2>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteRule(selectedRuleId)}
                          className="h-8 w-8 text-red-500 hover:text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {getSelectedRule() && (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="rule-name">Rule Name</Label>
                            <Input 
                              id="rule-name"
                              value={getSelectedRule()!.name}
                              onChange={(e) => updateRule(selectedRuleId, { name: e.target.value })}
                              className="bg-black/30 border-gray-700"
                            />
                          </div>
                          
                          <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                            <div>
                              <Label htmlFor="rule-active" className="cursor-pointer font-medium">
                                Rule Status
                              </Label>
                              <p className="text-sm text-gray-400">
                                Enable or disable this rule
                              </p>
                            </div>
                            <Switch 
                              id="rule-active"
                              checked={getSelectedRule()!.isActive}
                              onCheckedChange={(isActive) => updateRule(selectedRuleId, { isActive })}
                              className="data-[state=checked]:bg-[#FF5151]"
                            />
                          </div>
                          
                          <div className="space-y-3">
                            <Label>Rule Type</Label>
                            <RadioGroup 
                              value={getSelectedRule()!.type} 
                              onValueChange={(value) => updateRule(selectedRuleId, { 
                                type: value as DynamicRule['type'] 
                              })}
                              className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2"
                            >
                              {[
                                { id: 'timeCondition', name: 'Time Condition', description: 'Based on time of day or day of week' },
                                { id: 'marketCondition', name: 'Market Condition', description: 'Based on market data and fluctuations' },
                                { id: 'securityLevel', name: 'Security Condition', description: 'Based on current security status' },
                                { id: 'userActivity', name: 'User Activity', description: 'Based on user behavior patterns' },
                                { id: 'networkState', name: 'Network State', description: 'Based on blockchain network status' },
                                { id: 'custom', name: 'Custom Logic', description: 'Custom-defined condition' },
                              ].map(type => (
                                <div 
                                  key={type.id}
                                  className="flex items-center space-x-2 border border-gray-800 rounded-lg p-3 hover:bg-[#FF5151]/5 cursor-pointer"
                                >
                                  <RadioGroupItem 
                                    value={type.id} 
                                    id={`type-${type.id}`} 
                                    className="text-[#FF5151]" 
                                  />
                                  <Label htmlFor={`type-${type.id}`} className="cursor-pointer flex-1">
                                    <div className="flex items-center">
                                      <div className="mr-2">
                                        {getRuleTypeIcon(type.id)}
                                      </div>
                                      <div className="flex flex-col">
                                        <span className="font-medium">{type.name}</span>
                                        <span className="text-xs text-gray-400">{type.description}</span>
                                      </div>
                                    </div>
                                  </Label>
                                </div>
                              ))}
                            </RadioGroup>
                          </div>
                          
                          <Separator className="my-4 bg-gray-800" />
                          
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Condition</Label>
                                <Select 
                                  value={getSelectedRule()!.condition} 
                                  onValueChange={(value) => updateRule(selectedRuleId, { condition: value })}
                                >
                                  <SelectTrigger className="bg-black/30 border-gray-700">
                                    <SelectValue placeholder="Select condition" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {getSelectedRule()!.type === 'timeCondition' && (
                                      <>
                                        <SelectItem value="time is between">Time is between</SelectItem>
                                        <SelectItem value="day is">Day is</SelectItem>
                                        <SelectItem value="after date">After date</SelectItem>
                                      </>
                                    )}
                                    {getSelectedRule()!.type === 'marketCondition' && (
                                      <>
                                        <SelectItem value="price drops below">Price drops below</SelectItem>
                                        <SelectItem value="price increases above">Price increases above</SelectItem>
                                        <SelectItem value="volatility exceeds">Volatility exceeds</SelectItem>
                                      </>
                                    )}
                                    {getSelectedRule()!.type === 'securityLevel' && (
                                      <>
                                        <SelectItem value="threat level is">Threat level is</SelectItem>
                                        <SelectItem value="failed attempts exceed">Failed attempts exceed</SelectItem>
                                        <SelectItem value="unusual activity detected">Unusual activity detected</SelectItem>
                                      </>
                                    )}
                                    {getSelectedRule()!.type === 'userActivity' && (
                                      <>
                                        <SelectItem value="login from new location">Login from new location</SelectItem>
                                        <SelectItem value="login at unusual time">Login at unusual time</SelectItem>
                                        <SelectItem value="transaction volume exceeds">Transaction volume exceeds</SelectItem>
                                      </>
                                    )}
                                    {getSelectedRule()!.type === 'networkState' && (
                                      <>
                                        <SelectItem value="network congestion above">Network congestion above</SelectItem>
                                        <SelectItem value="gas prices exceed">Gas prices exceed</SelectItem>
                                        <SelectItem value="chain stability below">Chain stability below</SelectItem>
                                      </>
                                    )}
                                    {getSelectedRule()!.type === 'custom' && (
                                      <>
                                        <SelectItem value="custom condition">Custom condition</SelectItem>
                                      </>
                                    )}
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div className="space-y-2">
                                <Label>Condition Value</Label>
                                <Input 
                                  value={getSelectedRule()!.value.toString()}
                                  onChange={(e) => updateRule(selectedRuleId, { value: e.target.value })}
                                  className="bg-black/30 border-gray-700"
                                  placeholder={
                                    getSelectedRule()!.type === 'timeCondition' ? "e.g., 22:00-06:00" :
                                    getSelectedRule()!.type === 'marketCondition' ? "e.g., 50000" :
                                    getSelectedRule()!.type === 'securityLevel' ? "e.g., high" :
                                    getSelectedRule()!.type === 'userActivity' ? "e.g., 3" :
                                    getSelectedRule()!.type === 'networkState' ? "e.g., 80%" :
                                    "e.g., value"
                                  }
                                />
                              </div>
                            </div>
                          </div>
                          
                          <Separator className="my-4 bg-gray-800" />
                          
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Action to Take</Label>
                                <Select 
                                  value={getSelectedRule()!.action} 
                                  onValueChange={(value) => updateRule(selectedRuleId, { 
                                    action: value as DynamicRule['action']
                                  })}
                                >
                                  <SelectTrigger className="bg-black/30 border-gray-700">
                                    <SelectValue placeholder="Select action" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="increaseSecurityLevel">Increase Security Level</SelectItem>
                                    <SelectItem value="decreaseSecurityLevel">Decrease Security Level</SelectItem>
                                    <SelectItem value="notifyUser">Notify User</SelectItem>
                                    <SelectItem value="freezeAssets">Freeze Assets</SelectItem>
                                    <SelectItem value="adjustAccessRules">Adjust Access Rules</SelectItem>
                                    <SelectItem value="customLogic">Execute Custom Logic</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              {(getSelectedRule()!.action === 'increaseSecurityLevel' || 
                                getSelectedRule()!.action === 'decreaseSecurityLevel' || 
                                getSelectedRule()!.action === 'adjustAccessRules') && (
                                <div className="space-y-2">
                                  <Label>Security Level</Label>
                                  <Select 
                                    value={getSelectedRule()!.actionValue?.toString() || ''} 
                                    onValueChange={(value) => updateRule(selectedRuleId, { actionValue: value })}
                                  >
                                    <SelectTrigger className="bg-black/30 border-gray-700">
                                      <SelectValue placeholder="Select level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {securityLevels.map(level => (
                                        <SelectItem key={level.id} value={level.id}>{level.name}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              )}
                              
                              {(getSelectedRule()!.action === 'customLogic' || 
                                getSelectedRule()!.action === 'notifyUser') && (
                                <div className="space-y-2">
                                  <Label>Action Details</Label>
                                  <Input 
                                    value={getSelectedRule()!.actionValue?.toString() || ''}
                                    onChange={(e) => updateRule(selectedRuleId, { actionValue: e.target.value })}
                                    className="bg-black/30 border-gray-700"
                                    placeholder={
                                      getSelectedRule()!.action === 'customLogic' ? "Custom script name" :
                                      getSelectedRule()!.action === 'notifyUser' ? "Notification message" : ""
                                    }
                                  />
                                </div>
                              )}
                            </div>
                            
                            <div className="space-y-2">
                              <Label>Rule Priority</Label>
                              <RadioGroup 
                                value={getSelectedRule()!.priority} 
                                onValueChange={(value) => updateRule(selectedRuleId, { 
                                  priority: value as 'high' | 'medium' | 'low'
                                })}
                                className="flex space-x-4 mt-2"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="high" id="priority-high" className="text-red-500" />
                                  <Label htmlFor="priority-high" className="cursor-pointer">High</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="medium" id="priority-medium" className="text-amber-500" />
                                  <Label htmlFor="priority-medium" className="cursor-pointer">Medium</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="low" id="priority-low" className="text-green-500" />
                                  <Label htmlFor="priority-low" className="cursor-pointer">Low</Label>
                                </div>
                              </RadioGroup>
                              <p className="text-xs text-gray-400 mt-1">
                                Higher priority rules take precedence when multiple rules are activated
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-64 border border-dashed border-gray-700 rounded-md">
                      <Workflow className="h-10 w-10 text-gray-500 mb-2" />
                      <p className="text-gray-500">No rule selected</p>
                      <Button
                        variant="ghost"
                        className="mt-4 text-[#FF5151] hover:text-[#FF7171] hover:bg-[#FF5151]/10"
                        onClick={addRule}
                      >
                        Create your first rule
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="pt-4 flex justify-between">
                <Button 
                  variant="outline"
                  onClick={() => setCurrentTab('basics')}
                >
                  Back
                </Button>
                <Button 
                  onClick={() => setCurrentTab('security')}
                  className="bg-[#FF7151] hover:bg-[#FF9171] text-white"
                >
                  Continue to Security
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="security" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Security Levels List */}
                <div className="lg:col-span-1 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Security Levels</h2>
                  </div>
                  
                  <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                    {securityLevels.map(level => (
                      <div 
                        key={level.id}
                        className={`flex items-center space-x-3 p-3 rounded-md cursor-pointer transition-colors ${
                          selectedSecurityLevelId === level.id 
                            ? 'bg-[#FF9B51]/20 border border-[#FF9B51]/40' 
                            : 'bg-black/20 border border-gray-800 hover:border-gray-700'
                        }`}
                        onClick={() => setSelectedSecurityLevelId(level.id)}
                      >
                        <div className="bg-black/30 h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0">
                          <Shield className="h-5 w-5 text-[#FF9B51]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{level.name}</p>
                          <div className="flex items-center text-xs text-gray-400">
                            <span className="truncate">{level.requirementCount} requirements</span>
                            {defaultSecurityLevel === level.id && (
                              <Badge className="ml-2 bg-[#FF9B51]/20 text-[#FF9B51] px-1.5 py-0">
                                Default
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full border-dashed flex items-center justify-center space-x-2 hover:bg-[#FF9B51]/5 hover:border-[#FF9B51]/30 border-gray-700"
                    onClick={addSecurityLevel}
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Level</span>
                  </Button>
                </div>
                
                {/* Security Level Editor */}
                <div className="lg:col-span-2 space-y-4">
                  {selectedSecurityLevelId ? (
                    <>
                      <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Security Level Configuration</h2>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteSecurityLevel(selectedSecurityLevelId)}
                          className="h-8 w-8 text-red-500 hover:text-red-400 hover:bg-red-500/10"
                          disabled={['standard', 'enhanced', 'maximum'].includes(selectedSecurityLevelId)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {getSelectedSecurityLevel() && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="level-name">Level Name</Label>
                              <Input 
                                id="level-name"
                                value={getSelectedSecurityLevel()!.name}
                                onChange={(e) => updateSecurityLevel(selectedSecurityLevelId, { name: e.target.value })}
                                className="bg-black/30 border-gray-700"
                                disabled={['standard', 'enhanced', 'maximum'].includes(selectedSecurityLevelId)}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="level-description">Description</Label>
                              <Input 
                                id="level-description"
                                value={getSelectedSecurityLevel()!.description}
                                onChange={(e) => updateSecurityLevel(selectedSecurityLevelId, { description: e.target.value })}
                                className="bg-black/30 border-gray-700"
                                disabled={['standard', 'enhanced', 'maximum'].includes(selectedSecurityLevelId)}
                              />
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                            <div>
                              <Label className="font-medium">Default Level</Label>
                              <p className="text-sm text-gray-400">
                                Set as the default security level
                              </p>
                            </div>
                            <Switch 
                              checked={defaultSecurityLevel === selectedSecurityLevelId}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setDefaultSecurityLevel(selectedSecurityLevelId);
                                }
                              }}
                              className="data-[state=checked]:bg-[#FF9B51]"
                            />
                          </div>
                          
                          <Separator className="my-4 bg-gray-800" />
                          
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <h3 className="text-base font-medium">Security Requirements</h3>
                              <Badge className="bg-[#FF9B51]/20 text-[#FF9B51] border-[#FF9B51]/50 px-2">
                                {getSelectedSecurityLevel()!.requirements.length} requirements
                              </Badge>
                            </div>
                            
                            <div className="space-y-3">
                              {getSelectedSecurityLevel()!.requirements.map((req, index) => (
                                <div 
                                  key={index}
                                  className="flex items-center space-x-3 p-3 bg-black/20 border border-gray-800 rounded-md"
                                >
                                  <div className="flex-1 grid grid-cols-2 gap-2">
                                    <Select 
                                      value={req.type} 
                                      onValueChange={(value) => updateRequirement(selectedSecurityLevelId, index, { type: value })}
                                      disabled={['standard', 'enhanced', 'maximum'].includes(selectedSecurityLevelId)}
                                    >
                                      <SelectTrigger className="bg-black/30 border-gray-700 h-9">
                                        <SelectValue placeholder="Requirement type" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="keyCount">Key Count</SelectItem>
                                        <SelectItem value="verification">Verification</SelectItem>
                                        <SelectItem value="timeDelay">Time Delay</SelectItem>
                                        <SelectItem value="approval">Approvals</SelectItem>
                                        <SelectItem value="passwordLength">Password Length</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    
                                    <Input 
                                      value={req.value.toString()}
                                      onChange={(e) => updateRequirement(selectedSecurityLevelId, index, { value: e.target.value })}
                                      className="bg-black/30 border-gray-700 h-9"
                                      placeholder={
                                        req.type === 'keyCount' ? "Number of keys" :
                                        req.type === 'verification' ? "Verification type" :
                                        req.type === 'timeDelay' ? "Minutes" :
                                        req.type === 'approval' ? "Number required" :
                                        req.type === 'passwordLength' ? "Min characters" : ""
                                      }
                                      disabled={['standard', 'enhanced', 'maximum'].includes(selectedSecurityLevelId)}
                                    />
                                  </div>
                                  
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeRequirement(selectedSecurityLevelId, index)}
                                    className="h-8 w-8 text-red-500 hover:text-red-400 hover:bg-red-500/10 flex-shrink-0"
                                    disabled={
                                      ['standard', 'enhanced', 'maximum'].includes(selectedSecurityLevelId) ||
                                      getSelectedSecurityLevel()!.requirements.length <= 1
                                    }
                                  >
                                    <XCircle className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                            
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="mt-2 border-dashed border-gray-700 hover:bg-[#FF9B51]/5 hover:border-[#FF9B51]/30 w-full"
                              onClick={() => addRequirement(selectedSecurityLevelId)}
                              disabled={['standard', 'enhanced', 'maximum'].includes(selectedSecurityLevelId)}
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Add Requirement
                            </Button>
                          </div>
                          
                          <Alert className="mt-4 bg-blue-500/10 border-blue-500/30">
                            <div className="text-sm text-blue-400">
                              <p className="font-medium mb-1">Security Level Description</p>
                              <p>{getSelectedSecurityLevel()!.description}</p>
                              <ul className="mt-2 list-disc list-inside space-y-1">
                                {getSelectedSecurityLevel()!.requirements.map((req, index) => (
                                  <li key={index} className="text-xs">
                                    {getSecurityRequirementDescription(req.type, req.value)}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </Alert>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-64 border border-dashed border-gray-700 rounded-md">
                      <Shield className="h-10 w-10 text-gray-500 mb-2" />
                      <p className="text-gray-500">No security level selected</p>
                      <Button
                        variant="ghost"
                        className="mt-4 text-[#FF9B51] hover:text-[#FFBB71] hover:bg-[#FF9B51]/10"
                        onClick={() => setSelectedSecurityLevelId('standard')}
                      >
                        Select a security level
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              
              <Separator className="my-6 bg-gray-800" />
              
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Alert Settings</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="alert-security-change">Security Level Changes</Label>
                      <Switch 
                        id="alert-security-change"
                        checked={alertThresholds.securityLevelChange}
                        onCheckedChange={(checked) => setAlertThresholds({...alertThresholds, securityLevelChange: checked})}
                        className="data-[state=checked]:bg-[#FF9B51]"
                      />
                    </div>
                    <p className="text-xs text-gray-400">Alert when vault security level changes</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="alert-unusual-activity">Unusual Activity</Label>
                      <Switch 
                        id="alert-unusual-activity"
                        checked={alertThresholds.unusualActivity}
                        onCheckedChange={(checked) => setAlertThresholds({...alertThresholds, unusualActivity: checked})}
                        className="data-[state=checked]:bg-[#FF9B51]"
                      />
                    </div>
                    <p className="text-xs text-gray-400">Alert when unusual access patterns are detected</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="alert-rule-activation">Rule Activation</Label>
                      <Switch 
                        id="alert-rule-activation"
                        checked={alertThresholds.ruleActivation}
                        onCheckedChange={(checked) => setAlertThresholds({...alertThresholds, ruleActivation: checked})}
                        className="data-[state=checked]:bg-[#FF9B51]"
                      />
                    </div>
                    <p className="text-xs text-gray-400">Alert when dynamic rules are triggered</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="alert-failed-attempts">Failed Authentication</Label>
                      <Switch 
                        id="alert-failed-attempts"
                        checked={alertThresholds.multipleFailedAttempts}
                        onCheckedChange={(checked) => setAlertThresholds({...alertThresholds, multipleFailedAttempts: checked})}
                        className="data-[state=checked]:bg-[#FF9B51]"
                      />
                    </div>
                    <p className="text-xs text-gray-400">Alert after multiple failed authentication attempts</p>
                  </div>
                </div>
                
                <div className="space-y-2 mt-4">
                  <Label>Notification Method</Label>
                  <RadioGroup 
                    value={alertThresholds.notificationType} 
                    onValueChange={(value) => setAlertThresholds({...alertThresholds, notificationType: value})}
                    className="flex space-x-4 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="email" id="notify-email" className="text-[#FF9B51]" />
                      <Label htmlFor="notify-email" className="cursor-pointer">Email</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="push" id="notify-push" className="text-[#FF9B51]" />
                      <Label htmlFor="notify-push" className="cursor-pointer">Push Notification</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="both" id="notify-both" className="text-[#FF9B51]" />
                      <Label htmlFor="notify-both" className="cursor-pointer">Both</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
              
              <div className="pt-4 flex justify-between">
                <Button 
                  variant="outline"
                  onClick={() => setCurrentTab('rules')}
                >
                  Back
                </Button>
                <Button 
                  onClick={() => setCurrentTab('blockchain')}
                  className="bg-[#FF9B51] hover:bg-[#FFBB71] text-white"
                >
                  Continue to Blockchain
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="blockchain" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Blockchain List */}
                <div className="lg:col-span-1 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Blockchains</h2>
                  </div>
                  
                  <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                    {blockchainSettings.map(bs => (
                      <div 
                        key={bs.chain}
                        className={`flex items-center space-x-3 p-3 rounded-md cursor-pointer transition-colors ${
                          selectedChain === bs.chain 
                            ? 'bg-[#FFC151]/20 border border-[#FFC151]/40' 
                            : 'bg-black/20 border border-gray-800 hover:border-gray-700'
                        }`}
                        onClick={() => setSelectedChain(bs.chain)}
                      >
                        <div className="bg-black/30 h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="font-bold text-[#FFC151]">{getChainIcon(bs.chain)}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{bs.chain.toUpperCase()}</p>
                          <div className="flex items-center text-xs text-gray-400">
                            <span className="truncate">
                              {bs.settings.fallbackChains.length 
                                ? `${bs.settings.fallbackChains.length} fallbacks` 
                                : 'No fallbacks'}
                            </span>
                            {bs.settings.recoveryEnabled && (
                              <Badge className="ml-2 bg-green-500/20 text-green-500 px-1.5 py-0">
                                Recovery
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {!blockchainSettings.some(bs => bs.chain === 'ethereum') && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-dashed border-gray-700 hover:bg-[#FFC151]/5 hover:border-[#FFC151]/30"
                        onClick={() => addBlockchain('ethereum')}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Ethereum
                      </Button>
                    )}
                    
                    {!blockchainSettings.some(bs => bs.chain === 'ton') && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-dashed border-gray-700 hover:bg-[#FFC151]/5 hover:border-[#FFC151]/30"
                        onClick={() => addBlockchain('ton')}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        TON
                      </Button>
                    )}
                    
                    {!blockchainSettings.some(bs => bs.chain === 'solana') && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-dashed border-gray-700 hover:bg-[#FFC151]/5 hover:border-[#FFC151]/30"
                        onClick={() => addBlockchain('solana')}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Solana
                      </Button>
                    )}
                    
                    {!blockchainSettings.some(bs => bs.chain === 'bitcoin') && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-dashed border-gray-700 hover:bg-[#FFC151]/5 hover:border-[#FFC151]/30"
                        onClick={() => addBlockchain('bitcoin')}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Bitcoin
                      </Button>
                    )}
                  </div>
                </div>
                
                {/* Blockchain Settings */}
                <div className="lg:col-span-2 space-y-4">
                  {getSelectedBlockchainSettings() ? (
                    <>
                      <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">
                          <span className="mr-2">{getSelectedBlockchainSettings()!.chain.toUpperCase()}</span>
                          Settings
                        </h2>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeBlockchain(selectedChain)}
                          className="h-8 w-8 text-red-500 hover:text-red-400 hover:bg-red-500/10"
                          disabled={blockchainSettings.length <= 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-gray-800 py-4">
                          <div>
                            <Label htmlFor="recovery-enabled" className="cursor-pointer font-medium">
                              Recovery Mechanism
                            </Label>
                            <p className="text-sm text-gray-400">
                              Enable recovery options for this blockchain
                            </p>
                          </div>
                          <Switch 
                            id="recovery-enabled"
                            checked={getSelectedBlockchainSettings()!.settings.recoveryEnabled}
                            onCheckedChange={(checked) => updateBlockchainSetting(selectedChain, { recoveryEnabled: checked })}
                            className="data-[state=checked]:bg-[#FFC151]"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label htmlFor="confirmations-required">Confirmations Required</Label>
                            <span>
                              {getSelectedBlockchainSettings()!.settings.confirmationsRequired} confirmations
                            </span>
                          </div>
                          <Slider
                            id="confirmations-required"
                            min={1}
                            max={
                              selectedChain === 'ethereum' ? 24 :
                              selectedChain === 'ton' ? 10 :
                              selectedChain === 'solana' ? 64 :
                              selectedChain === 'bitcoin' ? 12 : 24
                            }
                            step={1}
                            value={[getSelectedBlockchainSettings()!.settings.confirmationsRequired]}
                            onValueChange={(value) => updateBlockchainSetting(selectedChain, { confirmationsRequired: value[0] })}
                            className="[&>span]:bg-[#FFC151]"
                          />
                          <div className="flex justify-between text-xs text-gray-400">
                            <span>Faster</span>
                            <span>More Secure</span>
                          </div>
                        </div>
                        
                        <Separator className="my-4 bg-gray-800" />
                        
                        <div className="space-y-3">
                          <h3 className="text-base font-medium">Fallback Chains</h3>
                          <p className="text-sm text-gray-400">
                            If this chain becomes unavailable, the vault can use fallback chains for recovery
                          </p>
                          
                          <div className="space-y-2 mt-2">
                            {(['ethereum', 'ton', 'solana', 'bitcoin'] as const).map(chain => {
                              // Skip the current chain
                              if (chain === selectedChain) return null;
                              
                              const isUsed = getSelectedBlockchainSettings()!.settings.fallbackChains.includes(chain);
                              
                              return (
                                <div 
                                  key={chain}
                                  className={`flex items-center justify-between p-3 rounded-md border ${
                                    isUsed 
                                      ? 'bg-[#FFC151]/10 border-[#FFC151]/30' 
                                      : 'bg-black/20 border-gray-800'
                                  }`}
                                >
                                  <div className="flex items-center">
                                    <div className="bg-black/30 h-8 w-8 rounded-full flex items-center justify-center mr-3">
                                      <span className="font-bold text-[#FFC151]">{getChainIcon(chain)}</span>
                                    </div>
                                    <div>
                                      <p className="font-medium">{chain.toUpperCase()}</p>
                                      <p className="text-xs text-gray-400">
                                        {chain === 'ethereum' ? 'EVM-based fallback' :
                                         chain === 'ton' ? 'TON-based fallback' :
                                         chain === 'solana' ? 'Solana-based fallback' :
                                         'Bitcoin-based fallback'}
                                      </p>
                                    </div>
                                  </div>
                                  
                                  <Switch 
                                    checked={isUsed}
                                    onCheckedChange={() => toggleFallbackChain(selectedChain, chain)}
                                    className="data-[state=checked]:bg-[#FFC151]"
                                  />
                                </div>
                              );
                            })}
                          </div>
                          
                          {blockchainSettings.length <= 1 && (
                            <Alert className="mt-2 bg-amber-500/10 border-amber-500/30">
                              <div className="text-sm text-amber-500">
                                Add more blockchains to enable fallback chains for recovery
                              </div>
                            </Alert>
                          )}
                        </div>
                        
                        <Separator className="my-4 bg-gray-800" />
                        
                        <div className="space-y-2">
                          <Label htmlFor="custom-verification">Custom Verification (Optional)</Label>
                          <Textarea
                            id="custom-verification"
                            value={getSelectedBlockchainSettings()!.settings.customVerification || ''}
                            onChange={(e) => updateBlockchainSetting(selectedChain, { customVerification: e.target.value })}
                            className="bg-black/30 border-gray-700 min-h-[100px]"
                            placeholder={`Custom verification logic for ${selectedChain.toUpperCase()} (e.g., specific transaction conditions, custom contract calls)`}
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-64 border border-dashed border-gray-700 rounded-md">
                      <Layers className="h-10 w-10 text-gray-500 mb-2" />
                      <p className="text-gray-500">No blockchain selected</p>
                      <p className="text-xs text-gray-500 mb-4">Configure blockchain settings for your dynamic vault</p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-[#FFC151] hover:text-[#FFE171] hover:bg-[#FFC151]/10"
                          onClick={() => addBlockchain('ton')}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add TON
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-[#FFC151] hover:text-[#FFE171] hover:bg-[#FFC151]/10"
                          onClick={() => addBlockchain('ethereum')}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add Ethereum
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="pt-6 space-y-6">
                {!isDeploying ? (
                  <Button 
                    onClick={deployVault}
                    className="w-full bg-gradient-to-r from-[#FF5151] to-[#FFC151] hover:from-[#FF7171] hover:to-[#FFE171] text-white h-12 text-lg font-semibold"
                  >
                    Deploy Dynamic Vault
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Deploying Dynamic Vault...</span>
                      <span>{deploymentProgress}%</span>
                    </div>
                    <Progress value={deploymentProgress} className="h-2 [&>div]:bg-gradient-to-r [&>div]:from-[#FF5151] [&>div]:to-[#FFC151]" />
                    <p className="text-sm text-gray-400">
                      {deploymentProgress < 30 && "Configuring vault architecture..."}
                      {deploymentProgress >= 30 && deploymentProgress < 60 && "Setting up dynamic rule engine..."}
                      {deploymentProgress >= 60 && deploymentProgress < 90 && "Deploying blockchain integrations..."}
                      {deploymentProgress >= 90 && "Finalizing deployment..."}
                    </p>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <Button 
                    variant="outline"
                    onClick={() => setCurrentTab('security')}
                    disabled={isDeploying}
                  >
                    Back
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Right Column - Info Cards */}
        <div className="space-y-6">
          <Card className="bg-black/30 backdrop-blur-sm border-gray-800 overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-[#FF5151] to-[#FFC151]" />
            <CardHeader className="pb-2">
              <CardTitle>Dynamic Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Adaptability</span>
                    <span className={`font-medium ${
                      performanceScores.adaptability >= 80 ? 'text-green-500' :
                      performanceScores.adaptability >= 60 ? 'text-amber-500' :
                      'text-red-500'
                    }`}>
                      {performanceScores.adaptability}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        performanceScores.adaptability >= 80 ? 'bg-green-500' :
                        performanceScores.adaptability >= 60 ? 'bg-amber-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${performanceScores.adaptability}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Efficiency</span>
                    <span className={`font-medium ${
                      performanceScores.efficiency >= 80 ? 'text-green-500' :
                      performanceScores.efficiency >= 60 ? 'text-amber-500' :
                      'text-red-500'
                    }`}>
                      {performanceScores.efficiency}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        performanceScores.efficiency >= 80 ? 'bg-green-500' :
                        performanceScores.efficiency >= 60 ? 'bg-amber-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${performanceScores.efficiency}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Security Rating</span>
                    <span className={`font-medium ${
                      performanceScores.securityRating >= 80 ? 'text-green-500' :
                      performanceScores.securityRating >= 60 ? 'text-amber-500' :
                      'text-red-500'
                    }`}>
                      {performanceScores.securityRating}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        performanceScores.securityRating >= 80 ? 'bg-green-500' :
                        performanceScores.securityRating >= 60 ? 'bg-amber-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${performanceScores.securityRating}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Rule Optimization</span>
                    <span className={`font-medium ${
                      performanceScores.ruleOptimization >= 80 ? 'text-green-500' :
                      performanceScores.ruleOptimization >= 60 ? 'text-amber-500' :
                      'text-red-500'
                    }`}>
                      {performanceScores.ruleOptimization}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        performanceScores.ruleOptimization >= 80 ? 'bg-green-500' :
                        performanceScores.ruleOptimization >= 60 ? 'bg-amber-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${performanceScores.ruleOptimization}%` }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <div className="px-6 py-3 bg-black/40 border-t border-gray-800">
              <div className="text-center">
                <p className="text-sm text-gray-400">
                  {rules.length} active rule{rules.length !== 1 ? 's' : ''} • {blockchainSettings.length} blockchain{blockchainSettings.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </Card>
          
          <Card className="bg-black/30 backdrop-blur-sm border-gray-800 overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-[#FF5151] to-[#FFC151]" />
            <CardHeader className="pb-2">
              <CardTitle>Rule Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 max-h-64 overflow-y-auto pr-2">
              {rules.map(rule => (
                <div 
                  key={rule.id}
                  className="flex items-center p-2 bg-black/20 rounded-md border border-gray-800"
                >
                  <div className="bg-black/30 h-7 w-7 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                    {getRuleTypeIcon(rule.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm truncate">{rule.name}</p>
                      <Badge variant="outline" className={`
                        text-xs px-1.5 py-0 ml-1 flex-shrink-0
                        ${rule.priority === 'high' ? 'border-red-500 text-red-500' : 
                          rule.priority === 'medium' ? 'border-amber-500 text-amber-500' : 
                          'border-green-500 text-green-500'}
                      `}>
                        {rule.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-400 truncate">
                      {rule.isActive ? (
                        <Check className="h-3 w-3 inline text-green-500 mr-1" />
                      ) : (
                        <XCircle className="h-3 w-3 inline text-red-500 mr-1" />
                      )}
                      {getActionDescription(rule.action, rule.actionValue)}
                    </p>
                  </div>
                </div>
              ))}
              
              {rules.length === 0 && (
                <div className="text-center py-4 text-gray-500 text-sm">
                  No rules defined yet. Add rules to enable dynamic behavior.
                </div>
              )}
            </CardContent>
            <div className="px-6 py-3 bg-black/40 border-t border-gray-800">
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full text-[#FF5151] hover:text-[#FF7171] hover:bg-[#FF5151]/10 text-xs"
                onClick={() => {
                  setCurrentTab('rules');
                  addRule();
                }}
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Rule
              </Button>
            </div>
          </Card>
          
          <Alert className="bg-[#FF5151]/10 border-[#FF5151]/30">
            <Activity className="h-4 w-4 text-[#FF5151]" />
            <AlertTitle className="text-[#FF5151]">Dynamic Security</AlertTitle>
            <AlertDescription className="text-gray-300">
              This vault automatically adapts its security posture based on real-time conditions, providing optimal protection while maintaining convenience.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
};

export default DynamicVaultForm;