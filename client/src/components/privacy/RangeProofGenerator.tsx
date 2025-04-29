/**
 * Range Proof Generator
 * 
 * This component provides an interface for generating range proofs, which allow
 * users to prove that a numeric value is within a specific range without revealing
 * the exact value - essential for privacy-preserving verification.
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
import { Badge } from '@/components/ui/badge';
import { Calculator, FileText, Loader2, CircleDollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getPrivacyLayerService } from '@/lib/privacy';
import { ZkProof } from '@/lib/privacy/zk-proof-service';
import { BlockchainType } from '@/lib/cross-chain/interfaces';

// Form schema
const rangeProofSchema = z.object({
  vaultId: z.string().min(1, { message: 'Vault ID is required' }),
  minValue: z.string().min(1, { message: 'Minimum value is required' }),
  maxValue: z.string().min(1, { message: 'Maximum value is required' }),
  blockchain: z.enum(['ETH', 'SOL', 'TON'])
}).refine(data => {
  // Ensure max is greater than min
  const min = parseFloat(data.minValue);
  const max = parseFloat(data.maxValue);
  return !isNaN(min) && !isNaN(max) && max > min;
}, {
  message: "Maximum value must be greater than minimum value",
  path: ["maxValue"]
});

type RangeProofFormValues = z.infer<typeof rangeProofSchema>;

// Component props
interface RangeProofGeneratorProps {
  initialVaultId?: string;
  onProofGenerated?: (proof: ZkProof) => void;
  className?: string;
}

export function RangeProofGenerator({ 
  initialVaultId, 
  onProofGenerated,
  className 
}: RangeProofGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedProof, setGeneratedProof] = useState<ZkProof | null>(null);
  const { toast } = useToast();
  
  const form = useForm<RangeProofFormValues>({
    resolver: zodResolver(rangeProofSchema),
    defaultValues: {
      vaultId: initialVaultId || '',
      minValue: '',
      maxValue: '',
      blockchain: 'ETH'
    }
  });

  const onSubmit = async (values: RangeProofFormValues) => {
    setIsGenerating(true);
    setGeneratedProof(null);
    
    try {
      const privacyService = getPrivacyLayerService();
      
      // Generate range proof
      const proof = await privacyService.createRangeProof(
        values.vaultId,
        values.minValue,
        values.maxValue,
        values.blockchain as 'ETH' | 'SOL' | 'TON'
      );
      
      setGeneratedProof(proof);
      
      if (onProofGenerated) {
        onProofGenerated(proof);
      }
      
      toast({
        title: 'Range Proof Generated',
        description: 'Your value range proof has been successfully created',
        variant: 'default'
      });
    } catch (error: any) {
      console.error('Error generating range proof:', error);
      toast({
        title: 'Error Generating Proof',
        description: error.message || 'An unknown error occurred',
        variant: 'destructive'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Helper function to format a value
  const formatValue = (value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return value;
    
    // Format numbers nicely
    return numValue.toLocaleString(undefined, {
      maximumFractionDigits: 4
    });
  };

  return (
    <Card className={`bg-background border-border shadow-md ${className || ''}`}>
      <CardHeader className="bg-gradient-to-r from-[#6B00D7]/5 to-[#FF5AF7]/5">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Calculator className="h-5 w-5 text-[#FF5AF7]" />
          <span>Range Proof Generator</span>
        </CardTitle>
        <CardDescription>
          Prove a value is within a specific range without revealing the exact amount
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Vault ID */}
          <div className="space-y-2">
            <Label htmlFor="vaultId">Vault ID</Label>
            <Input
              id="vaultId"
              placeholder="Enter vault identifier"
              {...form.register('vaultId')}
            />
            {form.formState.errors.vaultId && (
              <p className="text-red-500 text-sm">{form.formState.errors.vaultId.message}</p>
            )}
          </div>

          {/* Min and Max Values */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minValue">Minimum Value</Label>
              <div className="relative">
                <CircleDollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="minValue"
                  placeholder="0"
                  className="pl-9"
                  {...form.register('minValue')}
                />
              </div>
              {form.formState.errors.minValue && (
                <p className="text-red-500 text-sm">{form.formState.errors.minValue.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="maxValue">Maximum Value</Label>
              <div className="relative">
                <CircleDollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="maxValue"
                  placeholder="1000"
                  className="pl-9"
                  {...form.register('maxValue')}
                />
              </div>
              {form.formState.errors.maxValue && (
                <p className="text-red-500 text-sm">{form.formState.errors.maxValue.message}</p>
              )}
            </div>
          </div>

          {/* Blockchain Selection */}
          <div className="space-y-2">
            <Label htmlFor="blockchain">Blockchain</Label>
            <Select
              onValueChange={(value) => form.setValue('blockchain', value as 'ETH' | 'SOL' | 'TON')}
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
              <>Generate Range Proof</>
            )}
          </Button>
        </form>

        {generatedProof && (
          <div className="mt-6 bg-muted/30 p-4 rounded-md">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium flex items-center gap-2">
                <Calculator className="h-4 w-4 text-green-500" />
                <span>Range Proof Generated</span>
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
                <p className="text-xs text-muted-foreground">Range</p>
                <p className="text-sm">
                  Between <span className="font-medium">${formatValue(form.getValues('minValue'))}</span> and{' '}
                  <span className="font-medium">${formatValue(form.getValues('maxValue'))}</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  This proof demonstrates that a value is within this range without revealing the exact value.
                </p>
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
