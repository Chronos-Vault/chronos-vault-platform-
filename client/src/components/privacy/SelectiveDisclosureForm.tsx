/**
 * Selective Disclosure Form
 * 
 * This component provides a user interface for creating selective disclosure proofs,
 * which allow users to reveal only specific data about their vaults while keeping other information private.
 */

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { EyeOff, Shield, FileText, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getPrivacyLayerService } from '@/lib/privacy';
import { ZkProof } from '@/lib/privacy/zk-proof-service';
import { BlockchainType } from '@/lib/cross-chain/interfaces';

// Form schema
const selectiveDisclosureSchema = z.object({
  vaultId: z.string().min(1, { message: 'Vault ID is required' }),
  blockchain: z.enum(['ETH', 'SOL', 'TON']),
  disclosedFields: z.array(z.string()).min(1, { message: 'Select at least one field to disclose' })
});

type SelectiveDisclosureFormValues = z.infer<typeof selectiveDisclosureSchema>;

// Available vault fields for selective disclosure
const vaultFields = [
  { id: 'ownership', label: 'Vault Ownership' },
  { id: 'creationDate', label: 'Creation Date' },
  { id: 'lastModified', label: 'Last Modified' },
  { id: 'type', label: 'Vault Type' },
  { id: 'hasTimelock', label: 'Has Time-Lock' },
  { id: 'supportsCrossChain', label: 'Supports Cross-Chain' },
  { id: 'securityLevel', label: 'Security Level' },
  { id: 'publicDescription', label: 'Public Description' },
];

// Component props
interface SelectiveDisclosureFormProps {
  initialVaultId?: string;
  onProofGenerated?: (proof: ZkProof) => void;
  className?: string;
}

export function SelectiveDisclosureForm({ 
  initialVaultId, 
  onProofGenerated,
  className 
}: SelectiveDisclosureFormProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedProof, setGeneratedProof] = useState<ZkProof | null>(null);
  const { toast } = useToast();
  
  const form = useForm<SelectiveDisclosureFormValues>({
    resolver: zodResolver(selectiveDisclosureSchema),
    defaultValues: {
      vaultId: initialVaultId || '',
      blockchain: 'ETH',
      disclosedFields: ['ownership']
    }
  });

  const { register, handleSubmit, formState: { errors }, watch, setValue } = form;
  const selectedFields = watch('disclosedFields');

  const onSubmit = async (values: SelectiveDisclosureFormValues) => {
    setIsGenerating(true);
    setGeneratedProof(null);
    
    try {
      const privacyService = getPrivacyLayerService();
      
      // Generate selective disclosure proof
      const proof = await privacyService.createSelectiveDisclosureProof(
        values.vaultId,
        values.disclosedFields,
        values.blockchain as 'ETH' | 'SOL' | 'TON'
      );
      
      setGeneratedProof(proof);
      
      if (onProofGenerated) {
        onProofGenerated(proof);
      }
      
      toast({
        title: 'Selective Disclosure Proof Generated',
        description: 'Your proof has been successfully created',
        variant: 'default'
      });
    } catch (error: any) {
      console.error('Error generating selective disclosure proof:', error);
      toast({
        title: 'Error Generating Proof',
        description: error.message || 'An unknown error occurred',
        variant: 'destructive'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleField = (fieldId: string) => {
    const currentFields = form.getValues('disclosedFields');
    const isSelected = currentFields.includes(fieldId);
    
    if (isSelected) {
      // Remove field
      setValue(
        'disclosedFields', 
        currentFields.filter(id => id !== fieldId),
        { shouldValidate: true }
      );
    } else {
      // Add field
      setValue(
        'disclosedFields', 
        [...currentFields, fieldId],
        { shouldValidate: true }
      );
    }
  };

  return (
    <Card className={`bg-background border-border shadow-md ${className || ''}`}>
      <CardHeader className="bg-gradient-to-r from-[#6B00D7]/5 to-[#FF5AF7]/5">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <EyeOff className="h-5 w-5 text-[#FF5AF7]" />
          <span>Selective Disclosure</span>
        </CardTitle>
        <CardDescription>
          Create a proof that reveals only specific vault data while keeping other information private
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Vault ID */}
          <div className="space-y-2">
            <Label htmlFor="vaultId">Vault ID</Label>
            <Input
              id="vaultId"
              placeholder="Enter vault identifier"
              {...register('vaultId')}
            />
            {errors.vaultId && (
              <p className="text-red-500 text-sm">{errors.vaultId.message}</p>
            )}
          </div>

          {/* Blockchain Selection */}
          <div className="space-y-2">
            <Label htmlFor="blockchain">Blockchain</Label>
            <Select
              onValueChange={(value) => setValue('blockchain', value as 'ETH' | 'SOL' | 'TON')}
              defaultValue={form.getValues('blockchain')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select blockchain" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ETH">Ethereum</SelectItem>
                <SelectItem value="SOL">Solana</SelectItem>
                <SelectItem value="TON">TON</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Fields to Disclose */}
          <div className="space-y-2">
            <Label>Fields to Disclose</Label>
            <div className="bg-muted/30 p-4 rounded-md">
              <input 
                type="hidden" 
                {...register('disclosedFields')} 
              />
              {errors.disclosedFields && (
                <p className="text-red-500 text-sm mb-2">{errors.disclosedFields.message}</p>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {vaultFields.map((field) => (
                  <div 
                    key={field.id} 
                    className={`flex items-center space-x-2 p-2 rounded cursor-pointer transition-colors ${selectedFields.includes(field.id) ? 'bg-primary/10' : 'hover:bg-muted'}`}
                    onClick={() => toggleField(field.id)}
                  >
                    <Checkbox 
                      id={`field-${field.id}`}
                      checked={selectedFields.includes(field.id)}
                      onCheckedChange={() => toggleField(field.id)}
                    />
                    <Label 
                      htmlFor={`field-${field.id}`}
                      className="cursor-pointer font-normal text-sm"
                    >
                      {field.label}
                    </Label>
                  </div>
                ))}
              </div>
              
              <div className="mt-3 text-xs text-muted-foreground">
                Select the vault data fields you want to disclose in your proof. All other information will remain private.
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-[#6B00D7] to-[#9242FC] hover:from-[#5A00B3] hover:to-[#7E36DD]"
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Proof...
              </>
            ) : (
              <>Generate Selective Disclosure Proof</>
            )}
          </Button>
        </form>

        {generatedProof && (
          <div className="mt-6 bg-muted/30 p-4 rounded-md">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-500" />
                <span>Proof Generated</span>
              </h3>
              <Badge variant="outline" className="text-xs font-normal">
                {generatedProof.blockchain}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div>
                <p className="text-xs text-muted-foreground">Proof ID</p>
                <p className="text-sm font-mono">{generatedProof.id.substring(0, 18)}...</p>
              </div>
              
              <div>
                <p className="text-xs text-muted-foreground">Disclosed Fields</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedFields.map(fieldId => {
                    const field = vaultFields.find(f => f.id === fieldId);
                    return (
                      <Badge key={fieldId} variant="secondary" className="text-xs">
                        {field?.label || fieldId}
                      </Badge>
                    );
                  })}
                </div>
              </div>
              
              <div className="pt-2">
                <Button variant="outline" size="sm" className="w-full mt-1">
                  <FileText className="h-3.5 w-3.5 mr-1" />
                  View Proof Details
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
