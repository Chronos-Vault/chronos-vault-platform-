import React, { useState } from 'react';
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
}

interface SecurityRequirement {
  type: "verification" | "keyCount" | "timeDelay" | "approval" | "passwordLength";
  value: string | number;
}

const DynamicVaultForm = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [progress, setProgress] = useState(25);
  const [activeTab, setActiveTab] = useState("basics");
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    assetType: "crypto",
    initialSecurityLevel: 2,
    enableAdvancedRules: true,
    enableMultiChain: true,
    primaryBlockchain: "ethereum",
    fallbackBlockchain: "solana",
    backupBlockchain: "ton",
    securityRequirements: {
      requirementCount: 3,
      requirements: [
        { type: "verification", value: 2 },
        { type: "keyCount", value: 3 },
        { type: "timeDelay", value: "24h" }
      ] as SecurityRequirement[]
    },
    rules: [] as DynamicRule[],
    autoAdjustLevel: true,
    enableQuantumResistance: false,
    enableZeroKnowledgeAccess: true,
    enableBehavioralAnalysis: true,
    enableAnomalyDetection: true,
    contactEmail: "",
    alertThreshold: 3,
    customNotes: ""
  });

  // Generate a unique ID
  const generateId = () => {
    return Math.random().toString(36).substring(2, 9);
  };

  // Add a new rule
  const addRule = () => {
    const newRule: DynamicRule = {
      id: generateId(),
      type: 'timeCondition',
      name: `Rule ${formData.rules.length + 1}`,
      condition: 'after',
      value: '30d',
      action: 'increaseSecurityLevel'
    };
    
    setFormData({
      ...formData,
      rules: [...formData.rules, newRule]
    });
  };

  // Delete a rule
  const deleteRule = (id: string) => {
    setFormData({
      ...formData,
      rules: formData.rules.filter(rule => rule.id !== id)
    });
  };

  // Update a rule
  const updateRule = (id: string, field: keyof DynamicRule, value: any) => {
    const updatedRules = formData.rules.map(rule => {
      if (rule.id === id) {
        return { ...rule, [field]: value };
      }
      return rule;
    });
    
    setFormData({
      ...formData,
      rules: updatedRules
    });
  };

  // Add security requirement
  const addRequirement = () => {
    if (formData.securityRequirements.requirements.length < 5) {
      const newRequirement: SecurityRequirement = {
        type: "verification",
        value: 1
      };
      
      setFormData({
        ...formData,
        securityRequirements: {
          ...formData.securityRequirements,
          requirementCount: formData.securityRequirements.requirementCount + 1,
          requirements: [...formData.securityRequirements.requirements, newRequirement]
        }
      });
    } else {
      toast({
        title: "Maximum Requirements Reached",
        description: "You can add a maximum of 5 security requirements.",
        variant: "destructive"
      });
    }
  };

  // Delete security requirement
  const deleteRequirement = (index: number) => {
    if (formData.securityRequirements.requirements.length > 1) {
      const updatedRequirements = [...formData.securityRequirements.requirements];
      updatedRequirements.splice(index, 1);
      
      setFormData({
        ...formData,
        securityRequirements: {
          ...formData.securityRequirements,
          requirementCount: formData.securityRequirements.requirementCount - 1,
          requirements: updatedRequirements
        }
      });
    } else {
      toast({
        title: "Minimum Requirements",
        description: "You need at least one security requirement.",
        variant: "destructive"
      });
    }
  };

  // Update security requirement
  const updateRequirement = (index: number, field: keyof SecurityRequirement, value: any) => {
    const updatedRequirements = [...formData.securityRequirements.requirements];
    updatedRequirements[index] = { 
      ...updatedRequirements[index], 
      [field]: value 
    };
    
    setFormData({
      ...formData,
      securityRequirements: {
        ...formData.securityRequirements,
        requirements: updatedRequirements
      }
    });
  };

  // Handle generic form field changes
  const handleChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Dynamic Vault Created",
      description: "Your dynamic vault has been created successfully.",
    });
    // Navigate to a success page or dashboard
    setLocation("/dashboard");
  };

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    switch (tab) {
      case "basics":
        setProgress(25);
        setCurrentStep(1);
        break;
      case "rules":
        setProgress(50);
        setCurrentStep(2);
        break;
      case "security":
        setProgress(75);
        setCurrentStep(3);
        break;
      case "blockchain":
        setProgress(100);
        setCurrentStep(4);
        break;
      default:
        setProgress(25);
        setCurrentStep(1);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 max-w-[1200px]">
      <div className="mb-10">
        <Link href="/vaults" className="flex items-center text-blue-500 hover:text-blue-700 mb-2">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Vaults
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Create Dynamic Vault</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Create a custom vault with dynamic security rules
            </p>
          </div>
          <Badge className="bg-purple-600 dark:bg-purple-700 mt-2 md:mt-0 self-start md:self-auto">
            Premium Feature
          </Badge>
        </div>
        
        <Progress value={progress} className="h-2 mb-2" />
        
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <span className={currentStep >= 1 ? "font-bold text-primary" : ""}>Basics</span>
          <span className={currentStep >= 2 ? "font-bold text-primary" : ""}>Rules</span>
          <span className={currentStep >= 3 ? "font-bold text-primary" : ""}>Security</span>
          <span className={currentStep >= 4 ? "font-bold text-primary" : ""}>Blockchain</span>
        </div>
      </div>

      <Card className="border border-gray-200 dark:border-gray-800">
        <CardHeader>
          <div className="flex items-center">
            <Workflow className="h-5 w-5 mr-2 text-purple-600" />
            <CardTitle>Dynamic Vault Configuration</CardTitle>
          </div>
          <CardDescription>
            Configure your vault with adaptive security features
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Tabs 
              defaultValue="basics" 
              value={activeTab}
              onValueChange={handleTabChange}
              className="w-full"
            >
              <TabsList className="grid grid-cols-4 mb-6">
                <TabsTrigger value="basics">Basics</TabsTrigger>
                <TabsTrigger value="rules">Rules</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
              </TabsList>
              
              {/* Basics Tab */}
              <TabsContent value="basics" className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="name">Vault Name</Label>
                      <Input 
                        id="name"
                        placeholder="Enter vault name"
                        value={formData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        className="mt-1"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea 
                        id="description"
                        placeholder="Describe the purpose of this vault"
                        value={formData.description}
                        onChange={(e) => handleChange("description", e.target.value)}
                        className="mt-1 min-h-[100px]"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="assetType">Asset Type</Label>
                      <Select 
                        value={formData.assetType}
                        onValueChange={(value) => handleChange("assetType", value)}
                      >
                        <SelectTrigger id="assetType" className="mt-1">
                          <SelectValue placeholder="Select asset type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="crypto">Cryptocurrency</SelectItem>
                          <SelectItem value="nft">NFT Collection</SelectItem>
                          <SelectItem value="document">Documents</SelectItem>
                          <SelectItem value="mixed">Mixed Assets</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="initialSecurityLevel">Initial Security Level</Label>
                      <div className="mt-2">
                        <RadioGroup 
                          id="initialSecurityLevel"
                          value={formData.initialSecurityLevel.toString()} 
                          onValueChange={(value) => handleChange("initialSecurityLevel", parseInt(value))}
                          className="flex space-x-2 mb-2"
                        >
                          {[1, 2, 3, 4, 5].map((level) => (
                            <div key={level} className="flex items-center space-x-1">
                              <RadioGroupItem value={level.toString()} id={`level-${level}`} />
                              <Label htmlFor={`level-${level}`} className="text-sm">{level}</Label>
                            </div>
                          ))}
                        </RadioGroup>
                        
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Standard</span>
                          <span>Enhanced</span>
                          <span>Maximum</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 pt-2">
                      <Switch 
                        id="enableAdvancedRules"
                        checked={formData.enableAdvancedRules}
                        onCheckedChange={(checked) => handleChange("enableAdvancedRules", checked)}
                      />
                      <Label htmlFor="enableAdvancedRules">
                        Enable Advanced Dynamic Rules
                      </Label>
                    </div>
                  </div>
                  
                  <div className="pt-4 flex justify-end">
                    <Button 
                      type="button" 
                      onClick={() => handleTabChange("rules")}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      Next: Configure Rules <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              {/* Rules Tab */}
              <TabsContent value="rules" className="space-y-6">
                <div className="space-y-4">
                  <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                    <Activity className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <AlertTitle>Rule Configuration</AlertTitle>
                    <AlertDescription>
                      Create rules that change your vault's security based on various conditions.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                    {formData.rules.map((rule, index) => (
                      <Card key={rule.id} className="border border-gray-200 dark:border-gray-800">
                        <CardContent className="pt-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <Label htmlFor={`rule-name-${rule.id}`}>Rule Name</Label>
                              <Input 
                                id={`rule-name-${rule.id}`}
                                value={rule.name}
                                onChange={(e) => updateRule(rule.id, "name", e.target.value)}
                                className="mt-1"
                              />
                            </div>
                            
                            <div>
                              <Label htmlFor={`rule-type-${rule.id}`}>Condition Type</Label>
                              <Select 
                                value={rule.type}
                                onValueChange={(value: any) => updateRule(rule.id, "type", value)}
                              >
                                <SelectTrigger id={`rule-type-${rule.id}`} className="mt-1">
                                  <SelectValue placeholder="Select condition type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="timeCondition">Time-Based</SelectItem>
                                  <SelectItem value="marketCondition">Market Condition</SelectItem>
                                  <SelectItem value="securityLevel">Security Level Change</SelectItem>
                                  <SelectItem value="userActivity">User Activity</SelectItem>
                                  <SelectItem value="networkState">Network Status</SelectItem>
                                  <SelectItem value="custom">Custom Condition</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <Label htmlFor={`rule-condition-${rule.id}`}>Condition</Label>
                              <Select 
                                value={rule.condition}
                                onValueChange={(value) => updateRule(rule.id, "condition", value)}
                              >
                                <SelectTrigger id={`rule-condition-${rule.id}`} className="mt-1">
                                  <SelectValue placeholder="Select condition" />
                                </SelectTrigger>
                                <SelectContent>
                                  {rule.type === 'timeCondition' && (
                                    <>
                                      <SelectItem value="after">After Time Period</SelectItem>
                                      <SelectItem value="before">Before Time Period</SelectItem>
                                      <SelectItem value="at">At Specific Time</SelectItem>
                                    </>
                                  )}
                                  {rule.type === 'marketCondition' && (
                                    <>
                                      <SelectItem value="priceAbove">Price Above</SelectItem>
                                      <SelectItem value="priceBelow">Price Below</SelectItem>
                                      <SelectItem value="volatilityAbove">Volatility Above</SelectItem>
                                    </>
                                  )}
                                  {rule.type === 'securityLevel' && (
                                    <>
                                      <SelectItem value="levelAbove">Level Above</SelectItem>
                                      <SelectItem value="levelBelow">Level Below</SelectItem>
                                      <SelectItem value="levelEquals">Level Equals</SelectItem>
                                    </>
                                  )}
                                  {rule.type === 'userActivity' && (
                                    <>
                                      <SelectItem value="loginAttempts">Login Attempts Exceed</SelectItem>
                                      <SelectItem value="inactivity">Inactivity Period</SelectItem>
                                      <SelectItem value="suspiciousActivity">Suspicious Activity</SelectItem>
                                    </>
                                  )}
                                  {rule.type === 'networkState' && (
                                    <>
                                      <SelectItem value="congestion">Network Congestion</SelectItem>
                                      <SelectItem value="feeAbove">Fee Above Threshold</SelectItem>
                                      <SelectItem value="chainIssue">Chain Issues Detected</SelectItem>
                                    </>
                                  )}
                                  {rule.type === 'custom' && (
                                    <>
                                      <SelectItem value="custom">Custom Condition</SelectItem>
                                    </>
                                  )}
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div>
                              <Label htmlFor={`rule-value-${rule.id}`}>Value</Label>
                              <Input 
                                id={`rule-value-${rule.id}`}
                                value={rule.value.toString()}
                                onChange={(e) => updateRule(rule.id, "value", e.target.value)}
                                className="mt-1"
                                placeholder={
                                  rule.type === 'timeCondition' ? "e.g. 30d, 24h" :
                                  rule.type === 'marketCondition' ? "e.g. 50000, 5%" :
                                  rule.type === 'securityLevel' ? "e.g. 3" :
                                  rule.type === 'userActivity' ? "e.g. 5, 7d" :
                                  rule.type === 'networkState' ? "e.g. high, 100" :
                                  "Enter value"
                                }
                              />
                            </div>
                          </div>
                          
                          <div className="mb-2">
                            <Label htmlFor={`rule-action-${rule.id}`}>Action</Label>
                            <Select 
                              value={rule.action}
                              onValueChange={(value: any) => updateRule(rule.id, "action", value)}
                            >
                              <SelectTrigger id={`rule-action-${rule.id}`} className="mt-1">
                                <SelectValue placeholder="Select action" />
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
                          
                          <div className="flex justify-end">
                            <Button 
                              type="button" 
                              variant="destructive"
                              size="sm"
                              onClick={() => deleteRule(rule.id)}
                              className="mt-2"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete Rule
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={addRule}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Rule
                  </Button>
                  
                  <div className="pt-4 flex justify-between">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => handleTabChange("basics")}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button 
                      type="button" 
                      onClick={() => handleTabChange("security")}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      Next: Security Settings <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              {/* Security Tab */}
              <TabsContent value="security" className="space-y-6">
                <div className="space-y-4">
                  <Alert className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
                    <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <AlertTitle>Security Configuration</AlertTitle>
                    <AlertDescription>
                      Configure advanced security settings for your vault.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Security Requirements</h3>
                      <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                        {formData.securityRequirements.requirements.map((req, index) => (
                          <Card key={index} className="border border-gray-200 dark:border-gray-800">
                            <CardContent className="pt-6">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                  <Label htmlFor={`req-type-${index}`}>Requirement Type</Label>
                                  <Select 
                                    value={req.type}
                                    onValueChange={(value: any) => updateRequirement(index, "type", value)}
                                  >
                                    <SelectTrigger id={`req-type-${index}`} className="mt-1">
                                      <SelectValue placeholder="Select requirement type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="verification">Verification Method</SelectItem>
                                      <SelectItem value="keyCount">Key Count</SelectItem>
                                      <SelectItem value="timeDelay">Time Delay</SelectItem>
                                      <SelectItem value="approval">Approval Count</SelectItem>
                                      <SelectItem value="passwordLength">Password Length</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                
                                <div>
                                  <Label htmlFor={`req-value-${index}`}>Value</Label>
                                  <Input 
                                    id={`req-value-${index}`}
                                    value={req.value.toString()}
                                    onChange={(e) => updateRequirement(index, "value", e.target.value)}
                                    className="mt-1"
                                    placeholder={
                                      req.type === 'verification' ? "Number of methods" :
                                      req.type === 'keyCount' ? "Number of keys" :
                                      req.type === 'timeDelay' ? "Time (e.g. 24h)" :
                                      req.type === 'approval' ? "Number of approvals" :
                                      req.type === 'passwordLength' ? "Minimum length" :
                                      "Enter value"
                                    }
                                  />
                                </div>
                              </div>
                              
                              <div className="flex justify-end">
                                <Button 
                                  type="button" 
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => deleteRequirement(index)}
                                  disabled={formData.securityRequirements.requirements.length <= 1}
                                  className="mt-2"
                                >
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Delete
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                      
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={addRequirement}
                        disabled={formData.securityRequirements.requirements.length >= 5}
                        className="w-full mt-4"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Requirement
                      </Button>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium mb-2">Enhanced Security Features</h3>
                      
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Switch 
                            id="autoAdjustLevel"
                            checked={formData.autoAdjustLevel}
                            onCheckedChange={(checked) => handleChange("autoAdjustLevel", checked)}
                          />
                          <div>
                            <Label htmlFor="autoAdjustLevel">Auto-adjust Security Level</Label>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Automatically adjust security based on activity patterns
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Switch 
                            id="enableQuantumResistance"
                            checked={formData.enableQuantumResistance}
                            onCheckedChange={(checked) => handleChange("enableQuantumResistance", checked)}
                          />
                          <div>
                            <Label htmlFor="enableQuantumResistance">Quantum-Resistant Encryption</Label>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Enable post-quantum cryptographic protection
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Switch 
                            id="enableZeroKnowledgeAccess"
                            checked={formData.enableZeroKnowledgeAccess}
                            onCheckedChange={(checked) => handleChange("enableZeroKnowledgeAccess", checked)}
                          />
                          <div>
                            <Label htmlFor="enableZeroKnowledgeAccess">Zero-Knowledge Access</Label>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Verify identity without revealing sensitive information
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Switch 
                            id="enableBehavioralAnalysis"
                            checked={formData.enableBehavioralAnalysis}
                            onCheckedChange={(checked) => handleChange("enableBehavioralAnalysis", checked)}
                          />
                          <div>
                            <Label htmlFor="enableBehavioralAnalysis">Behavioral Analysis</Label>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Monitor and analyze access patterns for suspicious activity
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Switch 
                            id="enableAnomalyDetection"
                            checked={formData.enableAnomalyDetection}
                            onCheckedChange={(checked) => handleChange("enableAnomalyDetection", checked)}
                          />
                          <div>
                            <Label htmlFor="enableAnomalyDetection">Anomaly Detection</Label>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Identify and respond to unusual access or transaction patterns
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 flex justify-between">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => handleTabChange("rules")}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button 
                      type="button" 
                      onClick={() => handleTabChange("blockchain")}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      Next: Blockchain Settings <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              {/* Blockchain Tab */}
              <TabsContent value="blockchain" className="space-y-6">
                <div className="space-y-4">
                  <Alert className="bg-indigo-50 dark:bg-indigo-950 border-indigo-200 dark:border-indigo-800">
                    <Layers className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    <AlertTitle>Blockchain Configuration</AlertTitle>
                    <AlertDescription>
                      Configure blockchain settings for your vault.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="flex items-center space-x-2 py-2">
                    <Switch 
                      id="enableMultiChain"
                      checked={formData.enableMultiChain}
                      onCheckedChange={(checked) => handleChange("enableMultiChain", checked)}
                    />
                    <div>
                      <Label htmlFor="enableMultiChain">Enable Multi-Chain Support</Label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Operate across multiple blockchains with automatic optimization
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="primaryBlockchain">Primary Blockchain</Label>
                      <Select 
                        value={formData.primaryBlockchain}
                        onValueChange={(value) => handleChange("primaryBlockchain", value)}
                      >
                        <SelectTrigger id="primaryBlockchain" className="mt-1">
                          <SelectValue placeholder="Select primary blockchain" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ethereum">Ethereum</SelectItem>
                          <SelectItem value="solana">Solana</SelectItem>
                          <SelectItem value="ton">TON</SelectItem>
                          <SelectItem value="bitcoin">Bitcoin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {formData.enableMultiChain && (
                      <>
                        <div>
                          <Label htmlFor="fallbackBlockchain">Fallback Blockchain</Label>
                          <Select 
                            value={formData.fallbackBlockchain}
                            onValueChange={(value) => handleChange("fallbackBlockchain", value)}
                          >
                            <SelectTrigger id="fallbackBlockchain" className="mt-1">
                              <SelectValue placeholder="Select fallback blockchain" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ethereum">Ethereum</SelectItem>
                              <SelectItem value="solana">Solana</SelectItem>
                              <SelectItem value="ton">TON</SelectItem>
                              <SelectItem value="bitcoin">Bitcoin</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor="backupBlockchain">Backup Blockchain</Label>
                          <Select 
                            value={formData.backupBlockchain}
                            onValueChange={(value) => handleChange("backupBlockchain", value)}
                          >
                            <SelectTrigger id="backupBlockchain" className="mt-1">
                              <SelectValue placeholder="Select backup blockchain" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ethereum">Ethereum</SelectItem>
                              <SelectItem value="solana">Solana</SelectItem>
                              <SelectItem value="ton">TON</SelectItem>
                              <SelectItem value="bitcoin">Bitcoin</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </>
                    )}
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Additional Settings</h3>
                    
                    <div>
                      <Label htmlFor="contactEmail">Contact Email (Optional)</Label>
                      <Input 
                        id="contactEmail"
                        type="email"
                        placeholder="Email for important notifications"
                        value={formData.contactEmail}
                        onChange={(e) => handleChange("contactEmail", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="alertThreshold">Alert Threshold</Label>
                      <div className="flex items-center gap-4 mt-2">
                        <Slider
                          id="alertThreshold"
                          value={[formData.alertThreshold]}
                          min={1}
                          max={10}
                          step={1}
                          onValueChange={(value) => handleChange("alertThreshold", value[0])}
                          className="flex-1"
                        />
                        <span className="w-8 text-center">{formData.alertThreshold}</span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Number of suspicious events before triggering alerts
                      </p>
                    </div>
                    
                    <div>
                      <Label htmlFor="customNotes">Custom Notes (Optional)</Label>
                      <Textarea 
                        id="customNotes"
                        placeholder="Add any additional notes or instructions"
                        value={formData.customNotes}
                        onChange={(e) => handleChange("customNotes", e.target.value)}
                        className="mt-1 min-h-[100px]"
                      />
                    </div>
                  </div>
                  
                  <div className="pt-4 flex justify-between">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => handleTabChange("security")}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button 
                      type="submit"
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      Create Vault <Check className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default DynamicVaultForm;