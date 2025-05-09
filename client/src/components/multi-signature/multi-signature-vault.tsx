import React, { useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Fingerprint, 
  Key, 
  XCircle
} from "lucide-react";

// Simplified version to get the app running again
export enum BlockchainType {
  ETHEREUM = 0,
  SOLANA = 1,
  TON = 2,
  BITCOIN = 3
}

export enum TransactionType {
  TRANSFER = 'transfer',
  CONTRACT_INTERACTION = 'contract_interaction',
  RECOVERY = 'recovery',
  SETTINGS_CHANGE = 'settings_change',
  ADD_SIGNER = 'add_signer',
  REMOVE_SIGNER = 'remove_signer',
  CHANGE_THRESHOLD = 'change_threshold'
}

interface Signer {
  id: string;
  address: string;
  name: string;
  status: 'pending' | 'accepted' | 'rejected';
  role: 'owner' | 'signer' | 'viewer';
  timeAdded: Date;
  hasKey: boolean;
  timeConstraints?: {
    enabled: boolean;
    startTime: string;
    endTime: string;
    allowedDays: number[];
    timeZone: string;
    effectiveFrom?: Date;
    effectiveUntil?: Date;
  };
  transactionPermissions?: {
    enabled: boolean;
    allowedTypes: TransactionType[];
    approvalLimits: {
      [TransactionType.TRANSFER]: {
        maxAmount: string;
        allowedDestinations: string[];
      };
      [TransactionType.CONTRACT_INTERACTION]: {
        allowedContracts: string[];
        allowedMethods: string[];
      };
    };
  };
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
  // This is a simplified version just to get things running again
  const [vaultSigners, setVaultSigners] = useState<Signer[]>(signers.length > 0 ? signers : [
    {
      id: "1",
      address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      name: "You (Owner)",
      status: 'accepted',
      role: 'owner',
      timeAdded: new Date(),
      hasKey: true,
      timeConstraints: {
        enabled: false,
        startTime: "09:00",
        endTime: "17:00",
        allowedDays: [1, 2, 3, 4, 5],
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      transactionPermissions: {
        enabled: false,
        allowedTypes: [],
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
    }
  ]);

  // Function to remove a signer
  const removeSigner = (id: string) => {
    setVaultSigners(vaultSigners.filter(signer => signer.id !== id));
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="space-y-8">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Mobile-Friendly Multi-Signature Vault</h2>
          <p className="text-gray-500">
            This shows the updated mobile-friendly signers section
          </p>
        </div>
        
        <Card className="bg-black/40 border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2 text-[#3F51FF]" />
              Signers Configuration
            </CardTitle>
            <CardDescription>Signers with improved mobile layout</CardDescription>
          </CardHeader>
          <CardContent>
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
                    
                    {/* Only one Time-based Access Constraints section */}
                    {signer.timeConstraints && (
                      <div className="mt-3 pt-3 border-t border-gray-800">
                        <div className="flex justify-between items-center mb-2">
                          <Label htmlFor={`time-constraints-${signer.id}`} className="text-sm font-medium">
                            Time-based Access Constraints
                          </Label>
                        </div>
                        <p className="text-sm text-gray-500">
                          {signer.timeConstraints.enabled 
                            ? `Signer can approve transactions during ${signer.timeConstraints.startTime} - ${signer.timeConstraints.endTime} on selected days.` 
                            : 'No time constraints applied.'}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}