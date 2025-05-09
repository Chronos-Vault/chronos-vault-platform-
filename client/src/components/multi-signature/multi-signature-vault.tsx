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

// Enum for blockchain types (this should match your existing enum if you have one)
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
  // Time-based access constraints
  timeConstraints: {
    enabled: boolean;
    startTime: string; // Format: "HH:MM" - 24-hour format
    endTime: string; // Format: "HH:MM" - 24-hour format
    allowedDays: number[]; // 0 = Sunday, 1 = Monday, etc.
    timeZone: string; // e.g., "America/New_York"
    effectiveFrom?: Date; // When these constraints become active (optional)
    effectiveUntil?: Date; // Optional expiration of these constraints
  };
  // Transaction type permissions for custom signing policies
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
      role: 'owner' as const,
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
    console.log('Recovery process initiated. Notifying guardians...');
  };
  
  const approveRecovery = (guardianId: string) => {
    // In a real app, this would verify the guardian's signature
    const newApprovals = recoveryApprovals + 1;
    setRecoveryApprovals(newApprovals);
    
    // Update guardian status
    setRecoveryGuardians(
      recoveryGuardians.map(guardian => 
        guardian.id === guardianId ? {...guardian, status: 'active' as const} : guardian
      )
    );
    
    // Move to next step if threshold reached
    if (newApprovals >= guardianThreshold) {
      setRecoveryStep(2);
    }
  };
  
  const completeRecovery = () => {
    // In a real app, this would generate new keys and update the blockchain
    setRecoveryStep(3);
    console.log('Recovery completed. New signing keys generated.');
    
    // Reset after a delay
    setTimeout(() => {
      setRecoveryInitiated(false);
      setRecoveryDialogOpen(false);
      setRecoveryStep(1);
      setRecoveryApprovals(0);
    }, 3000);
  };
  
  const handleCreateVault = () => {
    if (getCurrentProgress() < 100) {
      alert('Please complete all required fields before creating the vault');
      return;
    }
    
    const vaultData = {
      name,
      description,
      blockchain: selectedBlockchain,
      threshold: signersThreshold,
      signers: vaultSigners,
      timelock: timelockDays > 0 ? new Date(Date.now() + timelockDays * 24 * 60 * 60 * 1000) : undefined,
      securitySettings: {
        enableHardwareKey,
        enableQRSignature,
        enableBiometrics,
        enableRecovery,
        enableEncryption,
        activityNotifications,
        transactionExpiry,
        gasSettings
      }
    };
    
    if (onCreateVault) {
      onCreateVault(vaultData);
    }
    
    // In a real app, we would send this to the blockchain
    console.log('Creating vault with data:', vaultData);
    setCreateMode(false);
  };
  
  const submitTransaction = () => {
    // Validation
    if (newTransaction.type === 'send') {
      if (!newTransaction.destination || !newTransaction.amount || !newTransaction.description) {
        alert('Please fill all required fields');
        return;
      }
    } else if (newTransaction.type === 'contract') {
      if (!newTransaction.contractMethod || !newTransaction.description) {
        alert('Please fill all required fields');
        return;
      }
    }
    
    const transaction: Transaction = {
      id: `tx-${Math.floor(Math.random() * 10000)}`,
      type: newTransaction.type,
      status: 'pending',
      description: newTransaction.description,
      requiredSignatures: signersThreshold,
      currentSignatures: 1, // Creator signs automatically
      signers: [vaultSigners[0].address], // Add creator as first signer
      creator: vaultSigners[0].address,
      timeCreated: new Date(),
      expirationTime: new Date(Date.now() + transactionExpiry * 24 * 60 * 60 * 1000),
    };
    
    if (newTransaction.type === 'send') {
      transaction.amount = newTransaction.amount;
      transaction.destination = newTransaction.destination;
    } else if (newTransaction.type === 'contract') {
      transaction.contractInteraction = {
        method: newTransaction.contractMethod || '',
        params: newTransaction.contractParams || ''
      };
    }
    
    setTransactions([transaction, ...transactions]);
    
    // Reset form
    setNewTransaction({
      type: 'send',
      description: '',
      destination: '',
      amount: '',
      contractMethod: '',
      contractParams: ''
    });
  };
  
  const signTransaction = (txId: string) => {
    const currentSigner = vaultSigners[0];
    const transaction = transactions.find(tx => tx.id === txId);
    
    if (!transaction || transaction.status !== 'pending') {
      alert("This transaction is no longer pending and cannot be signed.");
      return;
    }
    
    if (transaction.signers.includes(currentSigner.address)) {
      alert("You have already signed this transaction.");
      return;
    }
    
    // Check time-based constraints
    if (currentSigner.timeConstraints?.enabled && !canSignerAccessAtCurrentTime(currentSigner)) {
      // Show detailed error message about time constraints
      const { startTime, endTime, allowedDays } = currentSigner.timeConstraints;
      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const allowedDaysText = allowedDays?.map(day => days[day]).join(", ");
      
      alert(
        `Time-based access denied: You can only sign transactions between ${startTime} and ${endTime} on ${allowedDaysText}.`
      );
      return;
    }
    
    // Check transaction type permissions
    if (currentSigner.transactionPermissions?.enabled) {
      // Map transaction type string to enum
      let txType: TransactionType;
      
      switch (transaction.type) {
        case 'send':
          txType = TransactionType.TRANSFER;
          break;
        case 'contract':
          txType = TransactionType.CONTRACT_INTERACTION;
          break;
        case 'add_signer':
          txType = TransactionType.ADD_SIGNER;
          break;
        case 'remove_signer':
          txType = TransactionType.REMOVE_SIGNER;
          break;
        case 'change_threshold':
          txType = TransactionType.CHANGE_THRESHOLD;
          break;
        case 'recovery':
          txType = TransactionType.RECOVERY;
          break;
        default:
          txType = TransactionType.SETTINGS_CHANGE;
      }
      
      // Check if transaction type is allowed
      if (!currentSigner.transactionPermissions.allowedTypes.includes(txType)) {
        alert(`Permission denied: You are not authorized to sign ${txType.replace(/_/g, ' ')} transactions.`);
        return;
      }
      
      // Check specific limits for transfers
      if (txType === TransactionType.TRANSFER && transaction.amount) {
        const limits = currentSigner.transactionPermissions.approvalLimits?.[TransactionType.TRANSFER];
        
        // Check maximum amount if specified
        if (limits?.maxAmount) {
          const [value, currency] = transaction.amount.split(' ');
          const numValue = parseFloat(value.replace(/,/g, ''));
          const maxAmount = parseFloat(limits.maxAmount);
          
          if (numValue > maxAmount) {
            alert(`Transaction amount exceeds your limit: You can only approve transactions up to ${maxAmount} ${currency}.`);
            return;
          }
        }
        
        // Check allowed destinations if specified and not empty
        if (limits?.allowedDestinations && 
            limits.allowedDestinations.length > 0 && 
            transaction.destination &&
            !limits.allowedDestinations.includes(transaction.destination)) {
          alert(`Destination not allowed: You can only send to pre-approved addresses.`);
          return;
        }
      }
      
      // Check contract interaction permissions
      if (txType === TransactionType.CONTRACT_INTERACTION && transaction.contractInteraction) {
        const limits = currentSigner.transactionPermissions.approvalLimits?.[TransactionType.CONTRACT_INTERACTION];
        
        // Check allowed methods if specified
        if (limits?.allowedMethods?.length && transaction.contractInteraction.method &&
            !limits.allowedMethods.includes(transaction.contractInteraction.method)) {
          alert(`Method not allowed: You can only approve specific contract methods.`);
          return;
        }
      }
    }
    
    // If all checks pass, sign the transaction
    setTransactions(transactions.map(tx => {
      if (tx.id === txId && tx.status === 'pending') {
        return {
          ...tx,
          currentSignatures: tx.currentSignatures + 1,
          signers: [...tx.signers, vaultSigners[0].address],
          status: tx.currentSignatures + 1 >= tx.requiredSignatures ? 'approved' : 'pending'
        };
      }
      return tx;
    }));
  };
  
  const executeTransaction = (txId: string) => {
    setTransactions(transactions.map(tx => {
      if (tx.id === txId && tx.status === 'approved') {
        return {
          ...tx,
          status: 'executed',
          timeExecuted: new Date()
        };
      }
      return tx;
    }));
    
    // In a real app, we would update the assets based on the transaction
    // For this demo, we'll simulate a transfer if it's a send transaction
    const tx = transactions.find(t => t.id === txId);
    if (tx?.type === 'send' && tx.amount && tx.destination) {
      // Parse amount (just for the demo)
      const [value, symbol] = tx.amount.split(' ');
      const numValue = parseFloat(value.replace(/,/g, ''));
      
      if (symbol === 'ETH') {
        setAssets(assets.map(asset => {
          if (asset.symbol === 'ETH') {
            return {
              ...asset,
              amount: (parseFloat(asset.amount.replace(/,/g, '')) - numValue).toString(),
              valueUSD: asset.valueUSD - (numValue * 3000) // simplified price calc
            };
          }
          return asset;
        }));
      }
    }
  };
  
  const rejectTransaction = (txId: string) => {
    setTransactions(transactions.map(tx => {
      if (tx.id === txId && (tx.status === 'pending' || tx.status === 'approved')) {
        return {
          ...tx,
          status: 'rejected'
        };
      }
      return tx;
    }));
  };
  
  // Check if a transaction can be signed based on time and permission constraints
  const canSignTransaction = (txId: string): boolean => {
    const currentSigner = vaultSigners[0]; // Assuming current user is the first signer
    
    // Check if the transaction exists and is pending
    const transaction = transactions.find(tx => tx.id === txId);
    if (!transaction || transaction.status !== 'pending') {
      return false;
    }
    
    // Check if already signed
    if (transaction.signers.includes(currentSigner.address)) {
      return false;
    }
    
    // Check time-based constraints
    if (!canSignerAccessAtCurrentTime(currentSigner)) {
      return false;
    }
    
    // Check transaction type permissions if enabled
    if (currentSigner.transactionPermissions?.enabled) {
      // Map transaction type string to enum
      let txType: TransactionType;
      
      switch (transaction.type) {
        case 'send':
          txType = TransactionType.TRANSFER;
          break;
        case 'contract':
          txType = TransactionType.CONTRACT_INTERACTION;
          break;
        case 'add_signer':
          txType = TransactionType.ADD_SIGNER;
          break;
        case 'remove_signer':
          txType = TransactionType.REMOVE_SIGNER;
          break;
        case 'change_threshold':
          txType = TransactionType.CHANGE_THRESHOLD;
          break;
        case 'recovery':
          txType = TransactionType.RECOVERY;
          break;
        default:
          txType = TransactionType.SETTINGS_CHANGE;
      }
      
      // Check if transaction type is allowed
      if (!currentSigner.transactionPermissions.allowedTypes.includes(txType)) {
        return false;
      }
      
      // Check specific limits based on transaction type
      if (txType === TransactionType.TRANSFER && transaction.amount) {
        const limits = currentSigner.transactionPermissions.approvalLimits?.[TransactionType.TRANSFER];
        
        // Check maximum amount if specified
        if (limits?.maxAmount) {
          const [value, _] = transaction.amount.split(' ');
          const numValue = parseFloat(value.replace(/,/g, ''));
          const maxAmount = parseFloat(limits.maxAmount);
          
          if (numValue > maxAmount) {
            return false;
          }
        }
        
        // Check allowed destinations if specified and not empty
        if (limits?.allowedDestinations && 
            limits.allowedDestinations.length > 0 && 
            transaction.destination &&
            !limits.allowedDestinations.includes(transaction.destination)) {
          return false;
        }
      }
      
      // Check contract interaction permissions
      if (txType === TransactionType.CONTRACT_INTERACTION && transaction.contractInteraction) {
        const limits = currentSigner.transactionPermissions.approvalLimits?.[TransactionType.CONTRACT_INTERACTION];
        
        // In a real implementation, transaction would have a contract address
        // Check allowed contracts if specified
        // if (limits?.allowedContracts?.length && transaction.contractAddress && 
        //    !limits.allowedContracts.includes(transaction.contractAddress)) {
        //   return false;
        // }
        
        // Check allowed methods if specified
        if (limits?.allowedMethods?.length && transaction.contractInteraction.method &&
            !limits.allowedMethods.includes(transaction.contractInteraction.method)) {
          return false;
        }
      }
    }
    
    return true;
  };
  
  const getTransactionStatusBadge = (status: Transaction['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-orange-900/30 text-orange-400 border-orange-800">Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-blue-900/30 text-blue-400 border-blue-800">Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-900/30 text-red-400 border-red-800">Rejected</Badge>;
      case 'executed':
        return <Badge variant="outline" className="bg-green-900/30 text-green-400 border-green-800">Executed</Badge>;
      case 'expired':
        return <Badge variant="outline" className="bg-gray-700 text-gray-400 border-gray-600">Expired</Badge>;
      default:
        return null;
    }
  };
  
  const getTimeRemaining = (expirationTime: Date) => {
    const now = new Date();
    if (expirationTime < now) return 'Expired';
    
    const diffMs = expirationTime.getTime() - now.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHrs = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (diffDays > 0) {
      return `${diffDays}d ${diffHrs}h`;
    } else {
      return `${diffHrs}h`;
    }
  };
  
  // Time-based access constraints
  const canSignerAccessAtCurrentTime = (signer: Signer): boolean => {
    if (!signer.timeConstraints || !signer.timeConstraints.enabled) {
      return true; // No time constraints or disabled
    }
    
    const { startTime, endTime, allowedDays, effectiveFrom, effectiveUntil, timeZone } = signer.timeConstraints;
    const now = new Date();
    
    // Check if constraints are active (based on effectiveFrom/Until dates)
    if (effectiveFrom && now < effectiveFrom) {
      return true; // Constraints not active yet
    }
    
    if (effectiveUntil && now > effectiveUntil) {
      return true; // Constraints no longer active
    }
    
    // Check day of week
    const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    if (allowedDays && !allowedDays.includes(currentDay)) {
      return false; // Current day not allowed
    }
    
    // If no time restrictions set, allow access
    if (!startTime || !endTime) {
      return true;
    }
    
    // Parse times (format: "HH:MM" in 24-hour format)
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    // Get current time in the specified timezone (or local time if not specified)
    let currentHour: number;
    let currentMinute: number;
    
    try {
      // If timezone specified, use it
      if (timeZone) {
        const formatter = new Intl.DateTimeFormat('en-US', {
          hour: 'numeric', 
          minute: 'numeric',
          hour12: false,
          timeZone
        });
        
        const timeParts = formatter.formatToParts(now);
        currentHour = parseInt(timeParts.find(part => part.type === 'hour')?.value || '0');
        currentMinute = parseInt(timeParts.find(part => part.type === 'minute')?.value || '0');
      } else {
        // Use local time
        currentHour = now.getHours();
        currentMinute = now.getMinutes();
      }
      
      // Convert to minutes for easier comparison
      const currentTimeInMinutes = currentHour * 60 + currentMinute;
      const startTimeInMinutes = startHour * 60 + startMinute;
      const endTimeInMinutes = endHour * 60 + endMinute;
      
      // Check if current time is within allowed hours
      if (endTimeInMinutes > startTimeInMinutes) {
        // Simple case: start and end times are on the same day
        return currentTimeInMinutes >= startTimeInMinutes && currentTimeInMinutes <= endTimeInMinutes;
      } else {
        // Complex case: time window crosses midnight
        return currentTimeInMinutes >= startTimeInMinutes || currentTimeInMinutes <= endTimeInMinutes;
      }
    } catch (error) {
      console.error("Error checking time constraints:", error);
      return false; // Default to denying access on error
    }
  };
  
  // UI for creating a multi-signature vault
  const renderCreationUI = () => {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">Create Multi-Signature Vault</h2>
          <p className="text-gray-400">
            Configure advanced security settings for your multi-signature vault
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card className="bg-black/40 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-[#3F51FF]" />
                  Vault Configuration
                </CardTitle>
                <CardDescription>Set up your multi-signature vault parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="vault-name">Vault Name</Label>
                  <Input 
                    id="vault-name" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    placeholder="Strategic Treasury Vault"
                    className="bg-black/40 border-gray-700"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="vault-description">Description (optional)</Label>
                  <Textarea 
                    id="vault-description" 
                    value={description} 
                    onChange={e => setDescription(e.target.value)} 
                    placeholder="Purpose and usage guidelines for this vault"
                    className="bg-black/40 border-gray-700 min-h-[80px]"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Blockchain</Label>
                  <Select value={selectedBlockchain.toString()} onValueChange={(value) => setSelectedBlockchain(Number(value) as BlockchainType)}>
                    <SelectTrigger className="bg-black/40 border-gray-700">
                      <SelectValue placeholder="Select blockchain" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={BlockchainType.ETHEREUM.toString()}>Ethereum</SelectItem>
                      <SelectItem value={BlockchainType.SOLANA.toString()}>Solana</SelectItem>
                      <SelectItem value={BlockchainType.TON.toString()}>TON</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Time Lock (days)</Label>
                  <div className="flex items-center space-x-4">
                    <Slider
                      value={[timelockDays]}
                      min={0}
                      max={365}
                      step={1}
                      onValueChange={(values) => setTimelockDays(values[0])}
                      className="flex-1"
                    />
                    <span className="text-sm w-16 text-right">
                      {timelockDays} days
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Assets will be locked for {timelockDays} days after vault creation
                    {timelockDays > 0 && ` (until ${new Date(Date.now() + timelockDays * 24 * 60 * 60 * 1000).toLocaleDateString()})`}
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-black/40 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2 text-[#3F51FF]" />
                  Signers Configuration
                </CardTitle>
                <CardDescription>Add and manage vault signers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <Label>Required Signatures</Label>
                    <p className="text-xs text-gray-500">
                      Number of signers required to approve transactions
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSignersThreshold(Math.max(1, signersThreshold - 1))}
                      disabled={signersThreshold <= 1}
                      className="h-8 w-8 p-0"
                    >
                      -
                    </Button>
                    <span className="text-lg font-bold w-8 text-center">{signersThreshold}</span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSignersThreshold(Math.min(vaultSigners.length, signersThreshold + 1))}
                      disabled={signersThreshold >= vaultSigners.length}
                      className="h-8 w-8 p-0"
                    >
                      +
                    </Button>
                  </div>
                </div>
                
                <div className="pt-2">
                  <Label className="mb-3 block">Signers</Label>
                  <div className="space-y-3">
                    {vaultSigners.map((signer) => (
                      <div 
                        key={signer.id} 
                        className="p-3 bg-black/40 rounded-md border border-gray-800"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div className="flex items-center space-x-3">
                            <div className="bg-[#3F51FF]/20 p-2 rounded-full min-w-[32px] flex-shrink-0">
                              <Users className="h-4 w-4 text-[#3F51FF]" />
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
                        
                        {/* Time-based access constraints */}
                        <div className="mt-3 pt-3 border-t border-gray-800">
                          <div className="flex justify-between items-center mb-2">
                            <Label htmlFor={`time-constraints-${signer.id}`} className="text-sm font-medium flex items-center gap-1">
                              <Clock10 className="h-3.5 w-3.5 text-gray-400" />
                              Time-based Access Constraints
                            </Label>
                            <Switch 
                              id={`time-constraints-${signer.id}`} 
                              checked={signer.timeConstraints?.enabled || false}
                              onCheckedChange={(checked) => {
                                setVaultSigners(vaultSigners.map(s => 
                                  s.id === signer.id 
                                    ? { 
                                        ...s, 
                                        timeConstraints: { 
                                          ...(s.timeConstraints || {
                                            startTime: "09:00",
                                            endTime: "17:00",
                                            allowedDays: [1, 2, 3, 4, 5],
                                            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
                                          }), 
                                          enabled: checked 
                                        } 
                                      } 
                                    : s
                                ))
                              }}
                              className="ml-2"
                            />
                          </div>
                          
                          {signer.timeConstraints?.enabled && (
                            <div className="space-y-3 mt-2 text-sm">

                            {/* Transaction permissions - Custom Signing Policies */}
                            </div>
                          )}
                        </div>
                        
                        {/* Transaction type permissions */}
                        <div className="mt-3 pt-3 border-t border-gray-800">
                          <div className="flex justify-between items-center mb-2">
                            <Label htmlFor={`transaction-permissions-${signer.id}`} className="text-sm font-medium flex items-center gap-1">
                              <FileLock2 className="h-3.5 w-3.5 text-gray-400" />
                              Custom Signing Policies
                            </Label>
                            <Switch 
                              id={`transaction-permissions-${signer.id}`} 
                              checked={signer.transactionPermissions?.enabled || false}
                              onCheckedChange={(checked) => {
                                setVaultSigners(vaultSigners.map(s => 
                                  s.id === signer.id 
                                    ? { 
                                        ...s, 
                                        transactionPermissions: { 
                                          ...(s.transactionPermissions || {
                                            allowedTypes: Object.values(TransactionType),
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
                                          }), 
                                          enabled: checked 
                                        } 
                                      } 
                                    : s
                                ))
                              }}
                              className="ml-2"
                            />
                          </div>
                          
                          {signer.transactionPermissions?.enabled && (
                            <div className="space-y-4 mt-2 text-sm">
                              <div>
                                <Label className="text-xs mb-1 block">Allowed Transaction Types</Label>
                                <div className="grid grid-cols-2 gap-1">
                                  {Object.values(TransactionType).map((type) => (
                                    <div key={type} className="flex items-center space-x-2">
                                      <Checkbox 
                                        id={`tx-type-${type}-${signer.id}`}
                                        checked={signer.transactionPermissions.allowedTypes.includes(type)}
                                        onCheckedChange={(checked) => {
                                          setVaultSigners(vaultSigners.map(s => {
                                            if (s.id !== signer.id) return s;
                                            
                                            const newAllowedTypes = checked 
                                              ? [...s.transactionPermissions.allowedTypes, type]
                                              : s.transactionPermissions.allowedTypes.filter(t => t !== type);
                                              
                                            return {
                                              ...s,
                                              transactionPermissions: {
                                                ...s.transactionPermissions,
                                                allowedTypes: newAllowedTypes
                                              }
                                            };
                                          }));
                                        }}
                                      />
                                      <Label 
                                        htmlFor={`tx-type-${type}-${signer.id}`}
                                        className="text-xs cursor-pointer"
                                      >
                                        {type.replace(/_/g, ' ')}
                                      </Label>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              
                              {/* Transfer Amount Limit */}
                              {signer.transactionPermissions.allowedTypes.includes(TransactionType.TRANSFER) && (
                                <div>
                                  <Accordion type="single" collapsible className="w-full">
                                    <AccordionItem value="transfer-limits" className="border-gray-800">
                                      <AccordionTrigger className="text-xs py-2">
                                        Transfer Limits
                                      </AccordionTrigger>
                                      <AccordionContent>
                                        <div className="space-y-2 pt-2">
                                          <div>
                                            <Label htmlFor={`max-amount-${signer.id}`} className="text-xs">
                                              Maximum Amount
                                            </Label>
                                            <Input
                                              id={`max-amount-${signer.id}`}
                                              value={signer.transactionPermissions.approvalLimits[TransactionType.TRANSFER].maxAmount}
                                              onChange={(e) => {
                                                setVaultSigners(vaultSigners.map(s => {
                                                  if (s.id !== signer.id) return s;
                                                  
                                                  // Create a properly typed updated signer
                                                  const updatedSigner: Signer = {
                                                    ...s,
                                                    transactionPermissions: {
                                                      ...s.transactionPermissions,
                                                      approvalLimits: {
                                                        ...s.transactionPermissions.approvalLimits,
                                                        [TransactionType.TRANSFER]: {
                                                          ...s.transactionPermissions.approvalLimits[TransactionType.TRANSFER] || {},
                                                          maxAmount: e.target.value,
                                                          allowedDestinations: 
                                                            s.transactionPermissions.approvalLimits[TransactionType.TRANSFER]?.allowedDestinations || []
                                                        }
                                                      }
                                                    }
                                                  };
                                                  
                                                  return updatedSigner;
                                                }));
                                              }}
                                              placeholder="1000"
                                              className="bg-black/40 border-gray-700 h-8 mt-1"
                                            />
                                          </div>
                                          
                                          <div>
                                            <Label className="text-xs flex items-center justify-between">
                                              <span>Allowed Destinations</span>
                                              <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                className="h-6 text-xs gap-1"
                                                onClick={() => {
                                                  const address = prompt("Enter address to whitelist:");
                                                  if (!address || !address.startsWith("0x")) return;
                                                  
                                                  setVaultSigners(vaultSigners.map(s => {
                                                    if (s.id !== signer.id) return s;
                                                    
                                                    // Get current destinations with fallback to empty array
                                                    const currentDests = s.transactionPermissions.approvalLimits[TransactionType.TRANSFER]?.allowedDestinations || [];
                                                    
                                                    // Create properly typed updated signer
                                                    const updatedSigner: Signer = {
                                                      ...s,
                                                      transactionPermissions: {
                                                        ...s.transactionPermissions,
                                                        approvalLimits: {
                                                          ...s.transactionPermissions.approvalLimits,
                                                          [TransactionType.TRANSFER]: {
                                                            ...s.transactionPermissions.approvalLimits[TransactionType.TRANSFER] || {},
                                                            maxAmount: s.transactionPermissions.approvalLimits[TransactionType.TRANSFER]?.maxAmount || "",
                                                            allowedDestinations: [...currentDests, address]
                                                          }
                                                        }
                                                      }
                                                    };
                                                    
                                                    return updatedSigner;
                                                  }));
                                                }}
                                              >
                                                <Plus className="h-3 w-3" /> Add
                                              </Button>
                                            </Label>
                                            <div className="mt-1">
                                              {signer.transactionPermissions.approvalLimits[TransactionType.TRANSFER].allowedDestinations.length === 0 ? (
                                                <p className="text-xs text-gray-500 italic">No allowed addresses (all transfers blocked)</p>
                                              ) : (
                                                <div className="space-y-1">
                                                  {signer.transactionPermissions.approvalLimits[TransactionType.TRANSFER].allowedDestinations.map((address, index) => (
                                                    <div key={index} className="flex justify-between items-center text-xs bg-black/30 px-2 py-1 rounded">
                                                      <code className="truncate">{address}</code>
                                                      <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-5 w-5 p-0"
                                                        onClick={() => {
                                                          setVaultSigners(vaultSigners.map(s => {
                                                            if (s.id !== signer.id) return s;
                                                            
                                                            // Get current destinations with fallback to empty array
                                                            const currentDests = s.transactionPermissions.approvalLimits[TransactionType.TRANSFER]?.allowedDestinations || [];
                                                            
                                                            // Create properly typed updated signer
                                                            const updatedSigner: Signer = {
                                                              ...s,
                                                              transactionPermissions: {
                                                                ...s.transactionPermissions,
                                                                approvalLimits: {
                                                                  ...s.transactionPermissions.approvalLimits,
                                                                  [TransactionType.TRANSFER]: {
                                                                    ...s.transactionPermissions.approvalLimits[TransactionType.TRANSFER] || {},
                                                                    maxAmount: s.transactionPermissions.approvalLimits[TransactionType.TRANSFER]?.maxAmount || "",
                                                                    allowedDestinations: currentDests.filter((_, i) => i !== index)
                                                                  }
                                                                }
                                                              }
                                                            };
                                                            
                                                            return updatedSigner;
                                                          }));
                                                        }}
                                                      >
                                                        <X className="h-3 w-3" />
                                                      </Button>
                                                    </div>
                                                  ))}
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      </AccordionContent>
                                    </AccordionItem>
                                  </Accordion>
                                </div>
                              )}
                              
                              {/* Contract Interaction Limits */}
                              {signer.transactionPermissions.allowedTypes.includes(TransactionType.CONTRACT_INTERACTION) && (
                                <div>
                                  <Accordion type="single" collapsible className="w-full">
                                    <AccordionItem value="contract-limits" className="border-gray-800">
                                      <AccordionTrigger className="text-xs py-2">
                                        Contract Interaction Limits
                                      </AccordionTrigger>
                                      <AccordionContent>
                                        <div className="space-y-2 pt-2">
                                          <div>
                                            <Label className="text-xs flex items-center justify-between">
                                              <span>Allowed Methods</span>
                                              <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                className="h-6 text-xs gap-1"
                                                onClick={() => {
                                                  const method = prompt("Enter method name or signature:");
                                                  if (!method) return;
                                                  
                                                  setVaultSigners(vaultSigners.map(s => {
                                                    if (s.id !== signer.id) return s;
                                                    
                                                    // Get current methods with fallback to empty array
                                                    const currentMethods = s.transactionPermissions.approvalLimits[TransactionType.CONTRACT_INTERACTION]?.allowedMethods || [];
                                                    
                                                    // Create properly typed updated signer
                                                    const updatedSigner: Signer = {
                                                      ...s,
                                                      transactionPermissions: {
                                                        ...s.transactionPermissions,
                                                        approvalLimits: {
                                                          ...s.transactionPermissions.approvalLimits,
                                                          [TransactionType.CONTRACT_INTERACTION]: {
                                                            ...s.transactionPermissions.approvalLimits[TransactionType.CONTRACT_INTERACTION] || {},
                                                            allowedMethods: [...currentMethods, method],
                                                            allowedContracts: 
                                                              s.transactionPermissions.approvalLimits[TransactionType.CONTRACT_INTERACTION]?.allowedContracts || []
                                                          }
                                                        }
                                                      }
                                                    };
                                                    
                                                    return updatedSigner;
                                                  }));
                                                }}
                                              >
                                                <Plus className="h-3 w-3" /> Add
                                              </Button>
                                            </Label>
                                            <div className="mt-1">
                                              {signer.transactionPermissions.approvalLimits[TransactionType.CONTRACT_INTERACTION].allowedMethods.length === 0 ? (
                                                <p className="text-xs text-gray-500 italic">No allowed methods (all methods allowed)</p>
                                              ) : (
                                                <div className="space-y-1">
                                                  {signer.transactionPermissions.approvalLimits[TransactionType.CONTRACT_INTERACTION].allowedMethods.map((method, index) => (
                                                    <div key={index} className="flex justify-between items-center text-xs bg-black/30 px-2 py-1 rounded">
                                                      <code>{method}</code>
                                                      <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-5 w-5 p-0"
                                                        onClick={() => {
                                                          setVaultSigners(vaultSigners.map(s => {
                                                            if (s.id !== signer.id) return s;
                                                            
                                                            // Get current methods with fallback to empty array
                                                            const currentMethods = s.transactionPermissions.approvalLimits[TransactionType.CONTRACT_INTERACTION]?.allowedMethods || [];
                                                            
                                                            // Create properly typed updated signer
                                                            const updatedSigner: Signer = {
                                                              ...s,
                                                              transactionPermissions: {
                                                                ...s.transactionPermissions,
                                                                approvalLimits: {
                                                                  ...s.transactionPermissions.approvalLimits,
                                                                  [TransactionType.CONTRACT_INTERACTION]: {
                                                                    ...s.transactionPermissions.approvalLimits[TransactionType.CONTRACT_INTERACTION] || {},
                                                                    allowedMethods: currentMethods.filter((_, i) => i !== index),
                                                                    allowedContracts: 
                                                                      s.transactionPermissions.approvalLimits[TransactionType.CONTRACT_INTERACTION]?.allowedContracts || []
                                                                  }
                                                                }
                                                              }
                                                            };
                                                            
                                                            return updatedSigner;
                                                          }));
                                                        }}
                                                      >
                                                        <X className="h-3 w-3" />
                                                      </Button>
                                                    </div>
                                                  ))}
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      </AccordionContent>
                                    </AccordionItem>
                                  </Accordion>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        
                        {/* Time-based access constraints */}
                        <div className="mt-3 pt-3 border-t border-gray-800">
                          <div className="flex justify-between items-center mb-2">
                            <Label htmlFor={`time-constraints-${signer.id}`} className="text-sm font-medium flex items-center gap-1">
                              <Clock10 className="h-3.5 w-3.5 text-gray-400" />
                              Time-based Access Constraints
                            </Label>
                            <Switch 
                              id={`time-constraints-${signer.id}`} 
                              checked={signer.timeConstraints?.enabled || false}
                              onCheckedChange={(checked) => {
                                setVaultSigners(vaultSigners.map(s => 
                                  s.id === signer.id 
                                    ? { 
                                        ...s, 
                                        timeConstraints: { 
                                          ...(s.timeConstraints || {
                                            startTime: "09:00",
                                            endTime: "17:00",
                                            allowedDays: [1, 2, 3, 4, 5],
                                            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
                                          }), 
                                          enabled: checked 
                                        } 
                                      } 
                                    : s
                                ))
                              }}
                              className="ml-2"
                            />
                          </div>
                          
                          {signer.timeConstraints?.enabled && (
                            <div className="space-y-3 mt-2 text-sm">
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <Label htmlFor={`start-time-${signer.id}`} className="text-xs">Start Time</Label>
                                  <Input 
                                    id={`start-time-${signer.id}`}
                                    type="time"
                                    value={signer.timeConstraints.startTime || "09:00"}
                                    onChange={(e) => {
                                      setVaultSigners(vaultSigners.map(s =>
                                        s.id === signer.id
                                          ? {
                                              ...s,
                                              timeConstraints: {
                                                ...s.timeConstraints!,
                                                startTime: e.target.value
                                              }
                                            }
                                          : s
                                      ))
                                    }}
                                    className="bg-black/40 border-gray-700 h-8 mt-1"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor={`end-time-${signer.id}`} className="text-xs">End Time</Label>
                                  <Input 
                                    id={`end-time-${signer.id}`}
                                    type="time"
                                    value={signer.timeConstraints.endTime || "17:00"}
                                    onChange={(e) => {
                                      setVaultSigners(vaultSigners.map(s =>
                                        s.id === signer.id
                                          ? {
                                              ...s,
                                              timeConstraints: {
                                                ...s.timeConstraints!,
                                                endTime: e.target.value
                                              }
                                            }
                                          : s
                                      ))
                                    }}
                                    className="bg-black/40 border-gray-700 h-8 mt-1"
                                  />
                                </div>
                              </div>
                              
                              <div>
                                <Label className="text-xs block mb-1">Allowed Days</Label>
                                <div className="flex gap-1 flex-wrap">
                                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
                                    <Button
                                      key={idx}
                                      type="button"
                                      size="sm"
                                      variant={signer.timeConstraints?.allowedDays?.includes(idx) ? "default" : "outline"}
                                      className={`h-7 w-7 p-0 ${
                                        signer.timeConstraints?.allowedDays?.includes(idx)
                                          ? "bg-blue-800 hover:bg-blue-700"
                                          : "bg-black/40 hover:bg-black/60"
                                      }`}
                                      onClick={() => {
                                        if (!signer.timeConstraints) return;
                                        
                                        const newAllowedDays = signer.timeConstraints.allowedDays?.includes(idx)
                                          ? signer.timeConstraints.allowedDays.filter(d => d !== idx)
                                          : [...(signer.timeConstraints.allowedDays || []), idx];
                                          
                                        setVaultSigners(vaultSigners.map(s =>
                                          s.id === signer.id
                                            ? {
                                                ...s,
                                                timeConstraints: {
                                                  ...s.timeConstraints!,
                                                  allowedDays: newAllowedDays
                                                }
                                              }
                                            : s
                                        ))
                                      }}
                                    >
                                      {day}
                                    </Button>
                                  ))}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                  {signer.timeConstraints.enabled 
                                    ? `Signer can approve transactions during ${signer.timeConstraints.startTime} - ${signer.timeConstraints.endTime} on selected days.` 
                                    : 'No time constraints applied.'}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="pt-2">
                  <Label>Add New Signer</Label>
                  <div className="grid grid-cols-12 gap-3 mt-2">
                    <div className="col-span-5">
                      <Input 
                        placeholder="Name or organization" 
                        value={newSignerName}
                        onChange={e => setNewSignerName(e.target.value)}
                        className="bg-black/40 border-gray-700"
                      />
                    </div>
                    <div className="col-span-5">
                      <Input 
                        placeholder="Wallet address" 
                        value={newSignerAddress}
                        onChange={e => setNewSignerAddress(e.target.value)}
                        className="bg-black/40 border-gray-700 font-mono"
                      />
                    </div>
                    <div className="col-span-2">
                      <Button 
                        onClick={addSigner}
                        disabled={!newSignerAddress || !newSignerName}
                        className="w-full bg-[#3F51FF] hover:bg-[#3F51FF]/80"
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-black/40 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lock className="w-5 h-5 mr-2 text-[#3F51FF]" />
                  Security Settings
                </CardTitle>
                <CardDescription>Configure advanced security features</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm">Hardware Key Authentication</Label>
                    <p className="text-xs text-gray-500">
                      Require hardware security keys (Ledger, Trezor, YubiKey)
                    </p>
                  </div>
                  <Switch 
                    checked={enableHardwareKey}
                    onCheckedChange={setEnableHardwareKey}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm">QR Code Signature</Label>
                    <p className="text-xs text-gray-500">
                      Enable air-gapped signing via QR codes
                    </p>
                  </div>
                  <Switch 
                    checked={enableQRSignature}
                    onCheckedChange={setEnableQRSignature}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm">Biometric Authentication</Label>
                    <p className="text-xs text-gray-500">
                      Use fingerprint or facial recognition for additional verification
                    </p>
                  </div>
                  <Switch 
                    checked={enableBiometrics}
                    onCheckedChange={setEnableBiometrics}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm">Social Recovery</Label>
                    <p className="text-xs text-gray-500">
                      Allow recovery of the vault using a guardian committee
                    </p>
                  </div>
                  <Switch 
                    checked={enableRecovery}
                    onCheckedChange={setEnableRecovery}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm">End-to-End Encryption</Label>
                    <p className="text-xs text-gray-500">
                      Encrypt off-chain data and communication between signers
                    </p>
                  </div>
                  <Switch 
                    checked={enableEncryption}
                    onCheckedChange={setEnableEncryption}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm">Activity Notifications</Label>
                    <p className="text-xs text-gray-500">
                      Send notifications for all vault activity
                    </p>
                  </div>
                  <Switch 
                    checked={activityNotifications}
                    onCheckedChange={setActivityNotifications}
                  />
                </div>
                
                <div className="pt-2">
                  <Label className="mb-2 block">Transaction Expiration (days)</Label>
                  <div className="flex items-center space-x-4">
                    <Slider
                      value={[transactionExpiry]}
                      min={1}
                      max={30}
                      step={1}
                      onValueChange={(values) => setTransactionExpiry(values[0])}
                      className="flex-1"
                    />
                    <span className="text-sm w-16 text-right">
                      {transactionExpiry} days
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Transactions will expire if not approved within {transactionExpiry} days
                  </p>
                </div>
                
                <div className="pt-2">
                  <Label className="mb-2 block">Gas Settings</Label>
                  <Select value={gasSettings} onValueChange={setGasSettings}>
                    <SelectTrigger className="bg-black/40 border-gray-700">
                      <SelectValue placeholder="Select gas strategy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="automatic">Automatic (Recommended)</SelectItem>
                      <SelectItem value="fast">Fast Priority</SelectItem>
                      <SelectItem value="medium">Medium Priority</SelectItem>
                      <SelectItem value="slow">Low Priority</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <div className="sticky top-6 space-y-6">
              <Card className="bg-black/40 border-gray-800">
                <CardHeader>
                  <CardTitle>Creation Progress</CardTitle>
                  <CardDescription>Complete all required fields</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Overall Progress</span>
                      <span>{getCurrentProgress()}%</span>
                    </div>
                    <Progress value={getCurrentProgress()} />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Vault Name</span>
                      {name.length > 0 ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-gray-500" />
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Signers (min. 2)</span>
                      {vaultSigners.length >= 2 ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-gray-500" />
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Signature Threshold</span>
                      {signersThreshold > 0 && signersThreshold <= vaultSigners.length ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-gray-500" />
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Vault Description</span>
                      {description.length > 0 ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-gray-500" />
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Recovery Settings</span>
                      {enableRecovery ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-gray-500" />
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={handleCreateVault}
                    disabled={getCurrentProgress() < 100}
                    className="w-full bg-[#3F51FF] hover:bg-[#3F51FF]/80"
                  >
                    Create Vault
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="bg-black/40 border-gray-800">
                <CardHeader>
                  <CardTitle>Security Rating</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Overall Security</span>
                    <span className="text-sm font-bold text-green-500">A+</span>
                  </div>
                  <Progress value={95} className="bg-gray-800" />
                  
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-green-500" />
                      <span className="text-xs text-gray-300">Multi-signature security</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-green-500" />
                      <span className="text-xs text-gray-300">Time-lock protection</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Fingerprint className="h-4 w-4 text-gray-500" />
                      <span className="text-xs text-gray-500">Biometric verification (optional)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Key className="h-4 w-4 text-green-500" />
                      <span className="text-xs text-gray-300">Hardware key authentication</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // UI for managing an existing vault
  const renderManagementUI = () => {
    const totalAssetsValue = assets.reduce((total, asset) => total + asset.valueUSD, 0);
    
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">{name}</h2>
            <p className="text-gray-400">{description || "Multi-signature vault"}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" className="space-x-2">
              <Shield className="h-4 w-4" />
              <span>Security</span>
            </Button>
            <Button variant="outline" className="space-x-2">
              <Users className="h-4 w-4" />
              <span>Signers</span>
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-[#3F51FF] hover:bg-[#3F51FF]/80 space-x-2">
                  <RotateCw className="h-4 w-4" />
                  <span>New Transaction</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-gray-900 border-gray-800">
                <DialogHeader>
                  <DialogTitle>Create New Transaction</DialogTitle>
                  <DialogDescription>
                    This transaction will require {signersThreshold} out of {vaultSigners.length} signatures.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Transaction Type</Label>
                    <Select 
                      value={newTransaction.type}
                      onValueChange={(value) => setNewTransaction({...newTransaction, type: value})}
                    >
                      <SelectTrigger className="bg-black/40 border-gray-700">
                        <SelectValue placeholder="Select transaction type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="send">Send Assets</SelectItem>
                        <SelectItem value="contract">Contract Interaction</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Input 
                      value={newTransaction.description}
                      onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                      placeholder="Purpose of this transaction"
                      className="bg-black/40 border-gray-700"
                    />
                  </div>
                  
                  {newTransaction.type === 'send' && (
                    <>
                      <div className="space-y-2">
                        <Label>Destination Address</Label>
                        <Input 
                          value={newTransaction.destination}
                          onChange={(e) => setNewTransaction({...newTransaction, destination: e.target.value})}
                          placeholder="0x..."
                          className="bg-black/40 border-gray-700 font-mono"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Amount</Label>
                        <Input 
                          value={newTransaction.amount}
                          onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                          placeholder="1.5 ETH"
                          className="bg-black/40 border-gray-700"
                        />
                      </div>
                    </>
                  )}
                  
                  {newTransaction.type === 'contract' && (
                    <>
                      <div className="space-y-2">
                        <Label>Method</Label>
                        <Input 
                          value={newTransaction.contractMethod}
                          onChange={(e) => setNewTransaction({...newTransaction, contractMethod: e.target.value})}
                          placeholder="updateTimeLock"
                          className="bg-black/40 border-gray-700"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Parameters (JSON)</Label>
                        <Textarea 
                          value={newTransaction.contractParams}
                          onChange={(e) => setNewTransaction({...newTransaction, contractParams: e.target.value})}
                          placeholder='{ "timeout": 1209600 }'
                          className="bg-black/40 border-gray-700 min-h-[80px] font-mono text-sm"
                        />
                      </div>
                    </>
                  )}
                </div>
                <DialogFooter>
                  <Button 
                    onClick={submitTransaction}
                    className="bg-[#3F51FF] hover:bg-[#3F51FF]/80"
                  >
                    Submit Transaction
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Tabs defaultValue="transactions" className="w-full">
              <TabsList className="grid grid-cols-4 bg-gray-800/50">
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
                <TabsTrigger value="assets">Assets</TabsTrigger>
                <TabsTrigger value="guardians">Guardians</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>
              
              <TabsContent value="transactions" className="space-y-4 mt-4">
                <Card className="bg-black/40 border-gray-800">
                  <CardHeader>
                    <CardTitle>Pending Transactions</CardTitle>
                    <CardDescription>
                      Transactions awaiting signatures - {transactionExpiry} day expiration period
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {transactions.filter(tx => tx.status === 'pending' || tx.status === 'approved').length > 0 ? (
                        transactions
                          .filter(tx => tx.status === 'pending' || tx.status === 'approved')
                          .map(transaction => (
                            <div 
                              key={transaction.id} 
                              className="p-4 bg-black/50 border border-gray-800 rounded-lg space-y-3"
                            >
                              <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                  <h4 className="font-medium">{transaction.description}</h4>
                                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                                    <span>Created {new Date(transaction.timeCreated).toLocaleDateString()}</span>
                                    <span>•</span>
                                    <span>By {transaction.creator.slice(0, 6)}...{transaction.creator.slice(-4)}</span>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  {getTransactionStatusBadge(transaction.status)}
                                  <div className="text-xs bg-gray-800 px-2 py-1 rounded-md flex items-center">
                                    <Clock10 className="h-3 w-3 mr-1" />
                                    <span>{getTimeRemaining(transaction.expirationTime)}</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="bg-black/40 p-3 rounded-md space-y-2">
                                {transaction.type === 'send' && (
                                  <div className="flex justify-between text-sm">
                                    <div className="text-gray-400">Send</div>
                                    <div className="font-medium">
                                      {transaction.amount} to {transaction.destination?.slice(0, 6)}...{transaction.destination?.slice(-4)}
                                    </div>
                                  </div>
                                )}
                                
                                {transaction.type === 'contract' && transaction.contractInteraction && (
                                  <div className="flex flex-col space-y-1">
                                    <div className="flex justify-between text-sm">
                                      <div className="text-gray-400">Method</div>
                                      <div className="font-medium">{transaction.contractInteraction.method}</div>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                      <div className="text-gray-400">Parameters</div>
                                      <div className="font-mono text-xs overflow-hidden text-ellipsis">{transaction.contractInteraction.params}</div>
                                    </div>
                                  </div>
                                )}
                              </div>
                              
                              <div className="pt-1">
                                <div className="flex items-center justify-between">
                                  <div className="text-sm flex items-center space-x-1">
                                    <span>Signatures:</span>
                                    <span className="font-medium">{transaction.currentSignatures}/{transaction.requiredSignatures}</span>
                                  </div>
                                  <div className="flex space-x-2">
                                    {transaction.status === 'pending' && !transaction.signers.includes(vaultSigners[0].address) && (
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Button 
                                              size="sm" 
                                              onClick={() => signTransaction(transaction.id)}
                                              disabled={!canSignTransaction(transaction.id)}
                                              className={`${
                                                canSignTransaction(transaction.id)
                                                  ? "bg-[#3F51FF] hover:bg-[#3F51FF]/80"
                                                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                              }`}
                                            >
                                              {canSignTransaction(transaction.id) ? (
                                                <span>Sign</span>
                                              ) : (
                                                <span className="flex items-center gap-1">
                                                  <Clock10 className="h-3 w-3" />
                                                  Time Restricted
                                                </span>
                                              )}
                                            </Button>
                                          </TooltipTrigger>
                                          {!canSignTransaction(transaction.id) && (
                                            <TooltipContent className="max-w-xs bg-black border border-gray-700 text-gray-200 p-3">
                                              <p className="text-sm font-medium mb-1">Time-based Access Restricted</p>
                                              <p className="text-xs text-gray-400">
                                                You cannot sign this transaction due to your time-based access constraints.
                                                {vaultSigners[0].timeConstraints?.enabled && (
                                                  <>
                                                    <br/><br/>
                                                    <b>Your signing window:</b><br/>
                                                    {vaultSigners[0].timeConstraints.startTime} - {vaultSigners[0].timeConstraints.endTime}
                                                    <br/><br/>
                                                    <b>Allowed days:</b><br/>
                                                    {vaultSigners[0].timeConstraints.allowedDays?.map(day => 
                                                      ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][day]
                                                    ).join(', ')}
                                                  </>
                                                )}
                                              </p>
                                            </TooltipContent>
                                          )}
                                        </Tooltip>
                                      </TooltipProvider>
                                    )}
                                    
                                    {transaction.status === 'approved' && (
                                      <Button 
                                        size="sm" 
                                        onClick={() => executeTransaction(transaction.id)}
                                        className="bg-green-600 hover:bg-green-700"
                                      >
                                        Execute
                                      </Button>
                                    )}
                                    
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => rejectTransaction(transaction.id)}
                                      className="text-red-500 border-red-900/50 hover:bg-red-950/30"
                                    >
                                      Reject
                                    </Button>
                                  </div>
                                </div>
                                <Progress 
                                  value={(transaction.currentSignatures / transaction.requiredSignatures) * 100} 
                                  className="h-1 mt-2"
                                />
                              </div>
                            </div>
                          ))
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <FileLock2 className="h-12 w-12 mx-auto mb-4 text-gray-700" />
                          <p>No pending transactions</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="assets" className="space-y-4 mt-4">
                <Card className="bg-black/40 border-gray-800">
                  <CardHeader>
                    <CardTitle>Vault Assets</CardTitle>
                    <CardDescription>
                      Total value: ${totalAssetsValue.toLocaleString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow className="border-gray-800">
                          <TableHead>Asset</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead className="text-right">Value (USD)</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {assets.map((asset) => (
                          <TableRow key={asset.symbol} className="border-gray-800">
                            <TableCell className="font-medium">
                              <div className="flex items-center space-x-2">
                                <div className="bg-gray-800 p-2 rounded-full">
                                  <i className={`${asset.icon} text-lg`}></i>
                                </div>
                                <div>
                                  <div>{asset.name}</div>
                                  <div className="text-xs text-gray-500">{asset.symbol}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{asset.amount}</TableCell>
                            <TableCell className="text-right">${asset.valueUSD.toLocaleString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="guardians" className="space-y-4 mt-4">
                <Card className="bg-black/40 border-gray-800">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div>
                      <CardTitle className="flex items-center">
                        <ShieldAlert className="w-5 h-5 mr-2 text-[#3F51FF]" />
                        Recovery Guardians
                      </CardTitle>
                      <CardDescription>
                        {enableRecovery 
                          ? `${recoveryGuardians.length} guardians, ${guardianThreshold} required for recovery` 
                          : 'Social recovery is disabled'}
                      </CardDescription>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          className="flex-shrink-0 bg-black/40 border-gray-700"
                          disabled={!enableRecovery}
                        >
                          Add Guardian
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-gray-950 border border-gray-800 text-white">
                        <DialogHeader>
                          <DialogTitle>Add Recovery Guardian</DialogTitle>
                          <DialogDescription>
                            Add a trusted guardian who can help recover your vault if you lose access.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="guardian-name">Guardian Name</Label>
                            <Input 
                              id="guardian-name" 
                              value={newGuardian.name} 
                              onChange={e => setNewGuardian({...newGuardian, name: e.target.value})} 
                              placeholder="Guardian name or organization"
                              className="bg-black/40 border-gray-700"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="guardian-address">Wallet Address</Label>
                            <Input 
                              id="guardian-address" 
                              value={newGuardian.address} 
                              onChange={e => setNewGuardian({...newGuardian, address: e.target.value})} 
                              placeholder="0x..."
                              className="bg-black/40 border-gray-700 font-mono"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="guardian-email">Contact Email (optional)</Label>
                            <Input 
                              id="guardian-email" 
                              value={newGuardian.email} 
                              onChange={e => setNewGuardian({...newGuardian, email: e.target.value})} 
                              placeholder="guardian@example.com"
                              className="bg-black/40 border-gray-700"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button 
                            onClick={addGuardian}
                            disabled={!newGuardian.name || !newGuardian.address}
                            className="bg-[#3F51FF] hover:bg-[#3F51FF]/80"
                          >
                            Add Guardian
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </CardHeader>
                  <CardContent>
                    {enableRecovery ? (
                      <>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label className="text-sm">Recovery Threshold</Label>
                              <p className="text-xs text-gray-500">
                                Number of guardians required to approve a recovery
                              </p>
                            </div>
                            <Select 
                              value={guardianThreshold.toString()} 
                              onValueChange={(value) => setGuardianThreshold(Number(value))}
                              disabled={recoveryGuardians.length === 0}
                            >
                              <SelectTrigger className="w-24 bg-black/40 border-gray-700">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from({length: recoveryGuardians.length || 1}, (_, i) => (
                                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                                    {i + 1}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          {recoveryGuardians.length > 0 ? (
                            <div className="space-y-3">
                              {recoveryGuardians.map(guardian => (
                                <div key={guardian.id} className="flex items-center justify-between p-3 bg-black/40 border border-gray-800 rounded-lg">
                                  <div className="flex items-center space-x-3">
                                    <div className="bg-blue-900/20 p-2 rounded-full">
                                      <Shield className="h-5 w-5 text-blue-500" />
                                    </div>
                                    <div>
                                      <div className="font-medium">{guardian.name}</div>
                                      <div className="text-xs text-gray-500">
                                        {guardian.address.slice(0, 6)}...{guardian.address.slice(-4)}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-3">
                                    <Badge variant="outline" className={`${
                                      guardian.status === 'active' 
                                      ? 'bg-green-900/20 text-green-500 border-green-800'
                                      : 'bg-orange-900/20 text-orange-500 border-orange-800'
                                    }`}>
                                      {guardian.status === 'active' ? 'Active' : 'Pending'}
                                    </Badge>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      onClick={() => removeGuardian(guardian.id)}
                                      className="text-red-500 hover:text-red-400 hover:bg-red-950/20"
                                    >
                                      <XCircle className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-10 text-gray-500">
                              <ShieldAlert className="h-12 w-12 mx-auto mb-4 text-gray-700" />
                              <p>No recovery guardians added yet</p>
                              <p className="text-sm mt-1">Add trusted guardians to enable social recovery</p>
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-6">
                          <Button 
                            variant="outline" 
                            className="w-full border-yellow-900/50 bg-yellow-950/10 text-yellow-500 hover:bg-yellow-950/20"
                            onClick={() => setRecoveryDialogOpen(true)}
                            disabled={recoveryGuardians.length < guardianThreshold || recoveryGuardians.length === 0}
                          >
                            Initiate Recovery Process
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-10 text-gray-500">
                        <Lock className="h-12 w-12 mx-auto mb-4 text-gray-700" />
                        <p>Social recovery is disabled</p>
                        <p className="text-sm mt-1">Enable it in Security Settings to configure recovery guardians</p>
                        <Button 
                          variant="outline"
                          className="mt-4"
                          onClick={() => setEnableRecovery(true)}
                        >
                          Enable Social Recovery
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="history" className="space-y-4 mt-4">
                <Card className="bg-black/40 border-gray-800">
                  <CardHeader>
                    <CardTitle>Transaction History</CardTitle>
                    <CardDescription>
                      Complete history of executed transactions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow className="border-gray-800">
                          <TableHead>Transaction</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transactions
                          .filter(tx => tx.status === 'executed' || tx.status === 'rejected')
                          .map((transaction) => (
                            <TableRow key={transaction.id} className="border-gray-800">
                              <TableCell className="font-medium">
                                {transaction.description}
                              </TableCell>
                              <TableCell>
                                {transaction.type === 'send' ? 'Transfer' : 'Contract Call'}
                              </TableCell>
                              <TableCell>
                                {getTransactionStatusBadge(transaction.status)}
                              </TableCell>
                              <TableCell>
                                {transaction.timeExecuted ? new Date(transaction.timeExecuted).toLocaleDateString() : '-'}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button variant="ghost" size="sm" className="text-gray-400">
                                  <ArrowUpRight className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                    
                    {transactions.filter(tx => tx.status === 'executed' || tx.status === 'rejected').length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <FileText className="h-12 w-12 mx-auto mb-4 text-gray-700" />
                        <p>No transaction history yet</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="space-y-6">
            <Card className="bg-black/40 border-gray-800">
              <CardHeader>
                <CardTitle>Vault Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-black/40 p-4 rounded-lg border border-gray-800">
                  <div className="text-gray-400 text-sm mb-1">Total Value</div>
                  <div className="text-2xl font-bold">${totalAssetsValue.toLocaleString()}</div>
                </div>
                
                <div className="pt-2 space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">Signers</span>
                    </div>
                    <span className="text-sm font-medium">{vaultSigners.length}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">Required Signatures</span>
                    </div>
                    <span className="text-sm font-medium">{signersThreshold} of {vaultSigners.length}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">Time Lock</span>
                    </div>
                    <span className="text-sm font-medium">
                      {timelockDays > 0 ? `${timelockDays} days` : 'None'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Fingerprint className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">Security Level</span>
                    </div>
                    <Badge variant="outline" className="bg-green-900/30 text-green-400 border-green-800">Advanced</Badge>
                  </div>
                </div>
                
                <Separator className="bg-gray-800" />
                
                <div className="pt-2">
                  <div className="text-sm font-medium mb-2">Active Signers</div>
                  <div className="space-y-2 max-h-[180px] overflow-y-auto pr-2">
                    {vaultSigners.map((signer) => (
                      <div 
                        key={signer.id} 
                        className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0"
                      >
                        <div className="flex items-center space-x-2">
                          <div className="bg-gray-800 p-1.5 rounded-full">
                            <Users className="h-3.5 w-3.5 text-gray-400" />
                          </div>
                          <div className="text-sm font-medium">{signer.name}</div>
                        </div>
                        {signer.role === 'owner' ? (
                          <Badge variant="outline" className="bg-purple-900/30 text-purple-400 border-purple-800 text-xs">Owner</Badge>
                        ) : (
                          <Badge variant="outline" className="bg-blue-900/30 text-blue-400 border-blue-800 text-xs">Signer</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-black/40 border-gray-800">
              <CardHeader>
                <CardTitle>Security Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-500/10 p-3 rounded-full">
                    <ShieldAlert className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <div className="font-medium">Secure</div>
                    <div className="text-xs text-gray-400">All security checks passed</div>
                  </div>
                </div>
                
                <div className="pt-2 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Multi-Signature Integrity</span>
                    <Badge variant="outline" className="bg-green-900/30 text-green-400 border-green-800">Verified</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Hardware Key Auth</span>
                    <Badge variant="outline" className="bg-green-900/30 text-green-400 border-green-800">Enabled</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Time-Lock Protection</span>
                    <Badge variant="outline" className="bg-green-900/30 text-green-400 border-green-800">Active</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Social Recovery</span>
                    <Badge variant="outline" className="bg-green-900/30 text-green-400 border-green-800">Configured</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Biometric Auth</span>
                    <Badge variant="outline" className="bg-gray-700 text-gray-400 border-gray-600">Disabled</Badge>
                  </div>
                </div>
                
                <Alert className="mt-4 bg-[#3F51FF]/10 border-[#3F51FF]/30 text-[#3F51FF]">
                  <Shield className="h-4 w-4" />
                  <AlertTitle>Enhanced Security Active</AlertTitle>
                  <AlertDescription>
                    Your vault has advanced Triple-Chain security and quantum-resistant encryption enabled.
                  </AlertDescription>
                </Alert>
                
                <div className="flex flex-col gap-2 mt-4">
                  <Button 
                    variant="outline" 
                    className="border-yellow-800 bg-yellow-900/20 text-yellow-500 hover:bg-yellow-900/30 gap-2"
                    onClick={() => setRecoveryDialogOpen(true)}
                  >
                    <ShieldAlert size={16} />
                    Vault Recovery
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="border-gray-700 text-gray-300 hover:bg-gray-800 gap-2"
                  >
                    <Download size={16} />
                    Export Vault Config
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  };
  
  // Recovery Dialog for the social recovery process
  const RecoveryDialog = () => {
    return (
      <Dialog open={recoveryDialogOpen} onOpenChange={setRecoveryDialogOpen}>
        <DialogContent className="bg-gray-950 border border-gray-800 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <ShieldAlert className="w-5 h-5 mr-2 text-yellow-500" />
              Vault Recovery Process
            </DialogTitle>
            {!recoveryInitiated ? (
              <DialogDescription>
                Initiate the recovery process to regain access to your vault. Guardians will be notified and asked to approve the recovery.
              </DialogDescription>
            ) : (
              <DialogDescription>
                Recovery process in progress. {recoveryApprovals} of {guardianThreshold} guardian approvals received.
              </DialogDescription>
            )}
          </DialogHeader>
          
          {!recoveryInitiated ? (
            <div className="space-y-4">
              <div className="p-4 bg-yellow-950/20 border border-yellow-900/50 rounded-lg">
                <h4 className="font-medium text-yellow-500 mb-2">Important Information</h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-start">
                    <span className="text-yellow-500 mr-2">•</span>
                    Recovery should only be used if you've lost access to your keys or devices.
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-500 mr-2">•</span>
                    At least {guardianThreshold} of your {recoveryGuardians.length} guardians must approve the recovery.
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-500 mr-2">•</span>
                    The recovery process creates new keys, invalidating old ones.
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-500 mr-2">•</span>
                    Guardian verification happens on-chain for maximum security.
                  </li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <Label>Recovery Reason</Label>
                <Select defaultValue="lost_keys">
                  <SelectTrigger className="bg-black/40 border-gray-700">
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lost_keys">Lost private keys</SelectItem>
                    <SelectItem value="device_failure">Device failure or loss</SelectItem>
                    <SelectItem value="seed_phrase">Lost seed phrase</SelectItem>
                    <SelectItem value="other">Other reason</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Additional Details (optional)</Label>
                <Textarea 
                  placeholder="Provide any additional context for your guardians..."
                  className="bg-black/40 border-gray-700 min-h-[80px]"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Step 1: Guardian Verification */}
              <div className={`${recoveryStep !== 1 && 'opacity-50'}`}>
                <h3 className="font-medium text-lg mb-3 flex items-center">
                  <span className="bg-gray-800 text-white w-6 h-6 flex items-center justify-center rounded-full mr-2 text-sm">1</span>
                  Guardian Verification
                </h3>
                <div className="space-y-3 pl-8">
                  <p className="text-sm text-gray-400">Guardians must verify their identity on-chain.</p>
                  
                  <div className="space-y-2">
                    {recoveryGuardians.map(guardian => (
                      <div key={guardian.id} className="flex items-center justify-between p-3 bg-black/40 border border-gray-800 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-full ${
                            guardian.status === 'active' ? 'bg-green-900/20' : 'bg-gray-800'
                          }`}>
                            <Shield className={`h-5 w-5 ${
                              guardian.status === 'active' ? 'text-green-500' : 'text-gray-500'
                            }`} />
                          </div>
                          <div>
                            <div className="font-medium">{guardian.name}</div>
                            <div className="text-xs text-gray-500">
                              {guardian.address.slice(0, 6)}...{guardian.address.slice(-4)}
                            </div>
                          </div>
                        </div>
                        <div>
                          {guardian.status === 'active' ? (
                            <Badge variant="outline" className="bg-green-900/20 text-green-500 border-green-800">
                              Verified
                            </Badge>
                          ) : (
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-blue-500 border-blue-900/50"
                              onClick={() => approveRecovery(guardian.id)}
                            >
                              Verify
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="pt-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>{recoveryApprovals} of {guardianThreshold} approvals</span>
                      <span>{Math.floor((recoveryApprovals / guardianThreshold) * 100)}%</span>
                    </div>
                    <Progress 
                      value={(recoveryApprovals / guardianThreshold) * 100} 
                      className="h-1 mt-2"
                    />
                  </div>
                </div>
              </div>
              
              {/* Step 2: New Keys Generation */}
              <div className={`${recoveryStep !== 2 && 'opacity-50'}`}>
                <h3 className="font-medium text-lg mb-3 flex items-center">
                  <span className="bg-gray-800 text-white w-6 h-6 flex items-center justify-center rounded-full mr-2 text-sm">2</span>
                  Generate New Keys
                </h3>
                <div className="space-y-3 pl-8">
                  <p className="text-sm text-gray-400">Create new encryption keys for your vault.</p>
                  
                  {recoveryStep >= 2 ? (
                    <div className="space-y-4">
                      <div className="p-3 bg-black/40 border border-gray-800 rounded-lg">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">New Address</span>
                            <code className="text-xs bg-black/60 px-2 py-1 rounded font-mono">
                              0x7F5aB7C2CE83613b294fc33EDf89e7b3
                            </code>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Security Level</span>
                            <span>Triple-Chain Verification</span>
                          </div>
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full bg-[#3F51FF] hover:bg-[#3F51FF]/80"
                        onClick={completeRecovery}
                      >
                        Complete Recovery
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <Fingerprint className="h-12 w-12 mx-auto mb-3 text-gray-700" />
                      <p className="text-gray-500">Awaiting guardian verification</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Step 3: Confirmation */}
              <div className={`${recoveryStep !== 3 && 'opacity-50'}`}>
                <h3 className="font-medium text-lg mb-3 flex items-center">
                  <span className="bg-gray-800 text-white w-6 h-6 flex items-center justify-center rounded-full mr-2 text-sm">3</span>
                  Recovery Complete
                </h3>
                <div className="space-y-3 pl-8">
                  {recoveryStep === 3 ? (
                    <div className="text-center py-6">
                      <CheckCircle2 className="h-12 w-12 mx-auto mb-3 text-green-500" />
                      <p className="text-green-500 font-medium">Vault recovery successful!</p>
                      <p className="text-sm text-gray-400 mt-1">Your vault has been restored with new keys.</p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">Final confirmation and access restoration.</p>
                  )}
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            {!recoveryInitiated ? (
              <Button 
                className="bg-yellow-600 hover:bg-yellow-700 text-white"
                onClick={initiateRecovery}
              >
                Start Recovery Process
              </Button>
            ) : recoveryStep === 3 ? (
              <Button 
                className="bg-green-600 hover:bg-green-700"
                onClick={() => setRecoveryDialogOpen(false)}
              >
                Close
              </Button>
            ) : (
              <Button 
                variant="outline"
                onClick={() => setRecoveryDialogOpen(false)}
              >
                Cancel
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="container py-6">
      {createMode ? renderCreationUI() : renderManagementUI()}
      <RecoveryDialog />
    </div>
  );
}