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
  Trophy,
  Target, 
  Unlock, 
  Shield, 
  Award,
  Plus,
  Trash2,
  Calendar,
  CheckCircle2,
  FileText,
  Clock,
  ArrowUpRight,
  Clock8,
  Users,
  LucideGlobe
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

// Enum for verification types
enum VerificationType {
  SELF_REPORTED = 'self_reported',
  THIRD_PARTY = 'third_party',
  SMART_CONTRACT = 'smart_contract',
  MULTI_SIGNATURE = 'multi_signature'
}

// Enum for milestone types
enum MilestoneType {
  ACHIEVEMENT = 'achievement',
  TIME_BASED = 'time_based',
  EDUCATIONAL = 'educational',
  FINANCIAL = 'financial',
  PERSONAL = 'personal',
  CUSTOM = 'custom'
}

// Milestone interface
interface Milestone {
  id: string;
  title: string;
  description: string;
  percentage: number; // Percentage of total assets to unlock
  verificationType: VerificationType;
  deadline?: Date;
  verifiers?: string[]; // List of wallet addresses or emails for multi-signature verification
  verificationsRequired?: number; // Number of verifications required for multi-signature
  completionCriteria?: string;
  type: MilestoneType;
  order: number;
}

const MilestoneBasedVaultForm: React.FC = () => {
  const { toast } = useToast();
  
  // Form state
  const [vaultName, setVaultName] = useState<string>('My Milestone Vault');
  const [vaultDescription, setVaultDescription] = useState<string>('');
  const [milestones, setMilestones] = useState<Milestone[]>([
    {
      id: `milestone-${Date.now()}`,
      title: 'First Milestone',
      description: 'Complete your first milestone to unlock assets',
      percentage: 25,
      verificationType: VerificationType.SELF_REPORTED,
      type: MilestoneType.ACHIEVEMENT,
      order: 1
    }
  ]);
  
  // Settings
  const [allowPartialUnlock, setAllowPartialUnlock] = useState<boolean>(true);
  const [requireSequentialCompletion, setRequireSequentialCompletion] = useState<boolean>(true);
  const [enableNotifications, setEnableNotifications] = useState<boolean>(true);
  const [enableEmergencyAccess, setEnableEmergencyAccess] = useState<boolean>(false);
  const [emergencyEmail, setEmergencyEmail] = useState<string>('');
  const [emergencyDelay, setEmergencyDelay] = useState<number>(30); // days
  const [requireProof, setRequireProof] = useState<boolean>(true);
  
  // UI state
  const [currentTab, setCurrentTab] = useState<string>('basics');
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string | null>(milestones[0]?.id || null);
  const [totalPercentage, setTotalPercentage] = useState<number>(milestones.reduce((sum, m) => sum + m.percentage, 0));
  const [securityScore, setSecurityScore] = useState<number>(0);
  const [deploymentProgress, setDeploymentProgress] = useState<number>(0);
  const [isDeploying, setIsDeploying] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [vaultId, setVaultId] = useState<string>('');
  
  // Update total percentage when milestones change
  useEffect(() => {
    const total = milestones.reduce((sum, m) => sum + m.percentage, 0);
    setTotalPercentage(total);
  }, [milestones]);
  
  // Update security score
  useEffect(() => {
    let score = 40; // Base score
    
    // Add points for verification methods
    const hasHighSecurityVerification = milestones.some(m => 
      m.verificationType === VerificationType.MULTI_SIGNATURE || 
      m.verificationType === VerificationType.SMART_CONTRACT
    );
    
    if (hasHighSecurityVerification) score += 20;
    else if (milestones.some(m => m.verificationType === VerificationType.THIRD_PARTY)) score += 10;
    
    // Add points for settings
    if (requireProof) score += 10;
    if (requireSequentialCompletion) score += 5;
    if (enableEmergencyAccess && emergencyEmail) score += 10;
    
    // Add points for milestone quality
    if (milestones.length >= 3) score += 10;
    if (milestones.every(m => m.description && m.description.length > 10)) score += 5;
    
    // Cap at 100
    setSecurityScore(Math.min(score, 100));
  }, [
    milestones, 
    requireProof, 
    requireSequentialCompletion, 
    enableEmergencyAccess, 
    emergencyEmail
  ]);
  
  // Get selected milestone
  const selectedMilestone = milestones.find(m => m.id === selectedMilestoneId) || null;
  
  // Add new milestone
  const addMilestone = () => {
    const newMilestone: Milestone = {
      id: `milestone-${Date.now()}`,
      title: `Milestone ${milestones.length + 1}`,
      description: '',
      percentage: Math.max(0, Math.min(100 - totalPercentage, 25)), // Default 25% or remaining percentage
      verificationType: VerificationType.SELF_REPORTED,
      type: MilestoneType.ACHIEVEMENT,
      order: milestones.length + 1
    };
    
    setMilestones([...milestones, newMilestone]);
    setSelectedMilestoneId(newMilestone.id);
  };
  
  // Update milestone
  const updateMilestone = (id: string, updates: Partial<Milestone>) => {
    setMilestones(milestones.map(milestone => 
      milestone.id === id ? { ...milestone, ...updates } : milestone
    ));
  };
  
  // Delete milestone
  const deleteMilestone = (id: string) => {
    // Don't allow deleting the last milestone
    if (milestones.length <= 1) {
      toast({
        title: "Cannot delete milestone",
        description: "You need at least one milestone for your vault",
        variant: "destructive",
      });
      return;
    }
    
    const updatedMilestones = milestones
      .filter(m => m.id !== id)
      // Re-order the remaining milestones
      .map((m, idx) => ({ ...m, order: idx + 1 }));
    
    setMilestones(updatedMilestones);
    
    // Select another milestone if the deleted one was selected
    if (selectedMilestoneId === id) {
      setSelectedMilestoneId(updatedMilestones[0]?.id || null);
    }
  };
  
  // Move milestone up or down
  const reorderMilestone = (id: string, direction: 'up' | 'down') => {
    const milestone = milestones.find(m => m.id === id);
    if (!milestone) return;
    
    const currentOrder = milestone.order;
    const newOrder = direction === 'up' ? currentOrder - 1 : currentOrder + 1;
    
    // Check if new order is valid
    if (newOrder < 1 || newOrder > milestones.length) return;
    
    setMilestones(milestones.map(m => {
      if (m.id === id) {
        return { ...m, order: newOrder };
      } else if (m.order === newOrder) {
        return { ...m, order: currentOrder };
      }
      return m;
    }).sort((a, b) => a.order - b.order));
  };
  
  // Validate form
  const validateForm = (): boolean => {
    if (!vaultName.trim()) {
      toast({
        title: "Vault name required",
        description: "Please provide a name for your milestone-based vault",
        variant: "destructive",
      });
      return false;
    }
    
    if (milestones.length === 0) {
      toast({
        title: "No milestones defined",
        description: "Please add at least one milestone to your vault",
        variant: "destructive",
      });
      return false;
    }
    
    if (totalPercentage !== 100) {
      toast({
        title: "Invalid milestone percentages",
        description: `Milestone percentages must add up to 100%. Current total: ${totalPercentage}%`,
        variant: "destructive",
      });
      return false;
    }
    
    // Check if all milestones have titles
    const emptyTitleMilestone = milestones.find(m => !m.title.trim());
    if (emptyTitleMilestone) {
      toast({
        title: "Missing milestone title",
        description: `Please provide a title for all milestones`,
        variant: "destructive",
      });
      setSelectedMilestoneId(emptyTitleMilestone.id);
      setCurrentTab('milestones');
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
          setVaultId(`milestone-${randomHex}`);
          
          setIsSuccess(true);
          toast({
            title: "Vault creation successful",
            description: "Your milestone-based vault has been successfully created",
          });
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };
  
  // Get verification type description
  const getVerificationTypeDescription = (type: VerificationType) => {
    switch(type) {
      case VerificationType.SELF_REPORTED:
        return "Self-verification of milestone completion";
      case VerificationType.THIRD_PARTY:
        return "Trusted third party confirms milestone completion";
      case VerificationType.SMART_CONTRACT:
        return "Automatic verification using on-chain data";
      case VerificationType.MULTI_SIGNATURE:
        return "Multiple people must confirm milestone completion";
      default:
        return "";
    }
  };
  
  // Get milestone type description
  const getMilestoneTypeDescription = (type: MilestoneType) => {
    switch(type) {
      case MilestoneType.ACHIEVEMENT:
        return "Specific goal or accomplishment";
      case MilestoneType.TIME_BASED:
        return "Completion based on reaching a specific date";
      case MilestoneType.EDUCATIONAL:
        return "Learning or educational milestone";
      case MilestoneType.FINANCIAL:
        return "Financial goal or target";
      case MilestoneType.PERSONAL:
        return "Personal growth or development goal";
      case MilestoneType.CUSTOM:
        return "Custom milestone with specific criteria";
      default:
        return "";
    }
  };
  
  // Get milestone icon
  const getMilestoneTypeIcon = (type: MilestoneType) => {
    switch(type) {
      case MilestoneType.ACHIEVEMENT:
        return <Trophy className="h-5 w-5 text-[#FF9800]" />;
      case MilestoneType.TIME_BASED:
        return <Clock className="h-5 w-5 text-[#2196F3]" />;
      case MilestoneType.EDUCATIONAL:
        return <FileText className="h-5 w-5 text-[#4CAF50]" />;
      case MilestoneType.FINANCIAL:
        return <ArrowUpRight className="h-5 w-5 text-[#E91E63]" />;
      case MilestoneType.PERSONAL:
        return <Users className="h-5 w-5 text-[#9C27B0]" />;
      case MilestoneType.CUSTOM:
        return <Target className="h-5 w-5 text-[#FF5722]" />;
      default:
        return <Trophy className="h-5 w-5 text-[#FF9800]" />;
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
          <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-[#FF9800]/20 mb-8">
            <Trophy className="h-12 w-12 text-[#FF9800]" />
          </div>
          
          <h1 className="text-3xl font-bold mb-4">Milestone Vault Created!</h1>
          <p className="text-xl text-gray-300 mb-8">
            Your milestone-based vault has been successfully created with {milestones.length} achievement milestone{milestones.length !== 1 ? 's' : ''}.
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
                  className="text-[#FF9800] hover:text-[#FFA726] hover:bg-[#FF9800]/10"
                >
                  Copy ID
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Number of Milestones</p>
                  <p className="text-white">{milestones.length}</p>
                </div>
                <div>
                  <p className="text-gray-500">Verification Method</p>
                  <p className="text-white">
                    {milestones.some(m => m.verificationType === VerificationType.MULTI_SIGNATURE) 
                      ? 'Multi-Signature' 
                      : milestones.some(m => m.verificationType === VerificationType.SMART_CONTRACT)
                        ? 'Smart Contract'
                        : milestones.some(m => m.verificationType === VerificationType.THIRD_PARTY)
                          ? 'Third Party'
                          : 'Self-Reported'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Security Score</p>
                  <p className="text-white">{securityScore}/100</p>
                </div>
                <div>
                  <p className="text-gray-500">First Milestone</p>
                  <p className="text-white">{milestones.sort((a, b) => a.order - b.order)[0]?.title}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center">
            <Link href="/dashboard">
              <Button 
                className="bg-gradient-to-r from-[#FF9800] to-[#6B00D7] hover:from-[#FFA726] hover:to-[#7B10E7] text-white px-8 py-6 h-auto text-lg rounded-xl shadow-lg"
              >
                Go to Dashboard
              </Button>
            </Link>
            <Button 
              variant="outline"
              className="border-[#FF9800]/50 text-[#FF9800] hover:bg-[#FF9800]/10"
              onClick={() => {
                setIsSuccess(false);
                setVaultName('My Milestone Vault');
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
          <Button variant="ghost" className="mb-4 hover:bg-[#FF9800]/10">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Vault Types
          </Button>
        </Link>

        <div className="flex items-center mb-4">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#FF9800] to-[#6B00D7] flex items-center justify-center shadow-lg shadow-[#FF9800]/30 mr-4">
            <Trophy className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#FF9800] to-[#6B00D7]">
            Milestone-Based Release Vault
          </h1>
        </div>
        
        <p className="text-lg text-gray-300 max-w-3xl">
          Create a powerful incentive system that releases assets as you achieve your personal, educational, or financial goals.
        </p>
        
        <div className="flex flex-wrap gap-3 mt-4">
          <Badge variant="secondary" className="bg-[#FF9800]/20 text-[#FF9800] border-[#FF9800]/50">
            <Trophy className="h-3 w-3 mr-1" /> Achievement-Based
          </Badge>
          <Badge variant="secondary" className="bg-[#6B00D7]/20 text-[#6B00D7] border-[#6B00D7]/50">
            <Target className="h-3 w-3 mr-1" /> Goal-Oriented
          </Badge>
          <Badge variant="secondary" className="bg-[#00E676]/20 text-[#00E676] border-[#00E676]/50">
            <Unlock className="h-3 w-3 mr-1" /> Progressive Unlocking
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
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="basics" className="data-[state=active]:bg-[#FF9800]/30">
                <div className="flex flex-col items-center py-1">
                  <FileText className="h-5 w-5 mb-1" />
                  <span>Basics</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="milestones" className="data-[state=active]:bg-[#6B00D7]/30">
                <div className="flex flex-col items-center py-1">
                  <Trophy className="h-5 w-5 mb-1" />
                  <span>Milestones</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-[#00E676]/30">
                <div className="flex flex-col items-center py-1">
                  <Shield className="h-5 w-5 mb-1" />
                  <span>Settings</span>
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
                      placeholder="Add details about the purpose of this vault and your milestones"
                    />
                  </div>
                </div>
                
                <Alert className="mt-6 bg-[#FF9800]/10 border-[#FF9800]/30">
                  <Target className="h-4 w-4 text-[#FF9800]" />
                  <AlertTitle className="text-[#FF9800]">Milestone-Based Vaults</AlertTitle>
                  <AlertDescription className="text-gray-300">
                    Define achievement milestones to progressively unlock your assets as you reach your goals. Each milestone can have different verification methods and unlock percentages.
                  </AlertDescription>
                </Alert>
              </div>
              
              <div className="pt-4 flex justify-end">
                <Button 
                  onClick={() => setCurrentTab('milestones')}
                  className="bg-[#FF9800] hover:bg-[#FFA726] text-white"
                >
                  Continue to Milestones
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="milestones" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Milestone List */}
                <div className="lg:col-span-1 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Milestones</h2>
                    <Badge variant="outline" className="font-normal">
                      Total: {totalPercentage}%
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                    {milestones.sort((a, b) => a.order - b.order).map((milestone) => (
                      <div 
                        key={milestone.id}
                        className={`flex items-center space-x-3 p-3 rounded-md cursor-pointer transition-colors ${
                          selectedMilestoneId === milestone.id 
                            ? 'bg-[#FF9800]/20 border border-[#FF9800]/40' 
                            : 'bg-black/20 border border-gray-800 hover:border-gray-700'
                        }`}
                        onClick={() => setSelectedMilestoneId(milestone.id)}
                      >
                        <div className="bg-black/30 h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0">
                          {getMilestoneTypeIcon(milestone.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{milestone.title}</p>
                          <div className="flex items-center text-xs text-gray-400">
                            <span className="truncate">{milestone.percentage}% unlock</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full border-dashed flex items-center justify-center space-x-2 hover:bg-[#FF9800]/5 hover:border-[#FF9800]/30 border-gray-700"
                    onClick={addMilestone}
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Milestone</span>
                  </Button>
                </div>
                
                {/* Milestone Editor */}
                <div className="lg:col-span-2 space-y-4">
                  {selectedMilestone ? (
                    <>
                      <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Milestone Details</h2>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => reorderMilestone(selectedMilestone.id, 'up')}
                            disabled={selectedMilestone.order === 1}
                            className="h-8 w-8"
                          >
                            <ArrowLeft className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => reorderMilestone(selectedMilestone.id, 'down')}
                            disabled={selectedMilestone.order === milestones.length}
                            className="h-8 w-8"
                          >
                            <ArrowLeft className="h-4 w-4 rotate-180" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteMilestone(selectedMilestone.id)}
                            className="h-8 w-8 text-red-500 hover:text-red-400 hover:bg-red-500/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="milestone-title">Milestone Title</Label>
                          <Input 
                            id="milestone-title"
                            value={selectedMilestone.title}
                            onChange={(e) => updateMilestone(selectedMilestone.id, { title: e.target.value })}
                            className="bg-black/30 border-gray-700"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="milestone-description">Description</Label>
                          <Textarea
                            id="milestone-description"
                            value={selectedMilestone.description}
                            onChange={(e) => updateMilestone(selectedMilestone.id, { description: e.target.value })}
                            className="bg-black/30 border-gray-700"
                            placeholder="Describe this milestone and what criteria needs to be met"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label htmlFor="unlock-percentage">Asset Unlock Percentage</Label>
                            <span className={`${
                              totalPercentage > 100 ? 'text-red-500' : 'text-gray-400'
                            }`}>
                              {selectedMilestone.percentage}%
                            </span>
                          </div>
                          <Slider
                            id="unlock-percentage"
                            min={1}
                            max={100}
                            step={1}
                            value={[selectedMilestone.percentage]}
                            onValueChange={(value) => updateMilestone(selectedMilestone.id, { percentage: value[0] })}
                            className="[&>span]:bg-[#FF9800]"
                          />
                          <div className="flex justify-between text-xs text-gray-400">
                            <span>1%</span>
                            <span>100%</span>
                          </div>
                          {totalPercentage > 100 && (
                            <p className="text-red-500 text-xs">
                              Total percentage exceeds 100%. Please adjust the percentages of your milestones.
                            </p>
                          )}
                        </div>
                        
                        <Separator className="my-4 bg-gray-800" />
                        
                        <div className="space-y-4">
                          <Label>Milestone Type</Label>
                          <RadioGroup 
                            value={selectedMilestone.type} 
                            onValueChange={(value) => updateMilestone(selectedMilestone.id, { type: value as MilestoneType })}
                            className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2"
                          >
                            {Object.values(MilestoneType).map(type => (
                              <div 
                                key={type}
                                className="flex items-center space-x-2 border border-gray-800 rounded-lg p-3 hover:bg-[#FF9800]/5 cursor-pointer"
                              >
                                <RadioGroupItem value={type} id={`type-${type}`} className="text-[#FF9800]" />
                                <Label htmlFor={`type-${type}`} className="cursor-pointer flex-1">
                                  <div className="flex items-center">
                                    <div className="mr-2">
                                      {getMilestoneTypeIcon(type)}
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="font-medium">
                                        {type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                      </span>
                                      <span className="text-xs text-gray-400">{getMilestoneTypeDescription(type)}</span>
                                    </div>
                                  </div>
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>
                        
                        {selectedMilestone.type === MilestoneType.TIME_BASED && (
                          <div className="space-y-2">
                            <Label htmlFor="milestone-deadline">Target Date</Label>
                            <Input 
                              id="milestone-deadline"
                              type="date"
                              value={selectedMilestone.deadline ? new Date(selectedMilestone.deadline).toISOString().split('T')[0] : ''}
                              onChange={(e) => updateMilestone(selectedMilestone.id, { 
                                deadline: e.target.value ? new Date(e.target.value) : undefined 
                              })}
                              className="bg-black/30 border-gray-700"
                            />
                          </div>
                        )}
                        
                        <div className="space-y-2">
                          <Label htmlFor="completion-criteria">Completion Criteria</Label>
                          <Textarea
                            id="completion-criteria"
                            value={selectedMilestone.completionCriteria || ''}
                            onChange={(e) => updateMilestone(selectedMilestone.id, { completionCriteria: e.target.value })}
                            className="bg-black/30 border-gray-700"
                            placeholder="Describe the specific criteria for completing this milestone"
                          />
                        </div>
                        
                        <Separator className="my-4 bg-gray-800" />
                        
                        <div className="space-y-4">
                          <Label>Verification Method</Label>
                          <RadioGroup 
                            value={selectedMilestone.verificationType} 
                            onValueChange={(value) => updateMilestone(selectedMilestone.id, { verificationType: value as VerificationType })}
                            className="grid grid-cols-1 gap-3 mt-2"
                          >
                            {Object.values(VerificationType).map(type => (
                              <div 
                                key={type}
                                className="flex items-center space-x-2 border border-gray-800 rounded-lg p-3 hover:bg-[#FF9800]/5 cursor-pointer"
                              >
                                <RadioGroupItem value={type} id={`verification-${type}`} className="text-[#FF9800]" />
                                <Label htmlFor={`verification-${type}`} className="cursor-pointer flex-1">
                                  <div className="flex flex-col">
                                    <span className="font-medium">
                                      {type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                    </span>
                                    <span className="text-sm text-gray-400">{getVerificationTypeDescription(type)}</span>
                                  </div>
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>
                        
                        {selectedMilestone.verificationType === VerificationType.MULTI_SIGNATURE && (
                          <div className="space-y-4 pl-6 border-l-2 border-gray-800">
                            <div className="space-y-2">
                              <Label htmlFor="verifiers">Verifiers (Wallet Addresses or Email Addresses)</Label>
                              <Textarea
                                id="verifiers"
                                value={selectedMilestone.verifiers?.join('\n') || ''}
                                onChange={(e) => updateMilestone(selectedMilestone.id, { 
                                  verifiers: e.target.value.split('\n').filter(line => line.trim()) 
                                })}
                                className="bg-black/30 border-gray-700"
                                placeholder="Enter one verifier per line"
                              />
                              <p className="text-xs text-gray-400">
                                Add the wallet addresses or email addresses of people who can verify this milestone
                              </p>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <Label htmlFor="verifications-required">Required Verifications</Label>
                                <span>{selectedMilestone.verificationsRequired || 1} of {selectedMilestone.verifiers?.length || 0}</span>
                              </div>
                              <Slider
                                id="verifications-required"
                                min={1}
                                max={Math.max(1, selectedMilestone.verifiers?.length || 1)}
                                step={1}
                                value={[selectedMilestone.verificationsRequired || 1]}
                                onValueChange={(value) => updateMilestone(selectedMilestone.id, { verificationsRequired: value[0] })}
                                className="[&>span]:bg-[#FF9800]"
                                disabled={!selectedMilestone.verifiers?.length}
                              />
                              <p className="text-xs text-gray-400">
                                Number of verifiers who must confirm completion
                              </p>
                            </div>
                          </div>
                        )}
                        
                        {selectedMilestone.verificationType === VerificationType.SMART_CONTRACT && (
                          <div className="pl-6 border-l-2 border-gray-800 space-y-2">
                            <Alert className="bg-[#6B00D7]/10 border-[#6B00D7]/30">
                              <div className="flex items-start">
                                <Shield className="h-4 w-4 text-[#6B00D7] mt-0.5 mr-2" />
                                <div>
                                  <AlertTitle className="text-[#6B00D7]">Smart Contract Verification</AlertTitle>
                                  <AlertDescription className="text-gray-300">
                                    This milestone will be automatically verified based on on-chain data. Our vault system will monitor the specified conditions and unlock assets when met.
                                  </AlertDescription>
                                </div>
                              </div>
                            </Alert>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-64 border border-dashed border-gray-700 rounded-md">
                      <Trophy className="h-10 w-10 text-gray-500 mb-2" />
                      <p className="text-gray-500">No milestone selected</p>
                      <Button
                        variant="ghost"
                        className="mt-4 text-[#FF9800] hover:text-[#FFA726] hover:bg-[#FF9800]/10"
                        onClick={addMilestone}
                      >
                        Create your first milestone
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
                  onClick={() => setCurrentTab('settings')}
                  className="bg-[#6B00D7] hover:bg-[#7B10E7] text-white"
                >
                  Continue to Settings
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="settings" className="space-y-6">
              <div className="space-y-5">
                <h2 className="text-xl font-semibold">Vault Settings</h2>
                
                <div className="flex items-center justify-between border-b border-gray-800 py-3">
                  <div>
                    <Label htmlFor="sequential-completion" className="cursor-pointer font-medium">
                      Require Sequential Completion
                    </Label>
                    <p className="text-sm text-gray-400">
                      Milestones must be completed in order
                    </p>
                  </div>
                  <Switch 
                    id="sequential-completion"
                    checked={requireSequentialCompletion}
                    onCheckedChange={setRequireSequentialCompletion}
                    className="data-[state=checked]:bg-[#00E676]"
                  />
                </div>
                
                <div className="flex items-center justify-between border-b border-gray-800 py-3">
                  <div>
                    <Label htmlFor="partial-unlock" className="cursor-pointer font-medium">
                      Allow Partial Unlocking
                    </Label>
                    <p className="text-sm text-gray-400">
                      Assets are released incrementally as each milestone is completed
                    </p>
                  </div>
                  <Switch 
                    id="partial-unlock"
                    checked={allowPartialUnlock}
                    onCheckedChange={setAllowPartialUnlock}
                    className="data-[state=checked]:bg-[#00E676]"
                  />
                </div>
                
                <div className="flex items-center justify-between border-b border-gray-800 py-3">
                  <div>
                    <Label htmlFor="require-proof" className="cursor-pointer font-medium">
                      Require Proof of Completion
                    </Label>
                    <p className="text-sm text-gray-400">
                      Milestone completion requires supporting evidence or documentation
                    </p>
                  </div>
                  <Switch 
                    id="require-proof"
                    checked={requireProof}
                    onCheckedChange={setRequireProof}
                    className="data-[state=checked]:bg-[#00E676]"
                  />
                </div>
                
                <div className="flex items-center justify-between border-b border-gray-800 py-3">
                  <div>
                    <Label htmlFor="notifications" className="cursor-pointer font-medium">
                      Enable Notifications
                    </Label>
                    <p className="text-sm text-gray-400">
                      Receive updates about milestone completions and vault status
                    </p>
                  </div>
                  <Switch 
                    id="notifications"
                    checked={enableNotifications}
                    onCheckedChange={setEnableNotifications}
                    className="data-[state=checked]:bg-[#00E676]"
                  />
                </div>
                
                <div className="flex items-center justify-between border-b border-gray-800 py-3">
                  <div>
                    <Label htmlFor="emergency-access" className="cursor-pointer font-medium">
                      Emergency Access Protocol
                    </Label>
                    <p className="text-sm text-gray-400">
                      Allows recovery access to vault in emergency situations
                    </p>
                  </div>
                  <Switch 
                    id="emergency-access"
                    checked={enableEmergencyAccess}
                    onCheckedChange={setEnableEmergencyAccess}
                    className="data-[state=checked]:bg-[#00E676]"
                  />
                </div>
                
                {enableEmergencyAccess && (
                  <div className="pl-6 border-l-2 border-gray-800 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="emergency-email">Emergency Contact Email</Label>
                      <Input 
                        id="emergency-email"
                        type="email" 
                        placeholder="your@email.com"
                        value={emergencyEmail}
                        onChange={(e) => setEmergencyEmail(e.target.value)}
                        className="bg-black/30 border-gray-700"
                      />
                      <p className="text-xs text-gray-400">
                        Notification will be sent before emergency access is granted
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="emergency-delay">Emergency Access Delay</Label>
                        <span>{emergencyDelay} days</span>
                      </div>
                      <Slider
                        id="emergency-delay"
                        min={1}
                        max={90}
                        step={1}
                        value={[emergencyDelay]}
                        onValueChange={(value) => setEmergencyDelay(value[0])}
                        className="[&>span]:bg-[#00E676]"
                      />
                      <p className="text-xs text-gray-400">
                        Waiting period before emergency access is granted
                      </p>
                    </div>
                  </div>
                )}
                
                <Alert className="mt-6 bg-[#00E676]/10 border-[#00E676]/30">
                  <Shield className="h-4 w-4 text-[#00E676]" />
                  <AlertTitle className="text-[#00E676]">Triple-Chain Security</AlertTitle>
                  <AlertDescription className="text-gray-300">
                    Your milestone vault is protected by our Triple-Chain Security architecture across Ethereum, TON, and Solana networks.
                  </AlertDescription>
                </Alert>
              </div>
              
              <div className="pt-6 space-y-6">
                {!isDeploying ? (
                  <Button 
                    onClick={deployVault}
                    className="w-full bg-gradient-to-r from-[#FF9800] to-[#6B00D7] hover:from-[#FFA726] hover:to-[#7B10E7] text-white h-12 text-lg font-semibold"
                  >
                    Create Milestone Vault
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Deploying milestone vault...</span>
                      <span>{deploymentProgress}%</span>
                    </div>
                    <Progress value={deploymentProgress} className="h-2 [&>div]:bg-[#FF9800]" />
                    <p className="text-sm text-gray-400">
                      {deploymentProgress < 30 && "Creating vault architecture..."}
                      {deploymentProgress >= 30 && deploymentProgress < 60 && "Setting up milestone tracking..."}
                      {deploymentProgress >= 60 && deploymentProgress < 90 && "Configuring verification systems..."}
                      {deploymentProgress >= 90 && "Finalizing deployment..."}
                    </p>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <Button 
                    variant="outline"
                    onClick={() => setCurrentTab('milestones')}
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
          <Card className="bg-gradient-to-br from-[#FF9800]/20 to-[#6B00D7]/20 border-gray-800">
            <CardHeader>
              <CardTitle className="text-lg">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF9800] to-[#6B00D7]">Milestones Summary</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Total Milestones:</span>
                <span className="font-medium">{milestones.length}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Total Percentage:</span>
                <span className={`font-medium ${totalPercentage === 100 ? 'text-green-500' : 'text-yellow-500'}`}>
                  {totalPercentage}%
                </span>
              </div>
              
              <Separator className="my-2 bg-gray-700/50" />
              
              <div className="space-y-3">
                <div className="text-sm font-medium">Asset Unlocking</div>
                
                <div className="w-full bg-black/30 h-3 rounded-full overflow-hidden relative">
                  {milestones.sort((a, b) => a.order - b.order).map((milestone, index, array) => {
                    // Calculate the cumulative percentage up to this milestone
                    const previousPercentage = array
                      .slice(0, index)
                      .reduce((sum, m) => sum + m.percentage, 0);
                    
                    return (
                      <div 
                        key={milestone.id}
                        className={`absolute h-full top-0 ${
                          index % 3 === 0 ? 'bg-[#FF9800]' :
                          index % 3 === 1 ? 'bg-[#6B00D7]' :
                          'bg-[#00E676]'
                        }`}
                        style={{ 
                          left: `${previousPercentage}%`, 
                          width: `${milestone.percentage}%` 
                        }}
                      />
                    );
                  })}
                </div>
                
                <div className="grid grid-cols-1 gap-2 mt-4">
                  {milestones.sort((a, b) => a.order - b.order).map((milestone, index) => (
                    <div key={milestone.id} className="flex items-center text-sm">
                      <div className={`h-3 w-3 rounded-full mr-2 ${
                        index % 3 === 0 ? 'bg-[#FF9800]' :
                        index % 3 === 1 ? 'bg-[#6B00D7]' :
                        'bg-[#00E676]'
                      }`} />
                      <span className="truncate flex-1">{milestone.title}</span>
                      <span className="ml-2">{milestone.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-black/30 backdrop-blur-sm border-gray-800 overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-[#FF9800] to-[#6B00D7]" />
            <CardHeader>
              <CardTitle>Security Score</CardTitle>
              <CardDescription>
                Rating based on your milestone configuration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm text-gray-300">Security Level</span>
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
                  <span className="text-gray-400">Verification Methods</span>
                  <Badge variant="outline" className={`
                    ${milestones.some(m => m.verificationType === VerificationType.MULTI_SIGNATURE || 
                                          m.verificationType === VerificationType.SMART_CONTRACT)
                      ? 'border-green-500 text-green-500'
                      : milestones.some(m => m.verificationType === VerificationType.THIRD_PARTY)
                        ? 'border-amber-500 text-amber-500'
                        : 'border-red-500 text-red-500'
                    }
                  `}>
                    {milestones.some(m => m.verificationType === VerificationType.MULTI_SIGNATURE)
                      ? 'Multi-Signature'
                      : milestones.some(m => m.verificationType === VerificationType.SMART_CONTRACT)
                        ? 'Smart Contract'
                        : milestones.some(m => m.verificationType === VerificationType.THIRD_PARTY)
                          ? 'Third Party'
                          : 'Basic'
                    }
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Milestone Structure</span>
                  <Badge variant="outline" className={`
                    ${milestones.length >= 3
                      ? 'border-green-500 text-green-500'
                      : milestones.length === 2
                        ? 'border-amber-500 text-amber-500'
                        : 'border-red-500 text-red-500'
                    }
                  `}>
                    {milestones.length >= 3
                      ? 'Comprehensive'
                      : milestones.length === 2
                        ? 'Adequate'
                        : 'Basic'
                    }
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Proof Requirement</span>
                  <Badge variant="outline" className={`
                    ${requireProof
                      ? 'border-green-500 text-green-500'
                      : 'border-red-500 text-red-500'
                    }
                  `}>
                    {requireProof ? 'Required' : 'Not Required'}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Emergency Access</span>
                  <Badge variant="outline" className={`
                    ${enableEmergencyAccess && emergencyEmail
                      ? 'border-green-500 text-green-500'
                      : enableEmergencyAccess
                        ? 'border-amber-500 text-amber-500'
                        : 'border-red-500 text-red-500'
                    }
                  `}>
                    {enableEmergencyAccess && emergencyEmail
                      ? 'Configured'
                      : enableEmergencyAccess
                        ? 'Partial'
                        : 'Disabled'
                    }
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Alert className="bg-[#FF9800]/10 border-[#FF9800]/30">
            <Award className="h-4 w-4 text-[#FF9800]" />
            <AlertTitle className="text-[#FF9800]">Achievement Unlocking</AlertTitle>
            <AlertDescription className="text-gray-300">
              Milestone-based vaults create powerful incentives by tying asset releases to your achievements and goals.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
};

export default MilestoneBasedVaultForm;