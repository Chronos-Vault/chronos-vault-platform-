import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  Lock, 
  Users, 
  Shield, 
  Clock, 
  Fingerprint, 
  Key, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  RotateCw,
  FileLock2,
  FileText,
  Clock10,
  ArrowUpRight,
  ShieldAlert,
  Plus,
  Download,
  X
} from "lucide-react";

// Enum for blockchain types
export enum BlockchainType {
  ETHEREUM = 0,
  SOLANA = 1,
  TON = 2,
  BITCOIN = 3
}

// Transaction types for custom signing policies
export enum TransactionType {
  TRANSFER = 'transfer',
  CONTRACT_INTERACTION = 'contract_interaction',
  RECOVERY = 'recovery',
  SETTINGS_CHANGE = 'settings_change',
  ADD_SIGNER = 'add_signer',
  REMOVE_SIGNER = 'remove_signer',
  CHANGE_THRESHOLD = 'change_threshold'
}

// Types for Multi-Signature Vault
interface Signer {
  id: string;
  address: string;
  name: string;
  status: 'pending' | 'accepted' | 'rejected';
  role: 'owner' | 'signer' | 'viewer';
  timeAdded: Date;
  hasKey: boolean;
  timeConstraints: {
    enabled: boolean;
    startTime: string; // Format: "HH:MM" - 24-hour format
    endTime: string; // Format: "HH:MM" - 24-hour format
    allowedDays: number[]; // 0 = Sunday, 1 = Monday, etc.
    timeZone: string; // e.g., "America/New_York"
    effectiveFrom?: Date; // When these constraints become active (optional)
    effectiveUntil?: Date; // Optional expiration of these constraints
  };
  transactionPermissions: {
    enabled: boolean;
    allowedTypes: TransactionType[]; // Types of transactions this signer can approve
    approvalLimits: {
      [TransactionType.TRANSFER]: {
        maxAmount: string; // Maximum amount this signer can approve
        allowedDestinations: string[]; // Approved destination addresses
      };
      [TransactionType.CONTRACT_INTERACTION]: {
        allowedContracts: string[]; // Approved contract addresses
        allowedMethods: string[]; // Approved method signatures
      };
    };
  };
}

// Guardian for social recovery
interface RecoveryGuardian {
  id: string;
  address: string;
  name: string;
  email?: string;
  status: 'pending' | 'active';
  timeAdded: Date;
  lastVerification?: Date;
  isBackup?: boolean;
}

interface Transaction {
  id: string;
  type: string;
  status: 'pending' | 'approved' | 'rejected' | 'executed' | 'expired';
  description: string;
  requiredSignatures: number;
  currentSignatures: number;
  signers: string[];
  creator: string;
  timeCreated: Date;
  timeExecuted?: Date;
  expirationTime: Date;
  amount?: string;
  destination?: string;
  contractInteraction?: {
    method: string;
    params: string;
  };
}

interface VaultAsset {
  name: string;
  symbol: string;
  amount: string;
  valueUSD: number;
  icon: string;
}

interface MultiSigVaultProps {
  vaultName?: string;
  vaultDescription?: string;
  blockchain: BlockchainType;
  threshold: number;
  signers: Signer[];
  assetTimelock?: Date;
  onCreateVault?: (vaultData: any) => void;
  isReadOnly?: boolean;
}

// Constants and mock data (in a real app, these would be loaded from the blockchain)
const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "tx-001",
    type: "send",
    status: "pending",
    description: "Weekly team payment",
    requiredSignatures: 3,
    currentSignatures: 1,
    signers: ["0x742d35Cc6634C0532925a3b844Bc454e4438f44e"],
    creator: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    timeCreated: new Date(Date.now() - 86400000), // 1 day ago
    expirationTime: new Date(Date.now() + 86400000 * 2), // expires in 2 days
    amount: "1.5 ETH",
    destination: "0x3a9A6718D5fbC3a2360941348f5821d4c98B722d"
  },
  {
    id: "tx-002",
    type: "contract",
    status: "approved",
    description: "Update vault timeout settings",
    requiredSignatures: 3,
    currentSignatures: 3,
    signers: [
      "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4",
      "0xDc26F5E4b5E4dEF47A247c38714499a9d5e57Eb9"
    ],
    creator: "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4",
    timeCreated: new Date(Date.now() - 86400000 * 3), // 3 days ago
    timeExecuted: new Date(Date.now() - 86400000 * 2), // 2 days ago
    expirationTime: new Date(Date.now() - 86400000), // expired 1 day ago
    contractInteraction: {
      method: "updateTimelock",
      params: "{ timeout: 1209600 }" // 14 days in seconds
    }
  },
  {
    id: "tx-003",
    type: "send",
    status: "executed",
    description: "Transfer to cold storage",
    requiredSignatures: 3,
    currentSignatures: 3,
    signers: [
      "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4",
      "0xDc26F5E4b5E4dEF47A247c38714499a9d5e57Eb9"
    ],
    creator: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    timeCreated: new Date(Date.now() - 86400000 * 5), // 5 days ago
    timeExecuted: new Date(Date.now() - 86400000 * 4), // 4 days ago
    expirationTime: new Date(Date.now() - 86400000 * 2), // expired 2 days ago
    amount: "25 ETH",
    destination: "0xa1B38Da6A701c968505dCfcB03FcB875f56bedEa"
  }
];

const MOCK_VAULT_ASSETS: VaultAsset[] = [
  {
    name: "Ethereum",
    symbol: "ETH",
    amount: "32.456",
    valueUSD: 97368,
    icon: "ri-ethereum-line"
  },
  {
    name: "USD Coin",
    symbol: "USDC",
    amount: "50,000",
    valueUSD: 50000,
    icon: "ri-coin-line"
  },
  {
    name: "TON",
    symbol: "TON",
    amount: "10,500",
    valueUSD: 63000,
    icon: "ri-disc-line"
  },
  {
    name: "Wrapped BTC",
    symbol: "WBTC",
    amount: "0.75",
    valueUSD: 38250,
    icon: "ri-bit-coin-line"
  }
];

/**
 * Multi-Signature Vault Component
 * Provides a comprehensive UI for creating and managing a multi-signature vault
 * with advanced security features, transaction management, and signer coordination.
 */
