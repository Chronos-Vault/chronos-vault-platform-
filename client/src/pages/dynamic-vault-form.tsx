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
  const [location, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState('basics');
  const [progress, setProgress] = useState(25);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentProgress, setDeploymentProgress] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [vaultId, setVaultId] = useState('');
  
  // Basic vault details
  const [vaultName, setVaultName] = useState('My Dynamic Vault');
  const [vaultDescription, setVaultDescription] = useState('A vault that automatically adapts to changing conditions');
  const [defaultSecurityLevel, setDefaultSecurityLevel] = useState<string>('standard');
  const [adaptationSpeed, setAdaptationSpeed] = useState<number>(50);
  const [enableRealTimeMonitoring, setEnableRealTimeMonitoring] = useState<boolean>(true);
  const [allowOwnerOverride, setAllowOwnerOverride] = useState<boolean>(true);
  const [assetTypes, setAssetTypes] = useState<string[]>(['crypto']);
  
  // Dynamic rules
  const [rules, setRules] = useState<DynamicRule[]>([
    {
      id: 'rule-1',
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
  const [selectedRuleId, setSelectedRuleId] = useState<string | null>('rule-1');
  
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
  
  // Performance metrics
  const [performanceScores, setPerformanceScores] = useState({
    adaptability: 75,
    efficiency: 68,
    securityRating: 70,
    ruleOptimization: 80
  });
  
  // Helper functions
  const getSelectedRule = () => rules.find(r => r.id === selectedRuleId) || null;
  const getSelectedSecurityLevel = () => securityLevels.find(level => level.id === selectedSecurityLevelId) || null;
  const getSelectedBlockchainSettings = () => blockchainSettings.find(bs => bs.chain === selectedChain) || null;
  
  // Update progress based on active tab
  useEffect(() => {
    switch(activeTab) {
      case 'basics':
        setProgress(25);
        break;
      case 'rules':
        setProgress(50);
        break;
      case 'security':
        setProgress(75);
        break;
      case 'review':
        setProgress(100);
        break;
      default:
        setProgress(25);
    }
  }, [activeTab]);
  
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
  
  // Handle asset type toggle
  const handleAssetTypeToggle = (type: string) => {
    if (assetTypes.includes(type)) {
      setAssetTypes(assetTypes.filter(t => t !== type));
    } else {
      setAssetTypes([...assetTypes, type]);
    }
  };
  
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
      requirementCount: Math.min(level.requirementCount, updatedRequirements.length)
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
  
  // Form validation and submission
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
        description: "Your vault needs at least one blockchain configuration",
        variant: "destructive"
      });
      return false;
    }
    
    if (assetTypes.length === 0) {
      toast({
        title: "No asset types selected",
        description: "Please select at least one asset type",
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };
  
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
  
  // Rendering helpers
  const renderRuleTypeLabel = (type: string) => {
    switch(type) {
      case 'timeCondition': return 'Time-Based';
      case 'marketCondition': return 'Market Condition';
      case 'securityLevel': return 'Security Event';
      case 'userActivity': return 'User Activity';
      case 'networkState': return 'Network State';
      case 'custom': return 'Custom';
      default: return type;
    }
  };
  
  const renderActionLabel = (action: string) => {
    switch(action) {
      case 'increaseSecurityLevel': return 'Increase Security Level';
      case 'decreaseSecurityLevel': return 'Decrease Security Level';
      case 'notifyUser': return 'Notify User';
      case 'freezeAssets': return 'Freeze Assets';
      case 'adjustAccessRules': return 'Adjust Access Rules';
      case 'customLogic': return 'Custom Logic';
      default: return action;
    }
  };
  
  // Reset form
  const resetForm = () => {
    setVaultName('My Dynamic Vault');
    setVaultDescription('A vault that automatically adapts to changing conditions');
    setDefaultSecurityLevel('standard');
    setAdaptationSpeed(50);
    setEnableRealTimeMonitoring(true);
    setAllowOwnerOverride(true);
    setAssetTypes(['crypto']);
    setRules([{
      id: 'rule-1',
      type: 'timeCondition',
      name: 'After Hours Protection',
      condition: 'time is between',
      value: '22:00-06:00',
      action: 'increaseSecurityLevel',
      actionValue: 'high',
      priority: 'medium',
      isActive: true
    }]);
    setSelectedRuleId('rule-1');
    setSecurityLevels([
      {
        id: 'standard',
        name: 'Standard',
        description: 'Basic security for everyday operations',
        requirementCount: 1,
        requirements: [{ type: 'keyCount', value: 1 }]
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
    setSelectedSecurityLevelId('standard');
    setBlockchainSettings([
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
    setSelectedChain('ton');
    setActiveTab('basics');
    setIsSuccess(false);
    setVaultId('');
  };
  
  if (isSuccess) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="border-green-200 dark:border-green-900">
            <CardHeader>
              <div className="mx-auto bg-green-100 dark:bg-green-900 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-center text-2xl">Dynamic Vault Created Successfully!</CardTitle>
              <CardDescription className="text-center">
                Your dynamic vault has been deployed and is ready to use
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Vault Name</p>
                    <p className="font-medium">{vaultName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Vault ID</p>
                    <p className="font-medium">{vaultId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Default Security</p>
                    <p className="font-medium capitalize">{defaultSecurityLevel}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Active Rules</p>
                    <p className="font-medium">{rules.filter(r => r.isActive).length}</p>
                  </div>
                </div>
              </div>
              
              <Alert className="bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-900">
                <Workflow className="h-4 w-4 text-purple-500" />
                <AlertTitle className="text-purple-700 dark:text-purple-400">Dynamic Security Active</AlertTitle>
                <AlertDescription className="text-purple-600 dark:text-purple-300">
                  Your vault is now monitoring conditions in real-time and will automatically adjust security settings based on your rules.
                </AlertDescription>
              </Alert>
              
              <div className="flex flex-col gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/vaults')}
                  className="w-full"
                >
                  Go to My Vaults
                </Button>
                <Button 
                  onClick={resetForm}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  Create Another Vault
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
                Create Dynamic Vault
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Create a vault with intelligent security rules that adapt to changing conditions and threats
              </p>
            </div>
            <Badge className="ml-auto bg-purple-600">Advanced</Badge>
          </div>
        </motion.div>

        <div className="mb-8">
          <Progress value={progress} className="h-2 bg-gray-200 dark:bg-gray-800" />
          <div className="flex justify-between mt-2 text-sm text-gray-500">
            <span className={activeTab === 'basics' ? 'font-medium text-purple-600' : ''}>Basic Info</span>
            <span className={activeTab === 'rules' ? 'font-medium text-purple-600' : ''}>Dynamic Rules</span>
            <span className={activeTab === 'security' ? 'font-medium text-purple-600' : ''}>Security Settings</span>
            <span className={activeTab === 'review' ? 'font-medium text-purple-600' : ''}>Review</span>
          </div>
        </div>
        
        {isDeploying ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Deploying Your Dynamic Vault</CardTitle>
              <CardDescription className="text-center">
                Please wait while we deploy your vault with the specified configuration
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="w-full max-w-md mb-6">
                <Progress value={deploymentProgress} className="h-2" />
                <p className="text-right text-sm text-gray-500 mt-1">{deploymentProgress}%</p>
              </div>
              
              <div className="space-y-4 w-full max-w-md">
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Initializing vault structure</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Configuring dynamic rule engine</span>
                </div>
                <div className="flex items-center gap-3">
                  {deploymentProgress >= 40 ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-gray-300 border-t-purple-600 animate-spin" />
                  )}
                  <span>Setting up security levels</span>
                </div>
                <div className="flex items-center gap-3">
                  {deploymentProgress >= 70 ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-gray-300 border-t-purple-600 animate-spin opacity-40" />
                  )}
                  <span className={deploymentProgress < 70 ? "text-gray-400" : ""}>Configuring blockchain integration</span>
                </div>
                <div className="flex items-center gap-3">
                  {deploymentProgress >= 90 ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-gray-300 border-t-purple-600 animate-spin opacity-20" />
                  )}
                  <span className={deploymentProgress < 90 ? "text-gray-400" : ""}>Finalizing vault deployment</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 mb-6">
                <TabsTrigger value="basics">Basic Info</TabsTrigger>
                <TabsTrigger value="rules">Dynamic Rules</TabsTrigger>
                <TabsTrigger value="security">Security Settings</TabsTrigger>
                <TabsTrigger value="review">Review</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basics">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Settings2 className="mr-2 h-5 w-5 text-purple-500" />
                      Basic Configuration
                    </CardTitle>
                    <CardDescription>
                      Configure the fundamental settings for your dynamic vault
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="vault-name">Vault Name</Label>
                        <Input 
                          id="vault-name" 
                          value={vaultName} 
                          onChange={(e) => setVaultName(e.target.value)} 
                          placeholder="Enter vault name"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="vault-description">Description</Label>
                        <Textarea 
                          id="vault-description" 
                          value={vaultDescription} 
                          onChange={(e) => setVaultDescription(e.target.value)} 
                          placeholder="Describe the purpose of this vault"
                          rows={3}
                        />
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Asset Types</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-start space-x-3">
                          <Checkbox 
                            id="asset-crypto" 
                            checked={assetTypes.includes('crypto')} 
                            onCheckedChange={() => handleAssetTypeToggle('crypto')} 
                          />
                          <div className="space-y-1 leading-none">
                            <Label htmlFor="asset-crypto">Cryptocurrency</Label>
                            <p className="text-sm text-gray-500">Digital currencies</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <Checkbox 
                            id="asset-nft" 
                            checked={assetTypes.includes('nft')} 
                            onCheckedChange={() => handleAssetTypeToggle('nft')} 
                          />
                          <div className="space-y-1 leading-none">
                            <Label htmlFor="asset-nft">NFTs</Label>
                            <p className="text-sm text-gray-500">Non-fungible tokens</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <Checkbox 
                            id="asset-tokens" 
                            checked={assetTypes.includes('tokens')} 
                            onCheckedChange={() => handleAssetTypeToggle('tokens')} 
                          />
                          <div className="space-y-1 leading-none">
                            <Label htmlFor="asset-tokens">Tokens</Label>
                            <p className="text-sm text-gray-500">Utility and security tokens</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <Checkbox 
                            id="asset-documents" 
                            checked={assetTypes.includes('documents')} 
                            onCheckedChange={() => handleAssetTypeToggle('documents')} 
                          />
                          <div className="space-y-1 leading-none">
                            <Label htmlFor="asset-documents">Documents</Label>
                            <p className="text-sm text-gray-500">Digital files and documents</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Security Configuration</h3>
                      
                      <div className="space-y-2">
                        <Label htmlFor="security-level">Default Security Level</Label>
                        <Select 
                          value={defaultSecurityLevel} 
                          onValueChange={setDefaultSecurityLevel}
                        >
                          <SelectTrigger id="security-level">
                            <SelectValue placeholder="Select default security level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="standard">Standard</SelectItem>
                            <SelectItem value="enhanced">Enhanced</SelectItem>
                            <SelectItem value="maximum">Maximum</SelectItem>
                            {securityLevels
                              .filter(level => !['standard', 'enhanced', 'maximum'].includes(level.id))
                              .map(level => (
                                <SelectItem key={level.id} value={level.id}>
                                  {level.name}
                                </SelectItem>
                              ))
                            }
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor="adaptation-speed">Adaptation Speed</Label>
                          <span className="text-sm text-gray-500">{adaptationSpeed}%</span>
                        </div>
                        <Slider
                          id="adaptation-speed"
                          min={10}
                          max={90}
                          step={10}
                          value={[adaptationSpeed]}
                          onValueChange={(value) => setAdaptationSpeed(value[0])}
                          className="cursor-pointer"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Cautious</span>
                          <span>Balanced</span>
                          <span>Responsive</span>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="real-time-monitoring">Real-Time Monitoring</Label>
                            <p className="text-sm text-gray-500">Continuously monitor for security threats</p>
                          </div>
                          <Switch
                            id="real-time-monitoring"
                            checked={enableRealTimeMonitoring}
                            onCheckedChange={setEnableRealTimeMonitoring}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="owner-override">Owner Override</Label>
                            <p className="text-sm text-gray-500">Allow owner to bypass security rules</p>
                          </div>
                          <Switch
                            id="owner-override"
                            checked={allowOwnerOverride}
                            onCheckedChange={setAllowOwnerOverride}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button 
                      onClick={() => setActiveTab('rules')}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      Continue <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="rules">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center">
                          <Workflow className="mr-2 h-5 w-5 text-purple-500" />
                          Dynamic Rule Engine
                        </CardTitle>
                        <CardDescription>
                          Create rules that respond to market conditions, time-based events, and security threats
                        </CardDescription>
                      </div>
                      <Button
                        onClick={addRule}
                        size="sm"
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        <Plus className="mr-2 h-4 w-4" /> Add Rule
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="space-y-4 md:col-span-1 md:border-r pr-4">
                        <div className="text-sm font-medium text-gray-500">Rule List</div>
                        {rules.map(rule => (
                          <Button
                            key={rule.id}
                            variant={selectedRuleId === rule.id ? "default" : "outline"}
                            className={`w-full justify-start text-left h-auto py-3 ${selectedRuleId === rule.id ? 'bg-purple-600 hover:bg-purple-700' : ''}`}
                            onClick={() => setSelectedRuleId(rule.id)}
                          >
                            <div className="flex flex-col items-start">
                              <div className="font-medium">{rule.name}</div>
                              <div className="text-xs flex items-center gap-1">
                                <Badge 
                                  variant="outline" 
                                  className={`
                                    ${rule.priority === 'high' ? 'border-red-500 text-red-500' : 
                                      rule.priority === 'medium' ? 'border-amber-500 text-amber-500' : 
                                      'border-blue-500 text-blue-500'}
                                  `}
                                >
                                  {rule.priority.charAt(0).toUpperCase() + rule.priority.slice(1)}
                                </Badge>
                                <Badge 
                                  variant="outline" 
                                  className={rule.isActive ? 'border-green-500 text-green-500' : 'border-gray-500 text-gray-500'}
                                >
                                  {rule.isActive ? 'Active' : 'Inactive'}
                                </Badge>
                              </div>
                            </div>
                          </Button>
                        ))}
                      </div>
                      
                      <div className="md:col-span-2">
                        {getSelectedRule() && (
                          <div className="space-y-6">
                            <div className="flex justify-between items-center">
                              <h3 className="text-lg font-medium">Rule Configuration</h3>
                              <Button
                                onClick={() => deleteRule(selectedRuleId!)}
                                variant="ghost"
                                size="sm"
                                className="text-red-500 hover:text-red-700"
                                disabled={rules.length <= 1}
                              >
                                <Trash2 className="h-4 w-4 mr-1" /> Delete
                              </Button>
                            </div>
                            
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="rule-name">Rule Name</Label>
                                <Input 
                                  id="rule-name" 
                                  value={getSelectedRule()!.name} 
                                  onChange={(e) => updateRule(selectedRuleId!, { name: e.target.value })} 
                                />
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="rule-type">Condition Type</Label>
                                  <Select 
                                    value={getSelectedRule()!.type} 
                                    onValueChange={(value: any) => updateRule(selectedRuleId!, { type: value })}
                                  >
                                    <SelectTrigger id="rule-type">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="timeCondition">Time-Based</SelectItem>
                                      <SelectItem value="marketCondition">Market Condition</SelectItem>
                                      <SelectItem value="securityLevel">Security Event</SelectItem>
                                      <SelectItem value="userActivity">User Activity</SelectItem>
                                      <SelectItem value="networkState">Network State</SelectItem>
                                      <SelectItem value="custom">Custom</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                
                                <div className="space-y-2">
                                  <Label htmlFor="rule-priority">Priority</Label>
                                  <Select 
                                    value={getSelectedRule()!.priority} 
                                    onValueChange={(value: any) => updateRule(selectedRuleId!, { priority: value })}
                                  >
                                    <SelectTrigger id="rule-priority">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="high">High</SelectItem>
                                      <SelectItem value="medium">Medium</SelectItem>
                                      <SelectItem value="low">Low</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="rule-condition">Condition</Label>
                                <Input 
                                  id="rule-condition" 
                                  value={getSelectedRule()!.condition} 
                                  onChange={(e) => updateRule(selectedRuleId!, { condition: e.target.value })} 
                                  placeholder={
                                    getSelectedRule()!.type === 'timeCondition' ? 'e.g., time is between' :
                                    getSelectedRule()!.type === 'marketCondition' ? 'e.g., BTC price drops below' :
                                    getSelectedRule()!.type === 'securityLevel' ? 'e.g., failed login attempts exceed' :
                                    getSelectedRule()!.type === 'userActivity' ? 'e.g., login from new location' :
                                    getSelectedRule()!.type === 'networkState' ? 'e.g., network congestion above' :
                                    'e.g., custom condition'
                                  }
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="rule-value">Value</Label>
                                <Input 
                                  id="rule-value" 
                                  value={getSelectedRule()!.value.toString()}
                                  onChange={(e) => updateRule(selectedRuleId!, { value: e.target.value })} 
                                  placeholder={
                                    getSelectedRule()!.type === 'timeCondition' ? 'e.g., 22:00-06:00' :
                                    getSelectedRule()!.type === 'marketCondition' ? 'e.g., 50000' :
                                    getSelectedRule()!.type === 'securityLevel' ? 'e.g., 3' :
                                    getSelectedRule()!.type === 'userActivity' ? 'e.g., any' :
                                    getSelectedRule()!.type === 'networkState' ? 'e.g., 80%' :
                                    'e.g., custom value'
                                  }
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="rule-action">Action</Label>
                                <Select
                                  value={getSelectedRule()!.action}
                                  onValueChange={(value: any) => updateRule(selectedRuleId!, { action: value })}
                                >
                                  <SelectTrigger id="rule-action">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="increaseSecurityLevel">Increase Security Level</SelectItem>
                                    <SelectItem value="decreaseSecurityLevel">Decrease Security Level</SelectItem>
                                    <SelectItem value="notifyUser">Notify User</SelectItem>
                                    <SelectItem value="freezeAssets">Freeze Assets</SelectItem>
                                    <SelectItem value="adjustAccessRules">Adjust Access Rules</SelectItem>
                                    <SelectItem value="customLogic">Custom Logic</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="rule-action-value">Action Value</Label>
                                <Input 
                                  id="rule-action-value" 
                                  value={getSelectedRule()!.actionValue?.toString() || ''} 
                                  onChange={(e) => updateRule(selectedRuleId!, { actionValue: e.target.value })} 
                                  placeholder={
                                    ['increaseSecurityLevel', 'decreaseSecurityLevel'].includes(getSelectedRule()!.action) ? 'e.g., enhanced, maximum' :
                                    getSelectedRule()!.action === 'notifyUser' ? 'e.g., message content' :
                                    getSelectedRule()!.action === 'freezeAssets' ? 'e.g., duration in hours' :
                                    getSelectedRule()!.action === 'adjustAccessRules' ? 'e.g., rule IDs' :
                                    getSelectedRule()!.action === 'customLogic' ? 'e.g., custom logic description' :
                                    'Action value'
                                  }
                                />
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <Switch 
                                  id="rule-active" 
                                  checked={getSelectedRule()!.isActive} 
                                  onCheckedChange={(checked) => updateRule(selectedRuleId!, { isActive: checked })} 
                                />
                                <Label htmlFor="rule-active">Rule Active</Label>
                              </div>
                            </div>
                            
                            <Alert className="bg-gray-50 dark:bg-gray-900">
                              <BarChart3 className="h-4 w-4" />
                              <AlertTitle>Rule Summary</AlertTitle>
                              <AlertDescription>
                                When <span className="font-medium">{getSelectedRule()!.condition}</span> {getSelectedRule()!.value.toString()}, 
                                the system will {renderActionLabel(getSelectedRule()!.action).toLowerCase()}
                                {getSelectedRule()!.actionValue ? ` (${getSelectedRule()!.actionValue})` : ''}.
                              </AlertDescription>
                            </Alert>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button 
                      variant="outline" 
                      onClick={() => setActiveTab('basics')}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button 
                      onClick={() => setActiveTab('security')}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      Continue <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="security">
                <Tabs defaultValue="levels">
                  <TabsList className="grid grid-cols-2 mb-6">
                    <TabsTrigger value="levels">Security Levels</TabsTrigger>
                    <TabsTrigger value="blockchain">Blockchain Settings</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="levels">
                    <Card>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="flex items-center">
                              <Shield className="mr-2 h-5 w-5 text-purple-500" />
                              Adaptive Security Levels
                            </CardTitle>
                            <CardDescription>
                              Define security levels that your vault can automatically switch between
                            </CardDescription>
                          </div>
                          <Button
                            onClick={addSecurityLevel}
                            size="sm"
                            className="bg-purple-600 hover:bg-purple-700"
                          >
                            <Plus className="mr-2 h-4 w-4" /> Add Level
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-3 gap-6">
                          <div className="space-y-4 md:col-span-1 md:border-r pr-4">
                            <div className="text-sm font-medium text-gray-500">Security Levels</div>
                            {securityLevels.map(level => (
                              <Button
                                key={level.id}
                                variant={selectedSecurityLevelId === level.id ? "default" : "outline"}
                                className={`w-full justify-start text-left h-auto py-3 ${selectedSecurityLevelId === level.id ? 'bg-purple-600 hover:bg-purple-700' : ''}`}
                                onClick={() => setSelectedSecurityLevelId(level.id)}
                              >
                                <div className="flex flex-col items-start">
                                  <div className="font-medium">{level.name}</div>
                                  <div className="text-xs">
                                    {level.requirements.length} factors ({level.requirementCount} required)
                                  </div>
                                </div>
                              </Button>
                            ))}
                          </div>
                          
                          <div className="md:col-span-2">
                            {getSelectedSecurityLevel() && (
                              <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                  <h3 className="text-lg font-medium">Level Configuration</h3>
                                  <Button
                                    onClick={() => deleteSecurityLevel(selectedSecurityLevelId!)}
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-500 hover:text-red-700"
                                    disabled={['standard', 'enhanced', 'maximum'].includes(selectedSecurityLevelId!)}
                                  >
                                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                                  </Button>
                                </div>
                                
                                <div className="space-y-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="level-name">Level Name</Label>
                                    <Input 
                                      id="level-name" 
                                      value={getSelectedSecurityLevel()!.name} 
                                      onChange={(e) => updateSecurityLevel(selectedSecurityLevelId!, { name: e.target.value })} 
                                      disabled={['standard', 'enhanced', 'maximum'].includes(selectedSecurityLevelId!)}
                                    />
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <Label htmlFor="level-description">Description</Label>
                                    <Textarea 
                                      id="level-description" 
                                      value={getSelectedSecurityLevel()!.description} 
                                      onChange={(e) => updateSecurityLevel(selectedSecurityLevelId!, { description: e.target.value })} 
                                      disabled={['standard', 'enhanced', 'maximum'].includes(selectedSecurityLevelId!)}
                                    />
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                      <Label htmlFor="requirement-count">Required Factors</Label>
                                      <Badge variant="outline">
                                        {getSelectedSecurityLevel()!.requirementCount} of {getSelectedSecurityLevel()!.requirements.length}
                                      </Badge>
                                    </div>
                                    <Slider
                                      id="requirement-count"
                                      min={1}
                                      max={Math.max(getSelectedSecurityLevel()!.requirements.length, 1)}
                                      step={1}
                                      value={[getSelectedSecurityLevel()!.requirementCount]}
                                      onValueChange={(value) => updateSecurityLevel(selectedSecurityLevelId!, { requirementCount: value[0] })}
                                      disabled={['standard', 'enhanced', 'maximum'].includes(selectedSecurityLevelId!)}
                                    />
                                  </div>
                                  
                                  <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                      <Label>Security Requirements</Label>
                                      <Button
                                        onClick={() => addRequirement(selectedSecurityLevelId!)}
                                        variant="outline"
                                        size="sm"
                                        disabled={['standard', 'enhanced', 'maximum'].includes(selectedSecurityLevelId!)}
                                      >
                                        <Plus className="mr-1 h-3 w-3" /> Add
                                      </Button>
                                    </div>
                                    
                                    {getSelectedSecurityLevel()!.requirements.map((req, index) => (
                                      <div key={index} className="flex items-center gap-2 p-3 border rounded-md">
                                        <Select
                                          value={req.type}
                                          onValueChange={(value: any) => updateRequirement(selectedSecurityLevelId!, index, { type: value })}
                                          disabled={['standard', 'enhanced', 'maximum'].includes(selectedSecurityLevelId!)}
                                        >
                                          <SelectTrigger className="w-[150px]">
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="keyCount">Key Count</SelectItem>
                                            <SelectItem value="verification">Verification</SelectItem>
                                            <SelectItem value="timeDelay">Time Delay</SelectItem>
                                            <SelectItem value="approval">Approval</SelectItem>
                                            <SelectItem value="passwordLength">Password Length</SelectItem>
                                          </SelectContent>
                                        </Select>
                                        
                                        {req.type === 'verification' ? (
                                          <Select
                                            value={req.value.toString()}
                                            onValueChange={(value) => updateRequirement(selectedSecurityLevelId!, index, { value })}
                                            disabled={['standard', 'enhanced', 'maximum'].includes(selectedSecurityLevelId!)}
                                          >
                                            <SelectTrigger className="flex-1">
                                              <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="email">Email</SelectItem>
                                              <SelectItem value="sms">SMS</SelectItem>
                                              <SelectItem value="authenticator">Authenticator App</SelectItem>
                                              <SelectItem value="biometric">Biometric</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        ) : (
                                          <Input
                                            type="text"
                                            value={req.value.toString()}
                                            onChange={(e) => updateRequirement(selectedSecurityLevelId!, index, { value: e.target.value })}
                                            className="flex-1"
                                            disabled={['standard', 'enhanced', 'maximum'].includes(selectedSecurityLevelId!)}
                                            placeholder={
                                              req.type === 'keyCount' ? 'Number of keys' :
                                              req.type === 'timeDelay' ? 'Delay in minutes' :
                                              req.type === 'approval' ? 'Number of approvers' :
                                              req.type === 'passwordLength' ? 'Min length' : ''
                                            }
                                          />
                                        )}
                                        
                                        <Button
                                          onClick={() => removeRequirement(selectedSecurityLevelId!, index)}
                                          variant="ghost"
                                          size="sm"
                                          className="p-0 h-8 w-8 text-red-500"
                                          disabled={['standard', 'enhanced', 'maximum'].includes(selectedSecurityLevelId!) || getSelectedSecurityLevel()!.requirements.length <= 1}
                                        >
                                          <XCircle className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                
                                <Alert className="bg-gray-50 dark:bg-gray-900">
                                  <Shield className="h-4 w-4" />
                                  <AlertTitle>Security Level Summary</AlertTitle>
                                  <AlertDescription>
                                    This level requires {getSelectedSecurityLevel()!.requirementCount} of {getSelectedSecurityLevel()!.requirements.length} security factors to be satisfied.
                                    {['standard', 'enhanced', 'maximum'].includes(selectedSecurityLevelId!) && 
                                      " This is a system-defined level and cannot be modified."}
                                  </AlertDescription>
                                </Alert>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button 
                          variant="outline" 
                          onClick={() => setActiveTab('rules')}
                        >
                          <ArrowLeft className="mr-2 h-4 w-4" /> Back
                        </Button>
                        <Button 
                          onClick={() => setActiveTab('review')}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          Continue <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="blockchain">
                    <Card>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="flex items-center">
                              <Layers className="mr-2 h-5 w-5 text-purple-500" />
                              Multi-Chain Optimization
                            </CardTitle>
                            <CardDescription>
                              Configure optimal blockchain settings for your vault
                            </CardDescription>
                          </div>
                          <Select
                            value={selectedChain}
                            onValueChange={(value: any) => setSelectedChain(value)}
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Select chain" />
                            </SelectTrigger>
                            <SelectContent>
                              {blockchainSettings.map(bs => (
                                <SelectItem key={bs.chain} value={bs.chain}>
                                  {bs.chain.toUpperCase()}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {getSelectedBlockchainSettings() && (
                          <>
                            <div className="space-y-4">
                              <div className="flex justify-between items-center">
                                <h3 className="text-lg font-medium capitalize">{selectedChain} Settings</h3>
                                <div className="flex gap-2">
                                  <Button
                                    onClick={() => removeBlockchain(selectedChain)}
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-500 hover:text-red-700"
                                    disabled={blockchainSettings.length <= 1}
                                  >
                                    <Trash2 className="h-4 w-4 mr-1" /> Remove
                                  </Button>
                                </div>
                              </div>
                              
                              <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="confirmations">Required Confirmations</Label>
                                  <Input
                                    id="confirmations"
                                    type="number"
                                    min="1"
                                    value={getSelectedBlockchainSettings()!.settings.confirmationsRequired}
                                    onChange={(e) => updateBlockchainSetting(selectedChain, { 
                                      confirmationsRequired: parseInt(e.target.value) || 1 
                                    })}
                                  />
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                  <Switch
                                    id="recovery-enabled"
                                    checked={getSelectedBlockchainSettings()!.settings.recoveryEnabled}
                                    onCheckedChange={(checked) => updateBlockchainSetting(selectedChain, { recoveryEnabled: checked })}
                                  />
                                  <div className="space-y-1">
                                    <Label htmlFor="recovery-enabled">Enable Recovery</Label>
                                    <p className="text-xs text-gray-500">Allow asset recovery if access is lost</p>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <Label>Available Blockchain Networks</Label>
                                <div className="grid grid-cols-2 gap-3 mt-2">
                                  {['ethereum', 'ton', 'solana', 'bitcoin']
                                    .filter(chain => chain !== selectedChain)
                                    .map(chain => (
                                      <div key={chain} className="flex items-center space-x-2">
                                        <Checkbox
                                          id={`fallback-${chain}`}
                                          checked={getSelectedBlockchainSettings()!.settings.fallbackChains.includes(chain as any)}
                                          onCheckedChange={(checked) => toggleFallbackChain(selectedChain, chain as any)}
                                        />
                                        <Label htmlFor={`fallback-${chain}`} className="capitalize">
                                          {chain} (Fallback)
                                        </Label>
                                      </div>
                                    ))
                                  }
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="custom-verification">Custom Verification</Label>
                                <Textarea
                                  id="custom-verification"
                                  placeholder="Enter any custom verification requirements"
                                  value={getSelectedBlockchainSettings()!.settings.customVerification || ''}
                                  onChange={(e) => updateBlockchainSetting(selectedChain, { customVerification: e.target.value })}
                                />
                              </div>
                            </div>
                            
                            <Separator />
                            
                            <div className="space-y-4">
                              <h3 className="text-lg font-medium">Add Blockchain Network</h3>
                              <div className="flex flex-wrap gap-2">
                                {['ethereum', 'ton', 'solana', 'bitcoin']
                                  .filter(chain => !blockchainSettings.some(bs => bs.chain === chain))
                                  .map(chain => (
                                    <Button
                                      key={chain}
                                      variant="outline"
                                      onClick={() => addBlockchain(chain as any)}
                                      className="capitalize"
                                    >
                                      <Plus className="mr-1 h-4 w-4" /> {chain}
                                    </Button>
                                  ))
                                }
                                {['ethereum', 'ton', 'solana', 'bitcoin']
                                  .filter(chain => !blockchainSettings.some(bs => bs.chain === chain)).length === 0 && (
                                    <p className="text-sm text-gray-500">All available blockchain networks have been added</p>
                                  )
                                }
                              </div>
                            </div>
                            
                            <Alert className="bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-900">
                              <Layers className="h-4 w-4 text-purple-500" />
                              <AlertTitle className="text-purple-700 dark:text-purple-400">Chain Optimization</AlertTitle>
                              <AlertDescription className="text-purple-600 dark:text-purple-300">
                                Your vault will automatically optimize blockchain interactions based on network conditions, fees, and congestion. 
                                If a chain becomes unavailable, the system will use fallback chains you've selected.
                              </AlertDescription>
                            </Alert>
                          </>
                        )}
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button 
                          variant="outline" 
                          onClick={() => setActiveTab('rules')}
                        >
                          <ArrowLeft className="mr-2 h-4 w-4" /> Back
                        </Button>
                        <Button 
                          onClick={() => setActiveTab('review')}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          Continue <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  </TabsContent>
                </Tabs>
              </TabsContent>
              
              <TabsContent value="review">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Check className="mr-2 h-5 w-5 text-purple-500" />
                      Review Configuration
                    </CardTitle>
                    <CardDescription>
                      Review your dynamic vault configuration before deploying
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium mb-3">Basic Information</h3>
                          <dl className="space-y-2">
                            <div className="flex justify-between">
                              <dt className="text-gray-500">Vault Name</dt>
                              <dd className="font-medium">{vaultName}</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-gray-500">Security Level</dt>
                              <dd className="font-medium capitalize">{defaultSecurityLevel}</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-gray-500">Adaptation Speed</dt>
                              <dd className="font-medium">{adaptationSpeed}%</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-gray-500">Real-Time Monitoring</dt>
                              <dd className="font-medium">{enableRealTimeMonitoring ? 'Enabled' : 'Disabled'}</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-gray-500">Owner Override</dt>
                              <dd className="font-medium">{allowOwnerOverride ? 'Enabled' : 'Disabled'}</dd>
                            </div>
                          </dl>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-medium mb-3">Asset Types</h3>
                          <div className="flex flex-wrap gap-2">
                            {assetTypes.length > 0 ? (
                              assetTypes.map(type => (
                                <Badge key={type} className="capitalize">{type}</Badge>
                              ))
                            ) : (
                              <p className="text-sm text-gray-500">No asset types selected</p>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-medium mb-3">Blockchain Networks</h3>
                          <ul className="space-y-2">
                            {blockchainSettings.map(bs => (
                              <li key={bs.chain} className="flex items-center">
                                <Badge variant="outline" className="mr-2 capitalize">{bs.chain}</Badge>
                                <span className="text-sm text-gray-600">
                                  {bs.settings.confirmationsRequired} confirmations
                                  {bs.settings.fallbackChains.length > 0 && (
                                    <>, fallbacks: {bs.settings.fallbackChains.join(', ')}</>
                                  )}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium mb-3">Dynamic Rules</h3>
                          <ul className="space-y-3">
                            {rules.map(rule => (
                              <li key={rule.id} className="border rounded-md p-3">
                                <div className="flex justify-between items-start mb-2">
                                  <span className="font-medium">{rule.name}</span>
                                  <div className="flex gap-1">
                                    <Badge 
                                      variant="outline" 
                                      className={`
                                        ${rule.priority === 'high' ? 'border-red-500 text-red-500' : 
                                          rule.priority === 'medium' ? 'border-amber-500 text-amber-500' : 
                                          'border-blue-500 text-blue-500'}
                                      `}
                                    >
                                      {rule.priority}
                                    </Badge>
                                    {rule.isActive ? (
                                      <Badge variant="outline" className="border-green-500 text-green-500">Active</Badge>
                                    ) : (
                                      <Badge variant="outline" className="border-gray-500 text-gray-500">Inactive</Badge>
                                    )}
                                  </div>
                                </div>
                                <p className="text-sm text-gray-600">
                                  When <span className="font-medium">{rule.condition} {rule.value.toString()}</span>, 
                                  {rule.action === 'increaseSecurityLevel' && ` increase security to ${rule.actionValue || 'higher level'}`}
                                  {rule.action === 'decreaseSecurityLevel' && ` decrease security to ${rule.actionValue || 'lower level'}`}
                                  {rule.action === 'notifyUser' && ` notify user${rule.actionValue ? ` with message: "${rule.actionValue}"` : ''}`}
                                  {rule.action === 'freezeAssets' && ` freeze assets${rule.actionValue ? ` for ${rule.actionValue}` : ''}`}
                                  {rule.action === 'adjustAccessRules' && ` adjust access rules${rule.actionValue ? ` to ${rule.actionValue}` : ''}`}
                                  {rule.action === 'customLogic' && ` execute custom logic${rule.actionValue ? `: ${rule.actionValue}` : ''}`}
                                </p>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-medium mb-3">Security Levels</h3>
                          <ul className="space-y-3">
                            {securityLevels.map(level => (
                              <li key={level.id} className="border rounded-md p-3">
                                <div className="flex justify-between mb-1">
                                  <span className="font-medium">{level.name}</span>
                                  <Badge variant="outline">
                                    {level.requirementCount} of {level.requirements.length} required
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">{level.description}</p>
                                <div className="flex flex-wrap gap-2">
                                  {level.requirements.map((req, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                      {req.type === 'keyCount' && `${req.value} Keys`}
                                      {req.type === 'verification' && `${req.value} Verification`}
                                      {req.type === 'timeDelay' && `${req.value} Minute Delay`}
                                      {req.type === 'approval' && `${req.value} Approvals`}
                                      {req.type === 'passwordLength' && `${req.value} Char Password`}
                                    </Badge>
                                  ))}
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Performance Metrics</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <Label>Adaptability</Label>
                            <span className="text-sm font-medium">{performanceScores.adaptability}%</span>
                          </div>
                          <Progress value={performanceScores.adaptability} className="h-2" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <Label>Efficiency</Label>
                            <span className="text-sm font-medium">{performanceScores.efficiency}%</span>
                          </div>
                          <Progress value={performanceScores.efficiency} className="h-2" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <Label>Security Rating</Label>
                            <span className="text-sm font-medium">{performanceScores.securityRating}%</span>
                          </div>
                          <Progress value={performanceScores.securityRating} className="h-2" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <Label>Rule Optimization</Label>
                            <span className="text-sm font-medium">{performanceScores.ruleOptimization}%</span>
                          </div>
                          <Progress value={performanceScores.ruleOptimization} className="h-2" />
                        </div>
                      </div>
                    </div>
                    
                    <Alert className="bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-900">
                      <Workflow className="h-4 w-4 text-purple-500" />
                      <AlertTitle className="text-purple-700 dark:text-purple-400">Intelligent Security</AlertTitle>
                      <AlertDescription className="text-purple-600 dark:text-purple-300">
                        Your Dynamic Vault will continuously monitor conditions and automatically adjust security 
                        settings to protect your assets. Rules can be modified at any time after creation.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button 
                      variant="outline" 
                      onClick={() => setActiveTab('security')}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button 
                      onClick={deployVault}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      Deploy Vault <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
};

export default DynamicVaultForm;