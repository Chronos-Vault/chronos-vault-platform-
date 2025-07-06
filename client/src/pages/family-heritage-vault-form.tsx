import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
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
import { 
  ArrowLeft,
  UsersRound, 
  GraduationCap, 
  HeartHandshake, 
  Shield, 
  BookOpen,
  Calendar,
  Plus,
  Trash2,
  FileText,
  Clock,
  CheckCircle2,
  User,
  MessageCircle,
  Mail,
  Hourglass,
  Lock,
  School
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

// Inheritance module interface
interface InheritanceModule {
  id: string;
  title: string;
  type: 'financial' | 'educational' | 'story' | 'media' | 'values' | 'custom';
  content: string;
  required: boolean;
  order: number;
  unlockCondition?: 'age' | 'date' | 'education' | 'quiz' | 'trustee';
  unlockValue?: string | number;
  quizQuestions?: {
    question: string;
    options: string[];
    correctAnswer: number;
  }[];
}

// Beneficiary interface
interface Beneficiary {
  id: string;
  name: string;
  relationship: string;
  email?: string;
  birthdate?: string;
  allocation: number; // Percentage of inheritance
  modules: string[]; // IDs of modules assigned to this beneficiary
}

// Trustee interface
interface Trustee {
  id: string;
  name: string;
  email: string;
  role: 'primary' | 'secondary' | 'advisor';
  permissions: ('verify' | 'approve' | 'monitor' | 'emergency')[];
}

const FamilyHeritageVaultForm: React.FC = () => {
  const { toast } = useToast();
  
  // Form state
  const [vaultName, setVaultName] = useState<string>('My Family Heritage Vault');
  const [vaultDescription, setVaultDescription] = useState<string>('');
  
  // Tabs
  const [currentTab, setCurrentTab] = useState<string>('basics');
  
  // Modules
  const [modules, setModules] = useState<InheritanceModule[]>([
    {
      id: `module-${Date.now()}`,
      title: 'Financial Wisdom',
      type: 'financial',
      content: 'Important financial principles and advice for managing inheritance.',
      required: true,
      order: 1
    }
  ]);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(modules[0]?.id || null);
  
  // Beneficiaries
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([
    {
      id: `beneficiary-${Date.now()}`,
      name: 'Family Member',
      relationship: 'Child',
      allocation: 100,
      modules: [modules[0]?.id || '']
    }
  ]);
  const [selectedBeneficiaryId, setSelectedBeneficiaryId] = useState<string | null>(beneficiaries[0]?.id || null);
  const [totalAllocation, setTotalAllocation] = useState<number>(100);
  
  // Trustees
  const [trustees, setTrustees] = useState<Trustee[]>([]);
  const [selectedTrusteeId, setSelectedTrusteeId] = useState<string | null>(null);
  
  // Settings
  const [inheritanceType, setInheritanceType] = useState<'immediate' | 'phased' | 'conditional'>('phased');
  const [requireEducation, setRequireEducation] = useState<boolean>(true);
  const [enableTrustees, setEnableTrustees] = useState<boolean>(false);
  const [enableDigitalTimeCapsule, setEnableDigitalTimeCapsule] = useState<boolean>(true);
  const [enableLegalIntegration, setEnableLegalIntegration] = useState<boolean>(false);
  
  // UI state
  const [securityScore, setSecurityScore] = useState<number>(0);
  const [educationalScore, setEducationalScore] = useState<number>(0);
  const [deploymentProgress, setDeploymentProgress] = useState<number>(0);
  const [isDeploying, setIsDeploying] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [vaultId, setVaultId] = useState<string>('');
  
  // Update total allocation when beneficiaries change
  useEffect(() => {
    const total = beneficiaries.reduce((sum, b) => sum + b.allocation, 0);
    setTotalAllocation(total);
  }, [beneficiaries]);
  
  // Update security score
  useEffect(() => {
    let score = 40; // Base score
    
    // Add points for trustees
    if (enableTrustees) {
      score += 15;
      if (trustees.length >= 2) score += 10;
    }
    
    // Add points for education
    if (requireEducation) score += 10;
    
    // Add points for inheritance type
    if (inheritanceType === 'conditional') score += 15;
    else if (inheritanceType === 'phased') score += 10;
    
    // Add points for legal integration
    if (enableLegalIntegration) score += 10;
    
    // Cap at 100
    setSecurityScore(Math.min(score, 100));
  }, [
    enableTrustees,
    trustees.length,
    requireEducation,
    inheritanceType,
    enableLegalIntegration
  ]);
  
  // Update educational score
  useEffect(() => {
    let score = 30; // Base score
    
    // Add points for educational modules
    const educationalModules = modules.filter(m => m.type === 'educational' || m.type === 'financial');
    score += educationalModules.length * 10;
    
    // Add points for quiz questions
    const hasQuizzes = modules.some(m => m.unlockCondition === 'quiz' && m.quizQuestions?.length);
    if (hasQuizzes) score += 15;
    
    // Add points for values/story modules
    const valueModules = modules.filter(m => m.type === 'values' || m.type === 'story');
    score += valueModules.length * 5;
    
    // Cap at 100
    setEducationalScore(Math.min(score, 100));
  }, [modules]);
  
  // Get selected entities
  const selectedModule = modules.find(m => m.id === selectedModuleId) || null;
  const selectedBeneficiary = beneficiaries.find(b => b.id === selectedBeneficiaryId) || null;
  const selectedTrustee = trustees.find(t => t.id === selectedTrusteeId) || null;
  
  // Module operations
  const addModule = () => {
    const newModule: InheritanceModule = {
      id: `module-${Date.now()}`,
      title: `Module ${modules.length + 1}`,
      type: 'financial',
      content: '',
      required: false,
      order: modules.length + 1
    };
    
    setModules([...modules, newModule]);
    setSelectedModuleId(newModule.id);
    setCurrentTab('modules');
  };
  
  const updateModule = (id: string, updates: Partial<InheritanceModule>) => {
    setModules(modules.map(module => 
      module.id === id ? { ...module, ...updates } : module
    ));
  };
  
  const deleteModule = (id: string) => {
    // Check if it's the last module
    if (modules.length <= 1) {
      toast({
        title: "Cannot delete module",
        description: "You need at least one module in your vault",
        variant: "destructive",
      });
      return;
    }
    
    // Remove it from any beneficiaries
    setBeneficiaries(beneficiaries.map(b => ({
      ...b,
      modules: b.modules.filter(m => m !== id)
    })));
    
    // Delete the module
    const updatedModules = modules
      .filter(m => m.id !== id)
      .map((m, idx) => ({ ...m, order: idx + 1 }));
    
    setModules(updatedModules);
    
    // Select another module if the deleted one was selected
    if (selectedModuleId === id) {
      setSelectedModuleId(updatedModules[0]?.id || null);
    }
  };
  
  // Beneficiary operations
  const addBeneficiary = () => {
    // Default to even split among existing beneficiaries plus the new one
    const newCount = beneficiaries.length + 1;
    const newPercentage = Math.floor(100 / newCount);
    
    // Adjust existing beneficiaries
    const updatedBeneficiaries = beneficiaries.map(b => ({
      ...b,
      allocation: newPercentage
    }));
    
    // Add new beneficiary
    const newBeneficiary: Beneficiary = {
      id: `beneficiary-${Date.now()}`,
      name: `Beneficiary ${newCount}`,
      relationship: 'Family Member',
      allocation: newPercentage,
      modules: modules.filter(m => m.required).map(m => m.id)
    };
    
    // Handle remaining percentages
    const remaining = 100 - (newPercentage * newCount);
    if (remaining > 0 && updatedBeneficiaries.length > 0) {
      updatedBeneficiaries[0].allocation += remaining;
    }
    
    setBeneficiaries([...updatedBeneficiaries, newBeneficiary]);
    setSelectedBeneficiaryId(newBeneficiary.id);
    setCurrentTab('beneficiaries');
  };
  
  const updateBeneficiary = (id: string, updates: Partial<Beneficiary>) => {
    setBeneficiaries(beneficiaries.map(beneficiary => 
      beneficiary.id === id ? { ...beneficiary, ...updates } : beneficiary
    ));
  };
  
  const deleteBeneficiary = (id: string) => {
    // Check if it's the last beneficiary
    if (beneficiaries.length <= 1) {
      toast({
        title: "Cannot delete beneficiary",
        description: "You need at least one beneficiary for your vault",
        variant: "destructive",
      });
      return;
    }
    
    // Get the allocation of the beneficiary to be deleted
    const allocToRedistribute = beneficiaries.find(b => b.id === id)?.allocation || 0;
    
    // Remove the beneficiary
    const remainingBeneficiaries = beneficiaries.filter(b => b.id !== id);
    
    // Redistribute the allocation proportionally
    const total = remainingBeneficiaries.reduce((sum, b) => sum + b.allocation, 0);
    const updatedBeneficiaries = remainingBeneficiaries.map(b => {
      const proportion = total === 0 ? 1 / remainingBeneficiaries.length : b.allocation / total;
      return {
        ...b,
        allocation: Math.round(b.allocation + (allocToRedistribute * proportion))
      };
    });
    
    setBeneficiaries(updatedBeneficiaries);
    
    // Select another beneficiary if the deleted one was selected
    if (selectedBeneficiaryId === id) {
      setSelectedBeneficiaryId(updatedBeneficiaries[0]?.id || null);
    }
  };
  
  const toggleModuleForBeneficiary = (beneficiaryId: string, moduleId: string) => {
    setBeneficiaries(beneficiaries.map(b => {
      if (b.id !== beneficiaryId) return b;
      
      // Check if module is already assigned
      const moduleIndex = b.modules.indexOf(moduleId);
      if (moduleIndex >= 0) {
        // Don't allow removing required modules
        if (modules.find(m => m.id === moduleId)?.required) {
          return b;
        }
        // Remove the module
        return {
          ...b,
          modules: b.modules.filter(m => m !== moduleId)
        };
      } else {
        // Add the module
        return {
          ...b,
          modules: [...b.modules, moduleId]
        };
      }
    }));
  };
  
  // Trustee operations
  const addTrustee = () => {
    const newTrustee: Trustee = {
      id: `trustee-${Date.now()}`,
      name: `Trustee ${trustees.length + 1}`,
      email: '',
      role: 'primary',
      permissions: ['verify', 'approve']
    };
    
    setTrustees([...trustees, newTrustee]);
    setSelectedTrusteeId(newTrustee.id);
    setCurrentTab('trustees');
  };
  
  const updateTrustee = (id: string, updates: Partial<Trustee>) => {
    setTrustees(trustees.map(trustee => 
      trustee.id === id ? { ...trustee, ...updates } : trustee
    ));
  };
  
  const deleteTrustee = (id: string) => {
    setTrustees(trustees.filter(t => t.id !== id));
    
    // Select another trustee if the deleted one was selected
    if (selectedTrusteeId === id && trustees.length > 1) {
      setSelectedTrusteeId(trustees.find(t => t.id !== id)?.id || null);
    } else if (trustees.length <= 1) {
      setSelectedTrusteeId(null);
    }
  };
  
  const togglePermissionForTrustee = (trusteeId: string, permission: 'verify' | 'approve' | 'monitor' | 'emergency') => {
    setTrustees(trustees.map(t => {
      if (t.id !== trusteeId) return t;
      
      const permissionIndex = t.permissions.indexOf(permission);
      if (permissionIndex >= 0) {
        // Don't allow removing all permissions
        if (t.permissions.length <= 1) return t;
        
        // Remove the permission
        return {
          ...t,
          permissions: t.permissions.filter(p => p !== permission)
        };
      } else {
        // Add the permission
        return {
          ...t,
          permissions: [...t.permissions, permission]
        };
      }
    }));
  };
  
  // Form validation
  const validateForm = (): boolean => {
    if (!vaultName.trim()) {
      toast({
        title: "Vault name required",
        description: "Please provide a name for your family heritage vault",
        variant: "destructive",
      });
      return false;
    }
    
    if (modules.length === 0) {
      toast({
        title: "No modules defined",
        description: "Please add at least one educational module to your vault",
        variant: "destructive",
      });
      return false;
    }
    
    if (beneficiaries.length === 0) {
      toast({
        title: "No beneficiaries defined",
        description: "Please add at least one beneficiary to your vault",
        variant: "destructive",
      });
      return false;
    }
    
    if (totalAllocation !== 100) {
      toast({
        title: "Invalid allocation percentages",
        description: `Beneficiary allocations must add up to 100%. Current total: ${totalAllocation}%`,
        variant: "destructive",
      });
      return false;
    }
    
    if (enableTrustees && trustees.length === 0) {
      toast({
        title: "No trustees defined",
        description: "Please add at least one trustee or disable trustee verification",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };
  
  // Simulated vault deployment
  const deployVault = () => {
    if (!validateForm()) return;
    
    setIsDeploying(true);
    setDeploymentProgress(0);
    
    // Simulate deployment process
    const deployInterval = setInterval(() => {
      setDeploymentProgress(prev => {
        if (prev >= 100) {
          clearInterval(deployInterval);
          setIsDeploying(false);
          
          // Generate fake vault ID
          const randomHex = [...Array(16)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
          setVaultId(`heritage-${randomHex}`);
          
          setIsSuccess(true);
          toast({
            title: "Vault creation successful",
            description: "Your family heritage vault has been successfully created",
          });
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };
  
  // Get module type icon
  const getModuleTypeIcon = (type: InheritanceModule['type']) => {
    switch(type) {
      case 'financial':
        return <HeartHandshake className="h-5 w-5 text-[#E040FB]" />;
      case 'educational':
        return <GraduationCap className="h-5 w-5 text-[#4CAF50]" />;
      case 'story':
        return <MessageCircle className="h-5 w-5 text-[#2196F3]" />;
      case 'media':
        return <FileText className="h-5 w-5 text-[#FF9800]" />;
      case 'values':
        return <BookOpen className="h-5 w-5 text-[#9C27B0]" />;
      case 'custom':
        return <FileText className="h-5 w-5 text-[#607D8B]" />;
      default:
        return <FileText className="h-5 w-5 text-[#E040FB]" />;
    }
  };
  
  // Get module type description
  const getModuleTypeDescription = (type: InheritanceModule['type']) => {
    switch(type) {
      case 'financial':
        return "Financial guidance, investment principles, and asset management";
      case 'educational':
        return "Educational content with learning objectives and assessments";
      case 'story':
        return "Personal stories, history, and memorable experiences";
      case 'media':
        return "Photos, videos, letters, and other digital artifacts";
      case 'values':
        return "Family values, ethical principles, and life philosophies";
      case 'custom':
        return "Customized content with any combination of elements";
      default:
        return "";
    }
  };
  
  // Get unlock condition description
  const getUnlockConditionDescription = (condition?: string) => {
    switch(condition) {
      case 'age':
        return "Upon reaching a specific age";
      case 'date':
        return "At a predefined calendar date";
      case 'education':
        return "After completing specific educational requirements";
      case 'quiz':
        return "After passing a comprehension assessment";
      case 'trustee':
        return "Upon trustee verification and approval";
      default:
        return "Immediately available";
    }
  };
  
  // Render success state
  if (isSuccess) {
    return (
      <div className="container mx-auto px-4 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-[#E040FB]/20 mb-8">
            <UsersRound className="h-12 w-12 text-[#E040FB]" />
          </div>
          
          <h1 className="text-3xl font-bold mb-4">Family Heritage Vault Created!</h1>
          <p className="text-xl text-gray-300 mb-8">
            Your family heritage vault has been successfully created with {modules.length} educational module{modules.length !== 1 ? 's' : ''} for {beneficiaries.length} beneficiar{beneficiaries.length !== 1 ? 'ies' : 'y'}.
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
                  className="text-[#E040FB] hover:text-[#E65FFC] hover:bg-[#E040FB]/10"
                >
                  Copy ID
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Inheritance Type</p>
                  <p className="text-white">
                    {inheritanceType === 'immediate' ? 'Immediate' : 
                     inheritanceType === 'phased' ? 'Phased' : 'Conditional'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Trustee Verification</p>
                  <p className="text-white">
                    {enableTrustees ? `Enabled (${trustees.length})` : 'Not Required'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Security Score</p>
                  <p className="text-white">{securityScore}/100</p>
                </div>
                <div>
                  <p className="text-gray-500">Educational Value</p>
                  <p className="text-white">{educationalScore}/100</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center">
            <Link href="/dashboard">
              <Button 
                className="bg-gradient-to-r from-[#E040FB] to-[#6B00D7] hover:from-[#E65FFC] hover:to-[#7B10E7] text-white px-8 py-6 h-auto text-lg rounded-xl shadow-lg"
              >
                Go to Dashboard
              </Button>
            </Link>
            <Button 
              variant="outline"
              className="border-[#E040FB]/50 text-[#E040FB] hover:bg-[#E040FB]/10"
              onClick={() => {
                setIsSuccess(false);
                setVaultName('My Family Heritage Vault');
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
          <Button variant="ghost" className="mb-4 hover:bg-[#E040FB]/10">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Vault Types
          </Button>
        </Link>

        <div className="flex items-center mb-4">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#E040FB] to-[#6B00D7] flex items-center justify-center shadow-lg shadow-[#E040FB]/30 mr-4">
            <UsersRound className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#E040FB] to-[#6B00D7]">
            Family Heritage Vault
          </h1>
        </div>
        
        <p className="text-lg text-gray-300 max-w-3xl">
          Create a comprehensive inheritance plan that preserves not just your assets but also your values, wisdom, and legacy for future generations.
        </p>
        
        <div className="flex flex-wrap gap-3 mt-4">
          <Badge variant="secondary" className="bg-[#E040FB]/20 text-[#E040FB] border-[#E040FB]/50">
            <UsersRound className="h-3 w-3 mr-1" /> Generational Wealth
          </Badge>
          <Badge variant="secondary" className="bg-[#6B00D7]/20 text-[#6B00D7] border-[#6B00D7]/50">
            <GraduationCap className="h-3 w-3 mr-1" /> Educational Components
          </Badge>
          <Badge variant="secondary" className="bg-[#00E676]/20 text-[#00E676] border-[#00E676]/50">
            <BookOpen className="h-3 w-3 mr-1" /> Family Legacy
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
              <TabsTrigger value="basics" className="data-[state=active]:bg-[#E040FB]/30">
                <div className="flex flex-col items-center py-1">
                  <FileText className="h-5 w-5 mb-1" />
                  <span>Basics</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="modules" className="data-[state=active]:bg-[#6B00D7]/30">
                <div className="flex flex-col items-center py-1">
                  <GraduationCap className="h-5 w-5 mb-1" />
                  <span>Modules</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="beneficiaries" className="data-[state=active]:bg-[#00E676]/30">
                <div className="flex flex-col items-center py-1">
                  <User className="h-5 w-5 mb-1" />
                  <span>Beneficiaries</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="trustees" className="data-[state=active]:bg-[#FF9800]/30">
                <div className="flex flex-col items-center py-1">
                  <Shield className="h-5 w-5 mb-1" />
                  <span>Trustees</span>
                </div>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="basics" className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Vault Details</h2>
                
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
                      className="bg-black/30 border-gray-700"
                      placeholder="Add details about the purpose of this inheritance plan and your wishes for future generations"
                    />
                  </div>
                </div>
                
                <Separator className="my-6 bg-gray-800" />
                
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Inheritance Type</h2>
                  <p className="text-sm text-gray-400">
                    Choose how your inheritance will be distributed to beneficiaries
                  </p>
                  
                  <RadioGroup 
                    value={inheritanceType} 
                    onValueChange={(value) => setInheritanceType(value as 'immediate' | 'phased' | 'conditional')}
                    className="grid grid-cols-1 gap-3 mt-2"
                  >
                    <div className="flex items-center space-x-2 border border-gray-800 rounded-lg p-3 hover:bg-[#E040FB]/5 cursor-pointer">
                      <RadioGroupItem value="immediate" id="immediate" className="text-[#E040FB]" />
                      <Label htmlFor="immediate" className="cursor-pointer flex-1">
                        <div className="flex flex-col">
                          <span className="font-medium">Immediate Release</span>
                          <span className="text-sm text-gray-400">All assets become available immediately upon activation</span>
                        </div>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2 border border-gray-800 rounded-lg p-3 hover:bg-[#E040FB]/5 cursor-pointer">
                      <RadioGroupItem value="phased" id="phased" className="text-[#E040FB]" />
                      <Label htmlFor="phased" className="cursor-pointer flex-1">
                        <div className="flex flex-col">
                          <span className="font-medium">Phased Release</span>
                          <span className="text-sm text-gray-400">Assets released gradually over time according to schedule</span>
                        </div>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2 border border-gray-800 rounded-lg p-3 hover:bg-[#E040FB]/5 cursor-pointer">
                      <RadioGroupItem value="conditional" id="conditional" className="text-[#E040FB]" />
                      <Label htmlFor="conditional" className="cursor-pointer flex-1">
                        <div className="flex flex-col">
                          <span className="font-medium">Conditional Release</span>
                          <span className="text-sm text-gray-400">Assets released based on meeting specific conditions or milestones</span>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <Separator className="my-6 bg-gray-800" />
                
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Additional Features</h2>
                  
                  <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                    <div>
                      <Label htmlFor="require-education" className="cursor-pointer font-medium">
                        Educational Requirements
                      </Label>
                      <p className="text-sm text-gray-400">
                        Beneficiaries must complete educational modules before receiving assets
                      </p>
                    </div>
                    <Switch 
                      id="require-education"
                      checked={requireEducation}
                      onCheckedChange={setRequireEducation}
                      className="data-[state=checked]:bg-[#E040FB]"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between border-b border-gray-800 py-4">
                    <div>
                      <Label htmlFor="digital-time-capsule" className="cursor-pointer font-medium">
                        Digital Time Capsule
                      </Label>
                      <p className="text-sm text-gray-400">
                        Include stories, photos, videos, and messages for future generations
                      </p>
                    </div>
                    <Switch 
                      id="digital-time-capsule"
                      checked={enableDigitalTimeCapsule}
                      onCheckedChange={setEnableDigitalTimeCapsule}
                      className="data-[state=checked]:bg-[#E040FB]"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between border-b border-gray-800 py-4">
                    <div>
                      <Label htmlFor="enable-trustees" className="cursor-pointer font-medium">
                        Trustee Verification
                      </Label>
                      <p className="text-sm text-gray-400">
                        Trusted individuals who can help oversee and execute your wishes
                      </p>
                    </div>
                    <Switch 
                      id="enable-trustees"
                      checked={enableTrustees}
                      onCheckedChange={setEnableTrustees}
                      className="data-[state=checked]:bg-[#E040FB]"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between pt-4">
                    <div>
                      <Label htmlFor="legal-integration" className="cursor-pointer font-medium">
                        Legal Document Integration
                      </Label>
                      <p className="text-sm text-gray-400">
                        Integrate with traditional legal documents and estate planning
                      </p>
                    </div>
                    <Switch 
                      id="legal-integration"
                      checked={enableLegalIntegration}
                      onCheckedChange={setEnableLegalIntegration}
                      className="data-[state=checked]:bg-[#E040FB]"
                    />
                  </div>
                </div>
              </div>
              
              <div className="pt-4 flex justify-end">
                <Button 
                  onClick={() => setCurrentTab('modules')}
                  className="bg-[#E040FB] hover:bg-[#E65FFC] text-white"
                >
                  Continue to Modules
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="modules" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Module List */}
                <div className="lg:col-span-1 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Educational Modules</h2>
                  </div>
                  
                  <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                    {modules.sort((a, b) => a.order - b.order).map((module) => (
                      <div 
                        key={module.id}
                        className={`flex items-center space-x-3 p-3 rounded-md cursor-pointer transition-colors ${
                          selectedModuleId === module.id 
                            ? 'bg-[#E040FB]/20 border border-[#E040FB]/40' 
                            : 'bg-black/20 border border-gray-800 hover:border-gray-700'
                        }`}
                        onClick={() => setSelectedModuleId(module.id)}
                      >
                        <div className="bg-black/30 h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0">
                          {getModuleTypeIcon(module.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{module.title}</p>
                          <div className="flex items-center text-xs text-gray-400">
                            <span className="truncate">
                              {module.type.charAt(0).toUpperCase() + module.type.slice(1)}
                            </span>
                            {module.required && (
                              <Badge variant="outline" className="ml-2 text-[#E040FB] border-[#E040FB]/50 px-1.5 py-0">
                                Required
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full border-dashed flex items-center justify-center space-x-2 hover:bg-[#E040FB]/5 hover:border-[#E040FB]/30 border-gray-700"
                    onClick={addModule}
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Module</span>
                  </Button>
                </div>
                
                {/* Module Editor */}
                <div className="lg:col-span-2 space-y-4">
                  {selectedModule ? (
                    <>
                      <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Module Details</h2>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteModule(selectedModule.id)}
                            className="h-8 w-8 text-red-500 hover:text-red-400 hover:bg-red-500/10"
                            disabled={modules.length <= 1}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="module-title">Module Title</Label>
                          <Input 
                            id="module-title"
                            value={selectedModule.title}
                            onChange={(e) => updateModule(selectedModule.id, { title: e.target.value })}
                            className="bg-black/30 border-gray-700"
                          />
                        </div>
                        
                        <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                          <div>
                            <Label htmlFor="module-required" className="cursor-pointer font-medium">
                              Required Module
                            </Label>
                            <p className="text-sm text-gray-400">
                              This module must be completed by all beneficiaries
                            </p>
                          </div>
                          <Switch 
                            id="module-required"
                            checked={selectedModule.required}
                            onCheckedChange={(required) => updateModule(selectedModule.id, { required })}
                            className="data-[state=checked]:bg-[#E040FB]"
                          />
                        </div>
                        
                        <div className="space-y-3">
                          <Label>Module Type</Label>
                          <RadioGroup 
                            value={selectedModule.type} 
                            onValueChange={(value) => updateModule(selectedModule.id, { 
                              type: value as InheritanceModule['type'] 
                            })}
                            className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2"
                          >
                            {(['financial', 'educational', 'story', 'media', 'values', 'custom'] as const).map(type => (
                              <div 
                                key={type}
                                className="flex items-center space-x-2 border border-gray-800 rounded-lg p-3 hover:bg-[#E040FB]/5 cursor-pointer"
                              >
                                <RadioGroupItem value={type} id={`type-${type}`} className="text-[#E040FB]" />
                                <Label htmlFor={`type-${type}`} className="cursor-pointer flex-1">
                                  <div className="flex items-center">
                                    <div className="mr-2">
                                      {getModuleTypeIcon(type)}
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="font-medium">
                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                      </span>
                                      <span className="text-xs text-gray-400">{getModuleTypeDescription(type)}</span>
                                    </div>
                                  </div>
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="module-content">Content</Label>
                          <Textarea
                            id="module-content"
                            value={selectedModule.content}
                            onChange={(e) => updateModule(selectedModule.id, { content: e.target.value })}
                            className="bg-black/30 border-gray-700 min-h-32"
                            placeholder="Add the educational content, stories, or instructions for this module"
                          />
                        </div>
                        
                        <Separator className="my-4 bg-gray-800" />
                        
                        <div className="space-y-3">
                          <Label>Unlock Condition</Label>
                          <Select 
                            value={selectedModule.unlockCondition || 'none'} 
                            onValueChange={(value) => updateModule(selectedModule.id, { 
                              unlockCondition: value === 'none' ? undefined : value as InheritanceModule['unlockCondition'] 
                            })}
                          >
                            <SelectTrigger className="bg-black/30 border-gray-700">
                              <SelectValue placeholder="Select unlock condition" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">No Condition (Available Immediately)</SelectItem>
                              <SelectItem value="age">Age Requirement</SelectItem>
                              <SelectItem value="date">Specific Date</SelectItem>
                              <SelectItem value="education">Educational Requirement</SelectItem>
                              <SelectItem value="quiz">Quiz Completion</SelectItem>
                              <SelectItem value="trustee">Trustee Approval</SelectItem>
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-gray-400">
                            {getUnlockConditionDescription(selectedModule.unlockCondition)}
                          </p>
                        </div>
                        
                        {selectedModule.unlockCondition === 'age' && (
                          <div className="space-y-2">
                            <Label htmlFor="age-requirement">Minimum Age</Label>
                            <Input 
                              id="age-requirement"
                              type="number" 
                              min={18}
                              max={100}
                              value={selectedModule.unlockValue as number || 18}
                              onChange={(e) => updateModule(selectedModule.id, { unlockValue: parseInt(e.target.value) })}
                              className="bg-black/30 border-gray-700"
                            />
                          </div>
                        )}
                        
                        {selectedModule.unlockCondition === 'date' && (
                          <div className="space-y-2">
                            <Label htmlFor="date-requirement">Unlock Date</Label>
                            <Input 
                              id="date-requirement"
                              type="date" 
                              value={selectedModule.unlockValue as string || ''}
                              onChange={(e) => updateModule(selectedModule.id, { unlockValue: e.target.value })}
                              className="bg-black/30 border-gray-700"
                            />
                          </div>
                        )}
                        
                        {selectedModule.unlockCondition === 'quiz' && (
                          <div className="space-y-4 pl-4 border-l-2 border-[#E040FB]/30">
                            <div className="flex items-center justify-between">
                              <h3 className="text-sm font-medium text-gray-300">Quiz Questions</h3>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  // Add a new question
                                  const currentQuestions = selectedModule.quizQuestions || [];
                                  updateModule(selectedModule.id, {
                                    quizQuestions: [
                                      ...currentQuestions,
                                      {
                                        question: `Question ${currentQuestions.length + 1}`,
                                        options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
                                        correctAnswer: 0
                                      }
                                    ]
                                  });
                                }}
                                className="text-xs"
                              >
                                <Plus className="h-3 w-3 mr-1" />
                                Add Question
                              </Button>
                            </div>
                            
                            {(selectedModule.quizQuestions || []).map((q, idx) => (
                              <Card key={idx} className="bg-black/20 border border-gray-800">
                                <CardHeader className="p-3 pb-2">
                                  <div className="flex items-center justify-between">
                                    <CardTitle className="text-sm">Question {idx + 1}</CardTitle>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => {
                                        const questions = [...(selectedModule.quizQuestions || [])];
                                        questions.splice(idx, 1);
                                        updateModule(selectedModule.id, { quizQuestions: questions });
                                      }}
                                      className="h-6 w-6 text-red-500 hover:text-red-400 hover:bg-red-500/10"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </CardHeader>
                                <CardContent className="p-3 pt-0 space-y-2">
                                  <Input 
                                    value={q.question}
                                    onChange={(e) => {
                                      const questions = [...(selectedModule.quizQuestions || [])];
                                      questions[idx].question = e.target.value;
                                      updateModule(selectedModule.id, { quizQuestions: questions });
                                    }}
                                    className="bg-black/30 border-gray-700 text-sm"
                                    placeholder="Question text"
                                  />
                                  
                                  <div className="space-y-1.5 mt-2">
                                    {q.options.map((option, optIdx) => (
                                      <div key={optIdx} className="flex items-center space-x-2">
                                        <RadioGroup 
                                          value={q.correctAnswer.toString()} 
                                          onValueChange={(value) => {
                                            const questions = [...(selectedModule.quizQuestions || [])];
                                            questions[idx].correctAnswer = parseInt(value);
                                            updateModule(selectedModule.id, { quizQuestions: questions });
                                          }}
                                          className="flex items-center"
                                        >
                                          <RadioGroupItem 
                                            value={optIdx.toString()} 
                                            id={`q${idx}-opt${optIdx}`} 
                                            className="text-[#E040FB] h-4 w-4"
                                          />
                                        </RadioGroup>
                                        <Input 
                                          value={option}
                                          onChange={(e) => {
                                            const questions = [...(selectedModule.quizQuestions || [])];
                                            questions[idx].options[optIdx] = e.target.value;
                                            updateModule(selectedModule.id, { quizQuestions: questions });
                                          }}
                                          className="flex-1 bg-black/30 border-gray-700 text-xs h-7"
                                          placeholder={`Option ${optIdx + 1}`}
                                        />
                                      </div>
                                    ))}
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                            
                            {!selectedModule.quizQuestions?.length && (
                              <div className="text-center py-4 text-gray-500 text-sm">
                                No quiz questions added yet. Add a question to get started.
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-64 border border-dashed border-gray-700 rounded-md">
                      <GraduationCap className="h-10 w-10 text-gray-500 mb-2" />
                      <p className="text-gray-500">No module selected</p>
                      <Button
                        variant="ghost"
                        className="mt-4 text-[#E040FB] hover:text-[#E65FFC] hover:bg-[#E040FB]/10"
                        onClick={addModule}
                      >
                        Create your first module
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
                  onClick={() => setCurrentTab('beneficiaries')}
                  className="bg-[#6B00D7] hover:bg-[#7B10E7] text-white"
                >
                  Continue to Beneficiaries
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="beneficiaries" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Beneficiary List */}
                <div className="lg:col-span-1 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Beneficiaries</h2>
                    <Badge variant="outline" className={`
                      ${totalAllocation === 100 ? 'border-green-500 text-green-500' : 'border-red-500 text-red-500'}
                    `}>
                      {totalAllocation}%
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                    {beneficiaries.map((beneficiary) => (
                      <div 
                        key={beneficiary.id}
                        className={`flex items-center space-x-3 p-3 rounded-md cursor-pointer transition-colors ${
                          selectedBeneficiaryId === beneficiary.id 
                            ? 'bg-[#00E676]/20 border border-[#00E676]/40' 
                            : 'bg-black/20 border border-gray-800 hover:border-gray-700'
                        }`}
                        onClick={() => setSelectedBeneficiaryId(beneficiary.id)}
                      >
                        <div className="bg-black/30 h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="h-5 w-5 text-[#00E676]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{beneficiary.name}</p>
                          <div className="flex items-center text-xs text-gray-400">
                            <span className="truncate">{beneficiary.relationship}</span>
                            <Badge className="ml-2 bg-[#00E676]/20 text-[#00E676] px-1.5 py-0 text-xs">
                              {beneficiary.allocation}%
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full border-dashed flex items-center justify-center space-x-2 hover:bg-[#00E676]/5 hover:border-[#00E676]/30 border-gray-700"
                    onClick={addBeneficiary}
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Beneficiary</span>
                  </Button>
                  
                  {totalAllocation !== 100 && (
                    <Alert className="bg-red-500/10 border-red-500/30">
                      <div className="text-sm text-red-500">
                        Total allocation must equal 100%. Current total: {totalAllocation}%
                      </div>
                    </Alert>
                  )}
                </div>
                
                {/* Beneficiary Editor */}
                <div className="lg:col-span-2 space-y-4">
                  {selectedBeneficiary ? (
                    <>
                      <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Beneficiary Details</h2>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteBeneficiary(selectedBeneficiary.id)}
                          className="h-8 w-8 text-red-500 hover:text-red-400 hover:bg-red-500/10"
                          disabled={beneficiaries.length <= 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="beneficiary-name">Name</Label>
                            <Input 
                              id="beneficiary-name"
                              value={selectedBeneficiary.name}
                              onChange={(e) => updateBeneficiary(selectedBeneficiary.id, { name: e.target.value })}
                              className="bg-black/30 border-gray-700"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="beneficiary-relationship">Relationship</Label>
                            <Select 
                              value={selectedBeneficiary.relationship} 
                              onValueChange={(value) => updateBeneficiary(selectedBeneficiary.id, { relationship: value })}
                            >
                              <SelectTrigger id="beneficiary-relationship" className="bg-black/30 border-gray-700">
                                <SelectValue placeholder="Select relationship" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Child">Child</SelectItem>
                                <SelectItem value="Spouse">Spouse</SelectItem>
                                <SelectItem value="Sibling">Sibling</SelectItem>
                                <SelectItem value="Grandchild">Grandchild</SelectItem>
                                <SelectItem value="Parent">Parent</SelectItem>
                                <SelectItem value="Friend">Friend</SelectItem>
                                <SelectItem value="Other Family">Other Family</SelectItem>
                                <SelectItem value="Organization">Organization</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="beneficiary-email">Email Address (Optional)</Label>
                            <Input 
                              id="beneficiary-email"
                              type="email"
                              value={selectedBeneficiary.email || ''}
                              onChange={(e) => updateBeneficiary(selectedBeneficiary.id, { email: e.target.value })}
                              className="bg-black/30 border-gray-700"
                              placeholder="email@example.com"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="beneficiary-birthdate">Birthdate (Optional)</Label>
                            <Input 
                              id="beneficiary-birthdate"
                              type="date"
                              value={selectedBeneficiary.birthdate || ''}
                              onChange={(e) => updateBeneficiary(selectedBeneficiary.id, { birthdate: e.target.value })}
                              className="bg-black/30 border-gray-700"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label htmlFor="beneficiary-allocation">Inheritance Allocation</Label>
                            <span>{selectedBeneficiary.allocation}%</span>
                          </div>
                          <Slider
                            id="beneficiary-allocation"
                            min={0}
                            max={100}
                            step={1}
                            value={[selectedBeneficiary.allocation]}
                            onValueChange={(value) => updateBeneficiary(selectedBeneficiary.id, { allocation: value[0] })}
                            className="[&>span]:bg-[#00E676]"
                          />
                          <div className="flex justify-between text-xs text-gray-400">
                            <span>0%</span>
                            <span>100%</span>
                          </div>
                        </div>
                        
                        <Separator className="my-4 bg-gray-800" />
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h3 className="text-base font-medium">Assigned Educational Modules</h3>
                            <Badge className="bg-[#00E676]/20 text-[#00E676] border-[#00E676]/50">
                              {selectedBeneficiary.modules.length} assigned
                            </Badge>
                          </div>
                          
                          <div className="max-h-64 overflow-y-auto space-y-2 pr-2">
                            {modules.sort((a, b) => a.order - b.order).map((module) => {
                              const isAssigned = selectedBeneficiary.modules.includes(module.id);
                              const isRequired = module.required;
                              
                              return (
                                <div 
                                  key={module.id}
                                  className={`flex items-center p-3 rounded-md border ${
                                    isAssigned 
                                      ? 'bg-[#00E676]/10 border-[#00E676]/30' 
                                      : 'bg-black/20 border-gray-800'
                                  }`}
                                >
                                  <Checkbox
                                    checked={isAssigned}
                                    onCheckedChange={() => toggleModuleForBeneficiary(selectedBeneficiary.id, module.id)}
                                    className="mr-3 text-[#00E676] border-gray-600 data-[state=checked]:border-[#00E676] data-[state=checked]:bg-[#00E676]"
                                    disabled={isRequired}
                                  />
                                  
                                  <div className="flex-1">
                                    <div className="font-medium text-sm flex items-center">
                                      {module.title}
                                      {isRequired && (
                                        <Badge className="ml-2 bg-[#E040FB]/20 text-[#E040FB] border-[#E040FB]/50 text-xs">
                                          Required
                                        </Badge>
                                      )}
                                    </div>
                                    <div className="flex items-center text-xs text-gray-400">
                                      <span>{module.type.charAt(0).toUpperCase() + module.type.slice(1)}</span>
                                      {module.unlockCondition && (
                                        <span className="ml-1 text-gray-500"> • {getUnlockConditionDescription(module.unlockCondition)}</span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                            
                            {modules.length === 0 && (
                              <div className="text-center py-4 text-gray-500 text-sm border border-dashed border-gray-700 rounded-md">
                                No modules created yet. Add modules in the Modules tab.
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-64 border border-dashed border-gray-700 rounded-md">
                      <User className="h-10 w-10 text-gray-500 mb-2" />
                      <p className="text-gray-500">No beneficiary selected</p>
                      <Button
                        variant="ghost"
                        className="mt-4 text-[#00E676] hover:text-[#20F696] hover:bg-[#00E676]/10"
                        onClick={addBeneficiary}
                      >
                        Add a beneficiary
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="pt-4 flex justify-between">
                <Button 
                  variant="outline"
                  onClick={() => setCurrentTab('modules')}
                >
                  Back
                </Button>
                <Button 
                  onClick={() => setCurrentTab('trustees')}
                  className="bg-[#FF9800] hover:bg-[#FFA726] text-white"
                >
                  Continue to Trustees
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="trustees" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Trustee List */}
                <div className="lg:col-span-1 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Trustees</h2>
                    {!enableTrustees && (
                      <Badge variant="outline" className="border-amber-500 text-amber-500">
                        Optional
                      </Badge>
                    )}
                  </div>
                  
                  {!enableTrustees && (
                    <Alert className="bg-amber-500/10 border-amber-500/30">
                      <div className="text-sm text-amber-500">
                        Trustee verification is currently disabled. 
                        <Button 
                          variant="link" 
                          className="text-amber-500 px-1 py-0 h-auto"
                          onClick={() => {
                            setEnableTrustees(true);
                            if (trustees.length === 0) {
                              addTrustee();
                            }
                          }}
                        >
                          Enable it
                        </Button> 
                        to add trustees to your vault.
                      </div>
                    </Alert>
                  )}
                  
                  <div className="space-y-2 max-h-[450px] overflow-y-auto pr-2">
                    {trustees.map((trustee) => (
                      <div 
                        key={trustee.id}
                        className={`flex items-center space-x-3 p-3 rounded-md cursor-pointer transition-colors ${
                          selectedTrusteeId === trustee.id 
                            ? 'bg-[#FF9800]/20 border border-[#FF9800]/40' 
                            : 'bg-black/20 border border-gray-800 hover:border-gray-700'
                        }`}
                        onClick={() => setSelectedTrusteeId(trustee.id)}
                      >
                        <div className="bg-black/30 h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0">
                          <Shield className="h-5 w-5 text-[#FF9800]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{trustee.name}</p>
                          <div className="flex items-center text-xs text-gray-400">
                            <Badge className="bg-[#FF9800]/20 text-[#FF9800] border-[#FF9800]/50 text-xs px-1.5 py-0">
                              {trustee.role.charAt(0).toUpperCase() + trustee.role.slice(1)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full border-dashed flex items-center justify-center space-x-2 hover:bg-[#FF9800]/5 hover:border-[#FF9800]/30 border-gray-700"
                    onClick={addTrustee}
                    disabled={!enableTrustees}
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Trustee</span>
                  </Button>
                </div>
                
                {/* Trustee Editor */}
                <div className="lg:col-span-2 space-y-4">
                  {selectedTrustee ? (
                    <>
                      <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Trustee Details</h2>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteTrustee(selectedTrustee.id)}
                          className="h-8 w-8 text-red-500 hover:text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="trustee-name">Trustee Name</Label>
                          <Input 
                            id="trustee-name"
                            value={selectedTrustee.name}
                            onChange={(e) => updateTrustee(selectedTrustee.id, { name: e.target.value })}
                            className="bg-black/30 border-gray-700"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="trustee-email">Email Address</Label>
                          <Input 
                            id="trustee-email"
                            type="email"
                            value={selectedTrustee.email}
                            onChange={(e) => updateTrustee(selectedTrustee.id, { email: e.target.value })}
                            className="bg-black/30 border-gray-700"
                            placeholder="email@example.com"
                          />
                        </div>
                        
                        <div className="space-y-3">
                          <Label>Trustee Role</Label>
                          <RadioGroup 
                            value={selectedTrustee.role} 
                            onValueChange={(value) => updateTrustee(selectedTrustee.id, { 
                              role: value as Trustee['role'] 
                            })}
                            className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2"
                          >
                            <div className="flex items-center space-x-2 border border-gray-800 rounded-lg p-3 hover:bg-[#FF9800]/5 cursor-pointer">
                              <RadioGroupItem value="primary" id="role-primary" className="text-[#FF9800]" />
                              <Label htmlFor="role-primary" className="cursor-pointer flex-1">
                                <div className="flex flex-col">
                                  <span className="font-medium">Primary</span>
                                  <span className="text-xs text-gray-400">Main trustee with full permissions</span>
                                </div>
                              </Label>
                            </div>
                            
                            <div className="flex items-center space-x-2 border border-gray-800 rounded-lg p-3 hover:bg-[#FF9800]/5 cursor-pointer">
                              <RadioGroupItem value="secondary" id="role-secondary" className="text-[#FF9800]" />
                              <Label htmlFor="role-secondary" className="cursor-pointer flex-1">
                                <div className="flex flex-col">
                                  <span className="font-medium">Secondary</span>
                                  <span className="text-xs text-gray-400">Backup with limited permissions</span>
                                </div>
                              </Label>
                            </div>
                            
                            <div className="flex items-center space-x-2 border border-gray-800 rounded-lg p-3 hover:bg-[#FF9800]/5 cursor-pointer">
                              <RadioGroupItem value="advisor" id="role-advisor" className="text-[#FF9800]" />
                              <Label htmlFor="role-advisor" className="cursor-pointer flex-1">
                                <div className="flex flex-col">
                                  <span className="font-medium">Advisor</span>
                                  <span className="text-xs text-gray-400">Oversees but doesn't approve</span>
                                </div>
                              </Label>
                            </div>
                          </RadioGroup>
                        </div>
                        
                        <Separator className="my-4 bg-gray-800" />
                        
                        <div className="space-y-3">
                          <h3 className="text-base font-medium">Trustee Permissions</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="flex items-center space-x-2 border border-gray-800 rounded-lg p-3">
                              <Checkbox
                                id="permission-verify"
                                checked={selectedTrustee.permissions.includes('verify')}
                                onCheckedChange={() => togglePermissionForTrustee(selectedTrustee.id, 'verify')}
                                className="text-[#FF9800] border-gray-600 data-[state=checked]:border-[#FF9800] data-[state=checked]:bg-[#FF9800]"
                              />
                              <Label htmlFor="permission-verify" className="cursor-pointer flex-1">
                                <div className="flex flex-col">
                                  <span className="font-medium">Verify Milestones</span>
                                  <span className="text-xs text-gray-400">Confirm beneficiary completed requirements</span>
                                </div>
                              </Label>
                            </div>
                            
                            <div className="flex items-center space-x-2 border border-gray-800 rounded-lg p-3">
                              <Checkbox
                                id="permission-approve"
                                checked={selectedTrustee.permissions.includes('approve')}
                                onCheckedChange={() => togglePermissionForTrustee(selectedTrustee.id, 'approve')}
                                className="text-[#FF9800] border-gray-600 data-[state=checked]:border-[#FF9800] data-[state=checked]:bg-[#FF9800]"
                              />
                              <Label htmlFor="permission-approve" className="cursor-pointer flex-1">
                                <div className="flex flex-col">
                                  <span className="font-medium">Approve Releases</span>
                                  <span className="text-xs text-gray-400">Authorize asset releases to beneficiaries</span>
                                </div>
                              </Label>
                            </div>
                            
                            <div className="flex items-center space-x-2 border border-gray-800 rounded-lg p-3">
                              <Checkbox
                                id="permission-monitor"
                                checked={selectedTrustee.permissions.includes('monitor')}
                                onCheckedChange={() => togglePermissionForTrustee(selectedTrustee.id, 'monitor')}
                                className="text-[#FF9800] border-gray-600 data-[state=checked]:border-[#FF9800] data-[state=checked]:bg-[#FF9800]"
                              />
                              <Label htmlFor="permission-monitor" className="cursor-pointer flex-1">
                                <div className="flex flex-col">
                                  <span className="font-medium">Monitor Activity</span>
                                  <span className="text-xs text-gray-400">View vault status and beneficiary progress</span>
                                </div>
                              </Label>
                            </div>
                            
                            <div className="flex items-center space-x-2 border border-gray-800 rounded-lg p-3">
                              <Checkbox
                                id="permission-emergency"
                                checked={selectedTrustee.permissions.includes('emergency')}
                                onCheckedChange={() => togglePermissionForTrustee(selectedTrustee.id, 'emergency')}
                                className="text-[#FF9800] border-gray-600 data-[state=checked]:border-[#FF9800] data-[state=checked]:bg-[#FF9800]"
                              />
                              <Label htmlFor="permission-emergency" className="cursor-pointer flex-1">
                                <div className="flex flex-col">
                                  <span className="font-medium">Emergency Access</span>
                                  <span className="text-xs text-gray-400">Initiate emergency protocols if needed</span>
                                </div>
                              </Label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : enableTrustees ? (
                    <div className="flex flex-col items-center justify-center h-64 border border-dashed border-gray-700 rounded-md">
                      <Shield className="h-10 w-10 text-gray-500 mb-2" />
                      <p className="text-gray-500">No trustee selected</p>
                      <Button
                        variant="ghost"
                        className="mt-4 text-[#FF9800] hover:text-[#FFA726] hover:bg-[#FF9800]/10"
                        onClick={addTrustee}
                      >
                        Add a trustee
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-center">
                      <Shield className="h-16 w-16 text-gray-500 mb-4" />
                      <h3 className="text-xl font-medium text-gray-300 mb-2">Trustee Verification</h3>
                      <p className="text-gray-400 max-w-md mb-6">
                        Trustees help oversee your inheritance plan, verify educational milestones, and ensure your wishes are carried out properly.
                      </p>
                      <Button
                        onClick={() => {
                          setEnableTrustees(true);
                          addTrustee();
                        }}
                        className="bg-[#FF9800] hover:bg-[#FFA726] text-white"
                      >
                        Enable Trustee Verification
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="pt-6 space-y-6">
                {!isDeploying ? (
                  <Button 
                    onClick={deployVault}
                    className="w-full bg-gradient-to-r from-[#E040FB] to-[#6B00D7] hover:from-[#E65FFC] hover:to-[#7B10E7] text-white h-12 text-lg font-semibold"
                  >
                    Create Family Heritage Vault
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Creating Family Heritage Vault...</span>
                      <span>{deploymentProgress}%</span>
                    </div>
                    <Progress value={deploymentProgress} className="h-2 [&>div]:bg-[#E040FB]" />
                    <p className="text-sm text-gray-400">
                      {deploymentProgress < 30 && "Setting up vault architecture..."}
                      {deploymentProgress >= 30 && deploymentProgress < 60 && "Configuring educational modules..."}
                      {deploymentProgress >= 60 && deploymentProgress < 90 && "Setting up beneficiary access..."}
                      {deploymentProgress >= 90 && "Finalizing vault creation..."}
                    </p>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <Button 
                    variant="outline"
                    onClick={() => setCurrentTab('beneficiaries')}
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
            <div className="h-2 bg-gradient-to-r from-[#E040FB] to-[#6B00D7]" />
            <CardHeader>
              <CardTitle>Security Score</CardTitle>
              <CardDescription>
                Rating based on your inheritance configuration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm text-gray-300">Security Rating</span>
                <span className={`font-bold text-xl ${
                  securityScore >= 80 ? 'text-green-500' : 
                  securityScore >= 60 ? 'text-amber-500' : 
                  'text-red-500'
                }`}>
                  {securityScore}%
                </span>
              </div>
              <div className="w-full bg-gray-800 h-3 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${
                    securityScore >= 80 ? 'bg-green-500' : 
                    securityScore >= 60 ? 'bg-amber-500' : 
                    'bg-red-500'
                  }`} 
                  style={{ width: `${securityScore}%` }}
                />
              </div>
              
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Trustee Verification</span>
                  <Badge variant="outline" className={`
                    ${enableTrustees && trustees.length >= 2
                      ? 'border-green-500 text-green-500'
                      : enableTrustees
                        ? 'border-amber-500 text-amber-500'
                        : 'border-red-500 text-red-500'
                    }
                  `}>
                    {enableTrustees && trustees.length >= 2
                      ? 'Strong'
                      : enableTrustees
                        ? 'Basic'
                        : 'Disabled'}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Inheritance Type</span>
                  <Badge variant="outline" className={`
                    ${inheritanceType === 'conditional'
                      ? 'border-green-500 text-green-500'
                      : inheritanceType === 'phased'
                        ? 'border-amber-500 text-amber-500'
                        : 'border-red-500 text-red-500'
                    }
                  `}>
                    {inheritanceType === 'conditional'
                      ? 'Conditional'
                      : inheritanceType === 'phased'
                        ? 'Phased'
                        : 'Immediate'}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Educational Requirements</span>
                  <Badge variant="outline" className={`
                    ${requireEducation
                      ? 'border-green-500 text-green-500'
                      : 'border-red-500 text-red-500'
                    }
                  `}>
                    {requireEducation ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Legal Integration</span>
                  <Badge variant="outline" className={`
                    ${enableLegalIntegration
                      ? 'border-green-500 text-green-500'
                      : 'border-red-500 text-red-500'
                    }
                  `}>
                    {enableLegalIntegration ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-black/30 backdrop-blur-sm border-gray-800 overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-[#E040FB] to-[#6B00D7]" />
            <CardHeader>
              <CardTitle>Educational Value</CardTitle>
              <CardDescription>
                Rating based on educational components
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm text-gray-300">Educational Quality</span>
                <span className={`font-bold text-xl ${
                  educationalScore >= 80 ? 'text-green-500' : 
                  educationalScore >= 60 ? 'text-amber-500' : 
                  'text-red-500'
                }`}>
                  {educationalScore}%
                </span>
              </div>
              <div className="w-full bg-gray-800 h-3 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${
                    educationalScore >= 80 ? 'bg-green-500' : 
                    educationalScore >= 60 ? 'bg-amber-500' : 
                    'bg-red-500'
                  }`} 
                  style={{ width: `${educationalScore}%` }}
                />
              </div>
              
              <div className="space-y-2 pt-2">
                <div className="text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Educational Modules</span>
                    <span>{modules.filter(m => m.type === 'educational' || m.type === 'financial').length} modules</span>
                  </div>
                </div>
                
                <div className="text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Value/Story Modules</span>
                    <span>{modules.filter(m => m.type === 'values' || m.type === 'story').length} modules</span>
                  </div>
                </div>
                
                <div className="text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Quiz Assessments</span>
                    <span>
                      {modules.filter(m => m.unlockCondition === 'quiz' && m.quizQuestions?.length).length} quizzes
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Alert className="bg-[#E040FB]/10 border-[#E040FB]/30">
            <BookOpen className="h-4 w-4 text-[#E040FB]" />
            <AlertTitle className="text-[#E040FB]">Family Legacy</AlertTitle>
            <AlertDescription className="text-gray-300">
              Family Heritage Vaults combine wealth transfer with educational resources to ensure your legacy and values endure for generations.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
};

export default FamilyHeritageVaultForm;