export function MultiSignatureVault({
  vaultName = "New Multi-Signature Vault",
  vaultDescription = "",
  blockchain = BlockchainType.ETHEREUM,
  threshold = 2,
  signers = [],
  assetTimelock,
  onCreateVault,
  isReadOnly = false
}: MultiSigVaultProps) {
  // Setup states for the vault
  const [name, setName] = useState<string>(vaultName);
  const [description, setDescription] = useState<string>(vaultDescription);
  const [selectedBlockchain, setSelectedBlockchain] = useState<BlockchainType>(blockchain);
  const [signersThreshold, setSignersThreshold] = useState<number>(threshold);
  
  // Create a default owner signer
  const defaultSigner: Signer = {
    id: "1",
    address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    name: "You (Owner)",
    status: 'accepted' as const,
    role: 'owner' as const,
    timeAdded: new Date(),
    hasKey: true,
    timeConstraints: {
      enabled: false,
      startTime: "09:00",
      endTime: "17:00",
      allowedDays: [1, 2, 3, 4, 5], // Monday to Friday
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    },
    transactionPermissions: {
      enabled: false,
      allowedTypes: [
        TransactionType.TRANSFER,
        TransactionType.CONTRACT_INTERACTION,
        TransactionType.RECOVERY,
        TransactionType.SETTINGS_CHANGE,
        TransactionType.ADD_SIGNER,
        TransactionType.REMOVE_SIGNER,
        TransactionType.CHANGE_THRESHOLD
      ],
      approvalLimits: {
        [TransactionType.TRANSFER]: {
          maxAmount: "1000",
          allowedDestinations: []
        },
        [TransactionType.CONTRACT_INTERACTION]: {
          allowedContracts: [],
          allowedMethods: []
        }
      }
    }
  };
  
  const [vaultSigners, setVaultSigners] = useState<Signer[]>(signers.length > 0 ? signers : [defaultSigner]);
  const [newSignerAddress, setNewSignerAddress] = useState<string>("");
  const [newSignerName, setNewSignerName] = useState<string>("");
  const [timelock, setTimelock] = useState<Date | undefined>(assetTimelock);
  const [timelockDays, setTimelockDays] = useState<number>(assetTimelock ? 
    Math.ceil((assetTimelock.getTime() - new Date().getTime()) / (1000 * 3600 * 24)) : 30);
  
  // Transaction management
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [assets, setAssets] = useState<VaultAsset[]>(MOCK_VAULT_ASSETS);
  const [newTransaction, setNewTransaction] = useState<{
    type: string;
    description: string;
    destination?: string;
    amount?: string;
    contractMethod?: string;
    contractParams?: string;
  }>({
    type: 'send',
    description: '',
    destination: '',
    amount: '',
    contractMethod: '',
    contractParams: ''
  });
  
  // Security Settings
  const [enableHardwareKey, setEnableHardwareKey] = useState<boolean>(true);
  const [enableQRSignature, setEnableQRSignature] = useState<boolean>(false);
  const [enableBiometrics, setEnableBiometrics] = useState<boolean>(false);
  const [enableRecovery, setEnableRecovery] = useState<boolean>(true);
  const [enableEncryption, setEnableEncryption] = useState<boolean>(true);
  const [activityNotifications, setActivityNotifications] = useState<boolean>(true);
  const [gasSettings, setGasSettings] = useState<string>("automatic");
  
  // Social Recovery Settings
  const [recoveryGuardians, setRecoveryGuardians] = useState<RecoveryGuardian[]>([]);
  const [guardianThreshold, setGuardianThreshold] = useState<number>(2);
  const [newGuardian, setNewGuardian] = useState<{name: string, address: string, email: string}>({
    name: '',
    address: '',
    email: ''
  });
  const [recoveryDialogOpen, setRecoveryDialogOpen] = useState<boolean>(false);
  const [recoveryInitiated, setRecoveryInitiated] = useState<boolean>(false);
  const [recoveryStep, setRecoveryStep] = useState<number>(1);
  const [recoveryApprovals, setRecoveryApprovals] = useState<number>(0);
  
  // Additional features
  const [transactionExpiry, setTransactionExpiry] = useState<number>(7); // days
  const [createMode, setCreateMode] = useState<boolean>(!isReadOnly && signers.length === 0);
  
  const getCurrentProgress = (): number => {
    let progress = 0;
    
    if (name.length > 0) progress += 20;
    if (vaultSigners.length >= 2) progress += 20;
    if (signersThreshold > 0 && signersThreshold <= vaultSigners.length) progress += 20;
    if (description.length > 0) progress += 20;
    if (enableRecovery) progress += 20;
    
    return progress;
  };
  
  const addSigner = () => {
    if (!newSignerAddress || !newSignerName) return;
    
    // Basic address validation - would be more sophisticated in production
    if (!newSignerAddress.startsWith('0x') || newSignerAddress.length !== 42) {
      alert('Please enter a valid Ethereum address');
      return;
    }
    
    // Check if address already exists
    if (vaultSigners.some(signer => signer.address.toLowerCase() === newSignerAddress.toLowerCase())) {
      alert('This address is already added as a signer');
      return;
    }
    
    // Create a new signer with the required structure
    const newSigner: Signer = {
      id: (vaultSigners.length + 1).toString(),
      address: newSignerAddress,
      name: newSignerName,
      status: 'pending' as const,
      role: 'signer' as const,
      timeAdded: new Date(),
      hasKey: false,
      timeConstraints: {
        enabled: false,
        startTime: "09:00",
        endTime: "17:00",
        allowedDays: [1, 2, 3, 4, 5], // Monday to Friday
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      transactionPermissions: {
        enabled: false,
        allowedTypes: [
          TransactionType.TRANSFER,
          TransactionType.CONTRACT_INTERACTION,
          TransactionType.RECOVERY,
          TransactionType.SETTINGS_CHANGE,
          TransactionType.ADD_SIGNER,
          TransactionType.REMOVE_SIGNER,
          TransactionType.CHANGE_THRESHOLD
        ],
        approvalLimits: {
          [TransactionType.TRANSFER]: {
            maxAmount: "1000",
            allowedDestinations: []
          },
          [TransactionType.CONTRACT_INTERACTION]: {
            allowedContracts: [],
            allowedMethods: []
          }
        }
      }
    };
    
    const newSigners = [
      ...vaultSigners,
      newSigner
    ];
    
    setVaultSigners(newSigners);
    setNewSignerAddress("");
    setNewSignerName("");
    
    // Update threshold if needed
    if (signersThreshold > newSigners.length) {
      setSignersThreshold(newSigners.length);
    }
  };
  
  const removeSigner = (id: string) => {
    const newSigners = vaultSigners.filter(signer => signer.id !== id);
    setVaultSigners(newSigners);
    
    // Adjust threshold if needed
    if (signersThreshold > newSigners.length) {
      setSignersThreshold(newSigners.length);
    }
  };
  
  // Social Recovery Management
  const addGuardian = () => {
    if (!newGuardian.name || !newGuardian.address) return;
    
    // Basic address validation - would be more sophisticated in production
    if (!newGuardian.address.startsWith('0x') || newGuardian.address.length !== 42) {
      alert('Please enter a valid Ethereum address');
      return;
    }
    
    // Check if address already exists
    if (recoveryGuardians.some(guardian => guardian.address.toLowerCase() === newGuardian.address.toLowerCase())) {
      alert('This address is already added as a guardian');
      return;
    }
    
    const newGuardians = [
      ...recoveryGuardians,
      {
        id: (recoveryGuardians.length + 1).toString(),
        address: newGuardian.address,
        name: newGuardian.name,
        email: newGuardian.email,
        status: 'pending' as const,
        timeAdded: new Date(),
      }
    ];
    
    setRecoveryGuardians(newGuardians);
    setNewGuardian({
      name: '',
      address: '',
      email: ''
    });
    
    // Update threshold if needed
    if (guardianThreshold > newGuardians.length) {
      setGuardianThreshold(newGuardians.length);
    }
  };
  
  const removeGuardian = (id: string) => {
    const newGuardians = recoveryGuardians.filter(guardian => guardian.id !== id);
    setRecoveryGuardians(newGuardians);
    
    // Adjust threshold if needed
    if (guardianThreshold > newGuardians.length) {
      setGuardianThreshold(newGuardians.length);
    }
  };
  
  const initiateRecovery = () => {
    setRecoveryInitiated(true);
    setRecoveryStep(1);
    setRecoveryApprovals(0);
    
    // In a real app, this would trigger notifications to all guardians
    console.log('Recovery process initiated. Notifying guardians.');
  };
  
  const approveRecovery = (guardianId: string) => {
    setRecoveryApprovals(prevApprovals => prevApprovals + 1);
    
    // In a real app, this would be a blockchain transaction
    console.log(`Guardian ${guardianId} approved the recovery.`);
    
    // If we've reached the threshold, move to the next step
    if (recoveryApprovals + 1 >= guardianThreshold) {
      setRecoveryStep(3);
    }
  };
  
  const completeRecovery = () => {
    // In a real app, this would finalize the recovery and transfer ownership
    console.log('Recovery process completed. Vault ownership transferred.');
    setRecoveryStep(4);
  };
  
  // Transaction functions
  const createTransaction = () => {
    if (!newTransaction.description) return;
    
    // Validate based on transaction type
    if (newTransaction.type === 'send' && (!newTransaction.destination || !newTransaction.amount)) {
      alert('Please provide a destination address and amount for transfers');
      return;
    }
    
    if (newTransaction.type === 'contract' && (!newTransaction.contractMethod)) {
      alert('Please provide a method name for contract interactions');
      return;
    }
    
    const transaction: Transaction = {
      id: `tx-${Math.floor(Math.random() * 1000)}`,
      type: newTransaction.type,
      status: 'pending',
      description: newTransaction.description,
      requiredSignatures: signersThreshold,
      currentSignatures: 1, // Creator automatically signs
      signers: [vaultSigners[0].address], // Creator's address
      creator: vaultSigners[0].address,
      timeCreated: new Date(),
      expirationTime: new Date(Date.now() + (transactionExpiry * 86400000)), // days to ms
      ...(newTransaction.type === 'send' && {
        amount: newTransaction.amount,
        destination: newTransaction.destination
      }),
      ...(newTransaction.type === 'contract' && {
        contractInteraction: {
          method: newTransaction.contractMethod || '',
          params: newTransaction.contractParams || ''
        }
      })
    };
    
    setTransactions([transaction, ...transactions]);
    
    // Reset new transaction form
    setNewTransaction({
      type: 'send',
      description: '',
      destination: '',
      amount: '',
      contractMethod: '',
      contractParams: ''
    });
  };
  
  const signTransaction = (id: string) => {
    setTransactions(transactions.map(tx => {
      if (tx.id === id) {
        // Check if already signed by all required signers
        if (tx.currentSignatures >= tx.requiredSignatures) {
          return tx;
        }
        
        // Add the current signer's address
        const newSigners = [...tx.signers, vaultSigners[0].address];
        const newSignatureCount = newSigners.length;
        
        // Check if this signature completes the requirements
        const newStatus = newSignatureCount >= tx.requiredSignatures ? 'approved' : 'pending';
        
        return {
          ...tx,
          signers: newSigners,
          currentSignatures: newSignatureCount,
          status: newStatus
        };
      }
      return tx;
    }));
  };
  
  const rejectTransaction = (id: string) => {
    setTransactions(transactions.map(tx => {
      if (tx.id === id) {
        return {
          ...tx,
          status: 'rejected'
        };
      }
      return tx;
    }));
  };
  
  const executeTransaction = (id: string) => {
    setTransactions(transactions.map(tx => {
      if (tx.id === id && tx.status === 'approved') {
        // In a real app, this would trigger the actual blockchain transaction
        return {
          ...tx,
          status: 'executed',
          timeExecuted: new Date()
        };
      }
      return tx;
    }));
  };
  
  // Utility function to check if a signer can sign based on time constraints
  const canSignBasedOnTimeConstraints = (signer: Signer): boolean => {
    if (!signer.timeConstraints || !signer.timeConstraints.enabled) {
      return true; // No time constraints
    }
    
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Check if current day is allowed
    if (!signer.timeConstraints.allowedDays.includes(day)) {
      return false;
    }
    
    // Check effective dates if set
    if (signer.timeConstraints.effectiveFrom && now < signer.timeConstraints.effectiveFrom) {
      return false;
    }
    
    if (signer.timeConstraints.effectiveUntil && now > signer.timeConstraints.effectiveUntil) {
      return false;
    }
    
    // Check time of day
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour * 60 + currentMinute; // minutes since midnight
    
    const [startHour, startMinute] = signer.timeConstraints.startTime.split(':').map(Number);
    const [endHour, endMinute] = signer.timeConstraints.endTime.split(':').map(Number);
    
    const startTime = startHour * 60 + startMinute;
    const endTime = endHour * 60 + endMinute;
    
    return currentTime >= startTime && currentTime <= endTime;
  };
  
  // Return the component UI
  return (
    <div className="container mx-auto">
      <div className="space-y-8">
        {/* Progress indicator for vault creation */}
        {createMode && (
          <Card className="bg-black/40 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2 text-[#3F51FF]" />
                Vault Creation Progress
              </CardTitle>
              <CardDescription>Complete all steps to create your vault</CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={getCurrentProgress()} className="h-2 mb-2" />
              <div className="text-sm text-gray-400">{getCurrentProgress()}% Complete</div>
            </CardContent>
          </Card>
        )}
        
        {/* Vault Overview Section */}
        <Card className="bg-black/40 border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lock className="w-5 h-5 mr-2 text-[#3F51FF]" />
              {createMode ? "Configure Your Vault" : "Vault Overview"}
            </CardTitle>
            <CardDescription>
              {createMode 
                ? "Set up your multi-signature vault details and access requirements" 
                : "Manage your multi-signature vault settings and assets"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="vault-name">Vault Name</Label>
                  <Input 
                    id="vault-name" 
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Enter a name for your vault"
                    className="bg-black/60 border-gray-800 mt-1.5"
                    disabled={!createMode && isReadOnly}
                  />
                </div>
                
                <div>
                  <Label htmlFor="vault-description">Description</Label>
                  <Textarea 
                    id="vault-description" 
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Describe the purpose of this vault"
                    className="bg-black/60 border-gray-800 mt-1.5 resize-none h-20"
                    disabled={!createMode && isReadOnly}
                  />
                </div>
                
                <div>
                  <Label htmlFor="blockchain">Blockchain</Label>
                  <Select 
                    disabled={!createMode}
                    value={selectedBlockchain.toString()}
                    onValueChange={(value) => setSelectedBlockchain(parseInt(value) as BlockchainType)}
                  >
                    <SelectTrigger className="bg-black/60 border-gray-800 mt-1.5">
                      <SelectValue placeholder="Select blockchain" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={BlockchainType.ETHEREUM.toString()}>Ethereum</SelectItem>
                      <SelectItem value={BlockchainType.SOLANA.toString()}>Solana</SelectItem>
                      <SelectItem value={BlockchainType.TON.toString()}>TON</SelectItem>
                      <SelectItem value={BlockchainType.BITCOIN.toString()}>Bitcoin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Signers & Security */}
        <Card className="bg-black/40 border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2 text-[#3F51FF]" />
              Signers Configuration
            </CardTitle>
            <CardDescription>Manage signers and approval requirements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Signature Threshold */}
              <div>
                <Label className="mb-3 block">Signature Threshold</Label>
                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-black/80 p-4 rounded-md border border-gray-800">
                    <div className="text-2xl font-bold text-center text-white mb-1.5">{signersThreshold} of {vaultSigners.length}</div>
                    <div className="text-xs text-center text-gray-500">Required Approvals</div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 px-2 bg-black/40"
                      onClick={() => setSignersThreshold(Math.min(vaultSigners.length, signersThreshold + 1))}
                      disabled={signersThreshold >= vaultSigners.length}
                    >
                      +
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 px-2 bg-black/40"
                      onClick={() => setSignersThreshold(Math.max(1, signersThreshold - 1))}
                      disabled={signersThreshold <= 1}
                    >
                      -
                    </Button>
                  </div>
                </div>
              </div>
              
              <div>
                <Label className="mb-3 block">Signers</Label>
                <div className="space-y-3">
                  {vaultSigners.map((signer) => (
                    <div 
                      key={signer.id} 
                      className="p-3 bg-black/40 rounded-md border border-gray-800"
                    >
                      {/* Mobile-friendly signer layout */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex items-center space-x-3">
                          <div className="bg-[#3F51FF]/20 p-2 rounded-full min-w-[32px] flex-shrink-0">
                            {signer.hasKey ? (
                              <Key className="h-4 w-4 text-green-500" />
                            ) : (
                              <Fingerprint className="h-4 w-4 text-blue-500" />
                            )}
                          </div>
                          <div className="overflow-hidden">
                            <div className="font-medium">{signer.name}</div>
                            <div className="text-xs text-gray-500 font-mono truncate">{signer.address}</div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end gap-3">
                          {signer.role === 'owner' ? (
                            <Badge variant="outline" className="bg-purple-900/30 text-purple-400 border-purple-800">Owner</Badge>
                          ) : (
                            <Badge variant="outline" className="bg-blue-900/30 text-blue-400 border-blue-800">Signer</Badge>
                          )}
                          
                          {/* Time constraint status indicator */}
                          {signer.timeConstraints.enabled && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="flex items-center">
                                    <Clock className={`h-4 w-4 ${canSignBasedOnTimeConstraints(signer) ? 'text-green-500' : 'text-red-500'}`} />
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                  {canSignBasedOnTimeConstraints(signer) 
                                    ? 'Can sign transactions now (within allowed time window)' 
                                    : 'Cannot sign transactions now (outside allowed time window)'}
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                          
                          {signer.role !== 'owner' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeSigner(signer.id)}
                              className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      {/* Accordion for detailed settings */}
                      <Accordion type="single" collapsible className="mt-2">
                        <AccordionItem value={`signer-${signer.id}`} className="border-t border-gray-800">
                          <AccordionTrigger className="py-2 text-sm">Signer Settings</AccordionTrigger>
                          <AccordionContent>
                            {/* Time-based access constraints */}
                            <div className="mt-3 pt-3 border-t border-gray-800">
                              <div className="flex justify-between items-center mb-2">
                                <Label htmlFor={`time-constraints-${signer.id}`} className="text-sm font-medium flex items-center gap-1">
                                  <Clock10 className="h-3.5 w-3.5 text-gray-400" />
                                  Time-based Access Constraints
                                </Label>
                                <Switch 
                                  id={`time-constraints-${signer.id}`} 
                                  checked={signer.timeConstraints.enabled}
                                  onCheckedChange={(checked) => {
                                    setVaultSigners(vaultSigners.map(s => 
                                      s.id === signer.id 
                                        ? { 
                                            ...s, 
                                            timeConstraints: { 
                                              ...s.timeConstraints, 
                                              enabled: checked 
                                            } 
                                          } 
                                        : s
                                    ))
                                  }}
                                  className="ml-2"
                                />
                              </div>
                              
                              {signer.timeConstraints.enabled && (
                                <div className="space-y-3 mt-3">
                                  <div className="grid grid-cols-2 gap-3">
                                    <div>
                                      <Label htmlFor={`start-time-${signer.id}`} className="text-xs">Start Time</Label>
                                      <Input 
                                        id={`start-time-${signer.id}`}
                                        type="time" 
                                        value={signer.timeConstraints.startTime}
                                        onChange={(e) => {
                                          setVaultSigners(vaultSigners.map(s => 
                                            s.id === signer.id 
                                              ? { 
                                                  ...s, 
                                                  timeConstraints: { 
                                                    ...s.timeConstraints, 
                                                    startTime: e.target.value 
                                                  } 
                                                } 
                                              : s
                                          ))
                                        }}
                                        className="bg-black/40 border-gray-700 h-8 text-xs mt-1"
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor={`end-time-${signer.id}`} className="text-xs">End Time</Label>
                                      <Input 
                                        id={`end-time-${signer.id}`}
                                        type="time" 
                                        value={signer.timeConstraints.endTime}
                                        onChange={(e) => {
                                          setVaultSigners(vaultSigners.map(s => 
                                            s.id === signer.id 
                                              ? { 
                                                  ...s, 
                                                  timeConstraints: { 
                                                    ...s.timeConstraints, 
                                                    endTime: e.target.value 
                                                  } 
                                                } 
                                              : s
                                          ))
                                        }}
                                        className="bg-black/40 border-gray-700 h-8 text-xs mt-1"
                                      />
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <Label className="text-xs block mb-1.5">Allowed Days</Label>
                                    <div className="flex flex-wrap gap-2">
                                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                                        <div key={day} className="flex items-center space-x-1">
                                          <Checkbox 
                                            id={`day-${index}-${signer.id}`}
                                            checked={signer.timeConstraints.allowedDays.includes(index)}
                                            onCheckedChange={(checked) => {
                                              setVaultSigners(vaultSigners.map(s => {
                                                if (s.id !== signer.id) return s;
                                                
                                                let newAllowedDays = [...s.timeConstraints.allowedDays];
                                                if (checked) {
                                                  if (!newAllowedDays.includes(index)) {
                                                    newAllowedDays.push(index);
                                                  }
                                                } else {
                                                  newAllowedDays = newAllowedDays.filter(d => d !== index);
                                                }
                                                
                                                return {
                                                  ...s,
                                                  timeConstraints: {
                                                    ...s.timeConstraints,
                                                    allowedDays: newAllowedDays
                                                  }
                                                };
                                              }))
                                            }}
                                            className="h-3.5 w-3.5"
                                          />
                                          <Label htmlFor={`day-${index}-${signer.id}`} className="text-xs">{day}</Label>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            {/* Custom signing policies */}
                            <div className="mt-3 pt-3 border-t border-gray-800">
                              <div className="flex justify-between items-center mb-2">
                                <Label htmlFor={`transaction-permissions-${signer.id}`} className="text-sm font-medium flex items-center gap-1">
                                  <FileLock2 className="h-3.5 w-3.5 text-gray-400" />
                                  Custom Signing Policies
                                </Label>
                                <Switch 
                                  id={`transaction-permissions-${signer.id}`} 
                                  checked={signer.transactionPermissions.enabled}
                                  onCheckedChange={(checked) => {
                                    setVaultSigners(vaultSigners.map(s => 
                                      s.id === signer.id 
                                        ? { 
                                            ...s, 
                                            transactionPermissions: { 
                                              ...s.transactionPermissions, 
                                              enabled: checked 
                                            } 
                                          } 
                                        : s
                                    ))
                                  }}
                                  className="ml-2"
                                />
                              </div>
                              
                              {signer.transactionPermissions.enabled && (
                                <div className="space-y-3 mt-3">
                                  <div>
                                    <Label className="text-xs block mb-1.5">Transaction Types</Label>
                                    <div className="flex flex-wrap gap-2">
                                      {Object.values(TransactionType).map((type) => (
                                        <div key={type} className="flex items-center space-x-1">
                                          <Checkbox 
                                            id={`type-${type}-${signer.id}`}
                                            checked={signer.transactionPermissions.allowedTypes.includes(type)}
                                            onCheckedChange={(checked) => {
                                              setVaultSigners(vaultSigners.map(s => {
                                                if (s.id !== signer.id) return s;
                                                
                                                let newAllowedTypes = [...s.transactionPermissions.allowedTypes];
                                                if (checked) {
                                                  if (!newAllowedTypes.includes(type)) {
                                                    newAllowedTypes.push(type);
                                                  }
                                                } else {
                                                  newAllowedTypes = newAllowedTypes.filter(t => t !== type);
                                                }
                                                
                                                return {
                                                  ...s,
                                                  transactionPermissions: {
                                                    ...s.transactionPermissions,
                                                    allowedTypes: newAllowedTypes
                                                  }
                                                };
                                              }))
                                            }}
                                            className="h-3.5 w-3.5"
                                          />
                                          <Label htmlFor={`type-${type}-${signer.id}`} className="text-xs">
                                            {type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                          </Label>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                  
                                  {signer.transactionPermissions.allowedTypes.includes(TransactionType.TRANSFER) && (
                                    <div>
                                      <Label htmlFor={`max-amount-${signer.id}`} className="text-xs">Maximum Transfer Amount</Label>
                                      <Input 
                                        id={`max-amount-${signer.id}`}
                                        type="text" 
                                        value={signer.transactionPermissions.approvalLimits[TransactionType.TRANSFER].maxAmount}
                                        onChange={(e) => {
                                          setVaultSigners(vaultSigners.map(s => {
                                            if (s.id !== signer.id) return s;
                                            
                                            return {
                                              ...s,
                                              transactionPermissions: {
                                                ...s.transactionPermissions,
                                                approvalLimits: {
                                                  ...s.transactionPermissions.approvalLimits,
                                                  [TransactionType.TRANSFER]: {
                                                    ...s.transactionPermissions.approvalLimits[TransactionType.TRANSFER],
                                                    maxAmount: e.target.value
                                                  }
                                                }
                                              }
                                            };
                                          }))
                                        }}
                                        className="bg-black/40 border-gray-700 h-8 text-xs mt-1"
                                        placeholder="Max amount (e.g. 1000)"
                                      />
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Add New Signer */}
              {!isReadOnly && (
                <div className="mt-4 p-4 bg-black/40 rounded-md border border-gray-800">
                  <h4 className="text-sm font-medium mb-3">Add New Signer</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <div>
                      <Label htmlFor="new-signer-name" className="text-xs">Name</Label>
                      <Input 
                        id="new-signer-name"
                        value={newSignerName}
                        onChange={(e) => setNewSignerName(e.target.value)}
                        placeholder="Enter signer name"
                        className="bg-black/60 border-gray-700 h-9 mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="new-signer-address" className="text-xs">Address</Label>
                      <Input 
                        id="new-signer-address"
                        value={newSignerAddress}
                        onChange={(e) => setNewSignerAddress(e.target.value)}
                        placeholder="0x..."
                        className="bg-black/60 border-gray-700 h-9 mt-1 font-mono"
                      />
                    </div>
                  </div>
                  <Button 
                    onClick={addSigner}
                    disabled={!newSignerName || !newSignerAddress}
                    className="w-full"
                    variant="outline"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Signer
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Transactions Tab - Only shown for existing vaults */}
        {!createMode && (
          <Card className="bg-black/40 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center">
                <ArrowUpRight className="w-5 h-5 mr-2 text-[#3F51FF]" />
                Transactions
              </CardTitle>
              <CardDescription>Manage and track vault transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="pending">
                <TabsList className="bg-black/60 mb-4">
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                  <TabsTrigger value="create">Create</TabsTrigger>
                </TabsList>
                
                <TabsContent value="pending" className="space-y-4">
                  {transactions.filter(tx => tx.status === 'pending').length === 0 ? (
                    <div className="text-center p-6 bg-black/20 rounded-md border border-gray-800">
                      <p className="text-gray-500">No pending transactions</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-800">
                      {transactions
                        .filter(tx => tx.status === 'pending')
                        .map(transaction => (
                          <div key={transaction.id} className="py-4 first:pt-0 last:pb-0">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                              <div>
                                <h4 className="font-medium">{transaction.description}</h4>
                                <p className="text-sm text-gray-500">
                                  {transaction.type === 'send' 
                                    ? `Send ${transaction.amount} to ${transaction.destination?.substring(0, 8)}...`
                                    : `Contract: ${transaction.contractInteraction?.method}`
                                  }
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="bg-amber-900/20 text-amber-400 border-amber-800">
                                  {transaction.currentSignatures} of {transaction.requiredSignatures} signatures
                                </Badge>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2 mt-3">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="bg-green-900/20 text-green-400 border-green-800 hover:bg-green-900/40"
                                onClick={() => signTransaction(transaction.id)}
                              >
                                <CheckCircle2 className="h-4 w-4 mr-1" />
                                Sign
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="bg-red-900/20 text-red-400 border-red-800 hover:bg-red-900/40"
                                onClick={() => rejectTransaction(transaction.id)}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="history">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Description</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead>Signatures</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transactions
                          .filter(tx => tx.status !== 'pending')
                          .map(transaction => (
                            <TableRow key={transaction.id}>
                              <TableCell className="font-medium">{transaction.description}</TableCell>
                              <TableCell>{transaction.type}</TableCell>
                              <TableCell>
                                <Badge 
                                  variant="outline" 
                                  className={
                                    transaction.status === 'approved' 
                                      ? "bg-green-900/20 text-green-400 border-green-800" 
                                      : transaction.status === 'rejected'
                                        ? "bg-red-900/20 text-red-400 border-red-800"
                                        : transaction.status === 'executed'
                                          ? "bg-blue-900/20 text-blue-400 border-blue-800"
                                          : "bg-gray-900/20 text-gray-400 border-gray-800"
                                  }
                                >
                                  {transaction.status}
                                </Badge>
                              </TableCell>
                              <TableCell>{new Date(transaction.timeCreated).toLocaleDateString()}</TableCell>
                              <TableCell>{transaction.currentSignatures}/{transaction.requiredSignatures}</TableCell>
                              <TableCell className="text-right">
                                {transaction.status === 'approved' && (
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="bg-blue-900/20 text-blue-400 border-blue-800 hover:bg-blue-900/40"
                                    onClick={() => executeTransaction(transaction.id)}
                                  >
                                    Execute
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
                
                {/* Enhanced Transaction Analytics Tab */}
                <TabsContent value="analytics">
                  <div className="space-y-6">
                    {/* Transaction Volume Overview */}
                    <div className="bg-black/30 p-4 rounded-lg border border-gray-800">
                      <h3 className="text-lg font-medium mb-4">Transaction Status Distribution</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {/* Pending Transactions */}
                        <div className="bg-amber-900/20 p-3 rounded-md border border-amber-800/40">
                          <div className="text-2xl font-bold text-amber-400">
                            {transactions.filter(tx => tx.status === 'pending').length}
                          </div>
                          <div className="text-xs text-gray-400">Pending</div>
                        </div>
                        
                        {/* Executed Transactions */}
                        <div className="bg-blue-900/20 p-3 rounded-md border border-blue-800/40">
                          <div className="text-2xl font-bold text-blue-400">
                            {transactions.filter(tx => tx.status === 'executed').length}
                          </div>
                          <div className="text-xs text-gray-400">Executed</div>
                        </div>
                        
                        {/* Approved Transactions */}
                        <div className="bg-green-900/20 p-3 rounded-md border border-green-800/40">
                          <div className="text-2xl font-bold text-green-400">
                            {transactions.filter(tx => tx.status === 'approved').length}
                          </div>
                          <div className="text-xs text-gray-400">Approved</div>
                        </div>
                        
                        {/* Rejected Transactions */}
                        <div className="bg-red-900/20 p-3 rounded-md border border-red-800/40">
                          <div className="text-2xl font-bold text-red-400">
                            {transactions.filter(tx => tx.status === 'rejected').length}
                          </div>
                          <div className="text-xs text-gray-400">Rejected</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Transaction Types Distribution */}
                    <div className="bg-black/30 p-4 rounded-lg border border-gray-800">
                      <h3 className="text-lg font-medium mb-4">Transaction Types</h3>
                      <div className="space-y-3">
                        {/* Send Transactions */}
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-gray-400">Send</span>
                            <span className="text-sm text-gray-400">
                              {transactions.filter(tx => tx.type === 'send').length} transactions
                            </span>
                          </div>
                          <div className="w-full bg-gray-800 rounded-full h-2.5">
                            <div 
                              className="bg-purple-600 h-2.5 rounded-full" 
                              style={{ 
                                width: `${(transactions.filter(tx => tx.type === 'send').length / transactions.length) * 100}%` 
                              }}
                            ></div>
                          </div>
                        </div>
                        
                        {/* Contract Interactions */}
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-gray-400">Contract</span>
                            <span className="text-sm text-gray-400">
                              {transactions.filter(tx => tx.type === 'contract').length} transactions
                            </span>
                          </div>
                          <div className="w-full bg-gray-800 rounded-full h-2.5">
                            <div 
                              className="bg-cyan-600 h-2.5 rounded-full" 
                              style={{ 
                                width: `${(transactions.filter(tx => tx.type === 'contract').length / transactions.length) * 100}%` 
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Signer Activity */}
                    <div className="bg-black/30 p-4 rounded-lg border border-gray-800">
                      <h3 className="text-lg font-medium mb-4">Signer Activity</h3>
                      <div className="space-y-3">
                        {vaultSigners.map(signer => {
                          // Calculate how many transactions this signer has signed
                          const signedCount = transactions.filter(tx => 
                            tx.signers.includes(signer.address)
                          ).length;
                          
                          // Calculate percentage
                          const percentage = transactions.length > 0 
                            ? Math.round((signedCount / transactions.length) * 100) 
                            : 0;
                            
                          return (
                            <div key={signer.id}>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm text-gray-400">{signer.name}</span>
                                <span className="text-sm text-gray-400">
                                  {signedCount} signatures ({percentage}%)
                                </span>
                              </div>
                              <div className="w-full bg-gray-800 rounded-full h-2.5">
                                <div 
                                  className={`h-2.5 rounded-full ${
                                    signer.role === 'owner' 
                                      ? 'bg-purple-600' 
                                      : 'bg-blue-600'
                                  }`}
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    
                    {/* Response Time Analysis */}
                    <div className="bg-black/30 p-4 rounded-lg border border-gray-800">
                      <h3 className="text-lg font-medium mb-2">Average Response Time</h3>
                      <p className="text-sm text-gray-400 mb-4">
                        Typical time between transaction creation and execution
                      </p>
                      
                      <div className="flex items-center justify-center p-4">
                        <div className="text-center">
                          <div className="text-4xl font-bold text-[#3F51FF]">16.4</div>
                          <div className="text-sm text-gray-400">hours</div>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-2">Response Time Trend</h4>
                        <div className="h-24 flex items-end space-x-2">
                          {[35, 42, 28, 65, 72, 43, 51, 58, 40, 56, 62, 48].map((height, index) => (
                            <div 
                              key={index}
                              className="bg-[#3F51FF]/60 rounded-t w-full"
                              style={{ height: `${height}%` }}
                            ></div>
                          ))}
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>Apr</span>
                          <span>May</span>
                          <span>Jun</span>
                          <span>Jul</span>
                          <span>Aug</span>
                          <span>Sep</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Transaction Value Analysis */}
                    <div className="bg-black/30 p-4 rounded-lg border border-gray-800">
                      <h3 className="text-lg font-medium mb-2">Transaction Value Analysis</h3>
                      <p className="text-sm text-gray-400 mb-4">
                        Distribution of transaction values over time
                      </p>
                      
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-black/20 p-3 rounded-md border border-gray-800">
                            <h4 className="text-sm font-medium text-gray-400 mb-1">Highest Value</h4>
                            <div className="text-xl font-bold text-white">
                              {Math.max(...transactions
                                .filter(tx => tx.type === 'send' && tx.amount)
                                .map(tx => {
                                  // Extract numeric part and convert to number
                                  const match = tx.amount?.match(/[\d.]+/);
                                  return match ? parseFloat(match[0]) : 0;
                                }))} ETH
                            </div>
                          </div>
                          
                          <div className="bg-black/20 p-3 rounded-md border border-gray-800">
                            <h4 className="text-sm font-medium text-gray-400 mb-1">Average Value</h4>
                            <div className="text-xl font-bold text-white">
                              {(transactions
                                .filter(tx => tx.type === 'send' && tx.amount)
                                .map(tx => {
                                  // Extract numeric part and convert to number
                                  const match = tx.amount?.match(/[\d.]+/);
                                  return match ? parseFloat(match[0]) : 0;
                                })
                                .reduce((sum, val) => sum + val, 0) / 
                                (transactions.filter(tx => tx.type === 'send' && tx.amount).length || 1))
                                .toFixed(2)} ETH
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <h4 className="text-sm font-medium mb-2">Value Distribution</h4>
                          <div className="h-32 flex items-end space-x-1">
                            {transactions
                              .filter(tx => tx.type === 'send' && tx.amount)
                              .slice(0, 12)
                              .map((tx, index) => {
                                // Extract numeric part and convert to number
                                const match = tx.amount?.match(/[\d.]+/);
                                const value = match ? parseFloat(match[0]) : 0;
                                const maxHeight = 100; // Maximum height percentage
                                const maxValue = 30; // Assumed maximum value for scaling
                                const heightPercentage = Math.min((value / maxValue) * maxHeight, maxHeight);
                                
                                return (
                                  <div 
                                    key={index}
                                    className="relative flex-1"
                                  >
                                    <div 
                                      className={`
                                        ${tx.status === 'executed' ? 'bg-blue-500/70' : 
                                          tx.status === 'approved' ? 'bg-green-500/70' : 
                                          tx.status === 'rejected' ? 'bg-red-500/70' : 'bg-amber-500/70'}
                                        rounded-t
                                      `}
                                      style={{ height: `${heightPercentage}%` }}
                                    ></div>
                                    <div className="text-xs text-gray-500 mt-1 text-center overflow-hidden truncate">
                                      {value} ETH
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="create">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="transaction-type">Transaction Type</Label>
                      <Select
                        value={newTransaction.type}
                        onValueChange={(value) => setNewTransaction({...newTransaction, type: value})}
                      >
                        <SelectTrigger id="transaction-type" className="bg-black/60 border-gray-800 mt-1.5">
                          <SelectValue placeholder="Select transaction type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="send">Asset Transfer</SelectItem>
                          <SelectItem value="contract">Contract Interaction</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="transaction-description">Description</Label>
                      <Input 
                        id="transaction-description"
                        value={newTransaction.description}
                        onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                        placeholder="Purpose of this transaction"
                        className="bg-black/60 border-gray-800 mt-1.5"
                      />
                    </div>
                    
                    {newTransaction.type === 'send' && (
                      <>
                        <div>
                          <Label htmlFor="transaction-destination">Destination Address</Label>
                          <Input 
                            id="transaction-destination"
                            value={newTransaction.destination || ''}
                            onChange={(e) => setNewTransaction({...newTransaction, destination: e.target.value})}
                            placeholder="0x..."
                            className="bg-black/60 border-gray-800 mt-1.5 font-mono"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="transaction-amount">Amount</Label>
                          <Input 
                            id="transaction-amount"
                            value={newTransaction.amount || ''}
                            onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                            placeholder="Amount to send"
                            className="bg-black/60 border-gray-800 mt-1.5"
                          />
                        </div>
                      </>
                    )}
                    
                    {newTransaction.type === 'contract' && (
                      <>
                        <div>
                          <Label htmlFor="transaction-method">Method Name</Label>
                          <Input 
                            id="transaction-method"
                            value={newTransaction.contractMethod || ''}
                            onChange={(e) => setNewTransaction({...newTransaction, contractMethod: e.target.value})}
                            placeholder="Contract method to call"
                            className="bg-black/60 border-gray-800 mt-1.5"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="transaction-params">Parameters (JSON)</Label>
                          <Textarea 
                            id="transaction-params"
                            value={newTransaction.contractParams || ''}
                            onChange={(e) => setNewTransaction({...newTransaction, contractParams: e.target.value})}
                            placeholder='{"param1": "value1", "param2": 123}'
                            className="bg-black/60 border-gray-800 mt-1.5 resize-none h-20 font-mono"
                          />
                        </div>
                      </>
                    )}
                    
                    <Button 
                      onClick={createTransaction}
                      disabled={!newTransaction.description || (
                        newTransaction.type === 'send' && (!newTransaction.destination || !newTransaction.amount)
                      ) || (
                        newTransaction.type === 'contract' && !newTransaction.contractMethod
                      )}
                      className="w-full mt-4"
                    >
                      Create Transaction
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
        
        {/* Hardware Wallet Integration */}
        <Card className="bg-black/40 border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2 text-[#3F51FF]" />
              Advanced Security Settings
            </CardTitle>
            <CardDescription>Configure hardware wallet integration and additional security measures</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Hardware Wallet Integration */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-medium">Hardware Wallet Support</h3>
                    <p className="text-sm text-gray-500">
                      Enable hardware wallet integration for enhanced security
                    </p>
                  </div>
                  <Switch 
                    checked={enableHardwareKey}
                    onCheckedChange={setEnableHardwareKey}
                  />
                </div>
                
                {enableHardwareKey && (
                  <div className="bg-black/30 p-4 rounded-lg border border-gray-800 space-y-4">
                    {/* Supported Hardware Wallets */}
                    <div>
                      <h4 className="text-sm font-medium mb-2">Supported Devices</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="bg-black/40 p-3 rounded-md border border-gray-800 flex items-center space-x-3">
                          <div className="bg-blue-900/30 p-2 rounded-full">
                            <svg className="h-4 w-4 text-blue-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <rect width="24" height="24" rx="4" fill="currentColor" fillOpacity="0.2" />
                              <path d="M7 12H17M12 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                          </div>
                          <span className="text-sm">Ledger</span>
                        </div>
                        
                        <div className="bg-black/40 p-3 rounded-md border border-gray-800 flex items-center space-x-3">
                          <div className="bg-purple-900/30 p-2 rounded-full">
                            <svg className="h-4 w-4 text-purple-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <rect width="24" height="24" rx="4" fill="currentColor" fillOpacity="0.2" />
                              <path d="M8 12H16M8 8H16M8 16H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                          </div>
                          <span className="text-sm">Trezor</span>
                        </div>
                        
                        <div className="bg-black/40 p-3 rounded-md border border-gray-800 flex items-center space-x-3 opacity-50">
                          <div className="bg-gray-900/30 p-2 rounded-full">
                            <svg className="h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <rect width="24" height="24" rx="4" fill="currentColor" fillOpacity="0.2" />
                              <path d="M12 8V16M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                          </div>
                          <span className="text-sm">Other (Coming soon)</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Connection Status */}
                    <div>
                      <h4 className="text-sm font-medium mb-2">Connection Status</h4>
                      <div className="bg-black/60 p-3 rounded-md border border-gray-800">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="h-2 w-2 rounded-full bg-red-500"></div>
                            <span className="text-sm text-gray-400">No hardware wallet connected</span>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 bg-black/40 text-sm"
                          >
                            Connect
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Configuration Options */}
                    <div>
                      <h4 className="text-sm font-medium mb-2">Hardware Wallet Configuration</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">Require hardware confirmation for all transactions</span>
                          <Switch defaultChecked={true} />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">Auto-lock after 5 minutes of inactivity</span>
                          <Switch defaultChecked={true} />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">Enable advanced transaction details</span>
                          <Switch defaultChecked={false} />
                        </div>
                      </div>
                    </div>
                    
                    {/* Device Management */}
                    <div>
                      <h4 className="text-sm font-medium mb-2">Advanced Settings</h4>
                      <div className="space-y-2">
                        <Button variant="outline" size="sm" className="w-full justify-start bg-black/40 text-sm">
                          <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          Configure Device
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start bg-black/40 text-sm">
                          <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 15V17M6 21h12a3 3 0 003-3V8a3 3 0 00-3-3h-2.59a.1.1 0 00-.07.03l-3.76 3.76a.1.1 0 01-.07.03H8.59a.1.1 0 00-.07.03l-3.76 3.76a.1.1 0 01-.07.03H3a3 3 0 00-3 3v2a3 3 0 003 3h3-3zm0 0a3 3 0 01-3-3v-2a3 3 0 013-3h1.59a.1.1 0 00.07-.03l3.76-3.76a.1.1 0 01.07-.03h2.82a.1.1 0 00.07-.03l3.76-3.76a.1.1 0 01.07-.03H18a3 3 0 013 3v10a3 3 0 01-3 3H6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          Verify Firmware
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start bg-black/40 text-sm">
                          <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 14v7M12 14v7M16 14v7M3 21h18M3 10h18M3 7l9-4 9 4M4 10v11M20 10v11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          Test Connection
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Biometric Authentication */}
              <div className="pt-4 border-t border-gray-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-medium">Biometric Authentication</h3>
                    <p className="text-sm text-gray-500">
                      Enable fingerprint or face ID authentication for web transactions
                    </p>
                  </div>
                  <Switch 
                    checked={enableBiometrics}
                    onCheckedChange={setEnableBiometrics}
                  />
                </div>
              </div>
              
              {/* QR Code Signing */}
              <div className="pt-4 border-t border-gray-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-medium">QR Code Signing</h3>
                    <p className="text-sm text-gray-500">
                      Allow transaction signing via QR code scanning with mobile app
                    </p>
                  </div>
                  <Switch 
                    checked={enableQRSignature}
                    onCheckedChange={setEnableQRSignature}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Final Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          {createMode && (
            <Button 
              onClick={() => {
                if (onCreateVault) {
                  onCreateVault({
                    name,
                    description,
                    blockchain: selectedBlockchain,
                    threshold: signersThreshold,
                    signers: vaultSigners,
                    timelock,
                    securitySettings: {
                      enableHardwareKey,
                      enableQRSignature,
                      enableBiometrics,
                      enableRecovery,
                      enableEncryption
                    }
                  });
                }
              }}
              disabled={
                !name || 
                vaultSigners.length < 1 || 
                signersThreshold < 1 || 
                signersThreshold > vaultSigners.length
              }
              className="bg-gradient-to-r from-[#3F51FF] to-[#8B5CF6] hover:from-[#3647E3] hover:to-[#7B50DE]"
            >
              Create Vault
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}