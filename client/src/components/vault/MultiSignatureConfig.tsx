import React, { useState, useEffect } from 'react';
import { PlusCircle, Trash2, Users, Shield } from 'lucide-react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useMultiChain } from '@/contexts/multi-chain-context';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

// Schema for an authorized signer
const signerSchema = z.object({
  address: z.string().min(10, { message: "Please enter a valid wallet address" }),
  name: z.string().optional(),
  weight: z.number().min(1).max(10).default(1),
});

// Schema for the multi-signature configuration
const multiSigConfigSchema = z.object({
  threshold: z.number().min(1).max(100),
  signers: z.array(signerSchema).min(2, { message: "At least 2 signers are required" }),
  timeLimit: z.number().min(1).optional(),
  requireGeolocation: z.boolean().default(false),
});

type Signer = z.infer<typeof signerSchema>;
type MultiSigConfig = z.infer<typeof multiSigConfigSchema>;

interface MultiSignatureConfigProps {
  vaultId?: number;
  onConfigChange?: (config: MultiSigConfig) => void;
  className?: string;
  defaultConfig?: Partial<MultiSigConfig>;
}

export function MultiSignatureConfig({
  vaultId,
  onConfigChange,
  className,
  defaultConfig,
}: MultiSignatureConfigProps) {
  const { toast } = useToast();
  const { walletInfo } = useMultiChain();
  const [signers, setSigners] = useState<Signer[]>([]);
  
  // Initialize with at least the owner's address
  useEffect(() => {
    if (defaultConfig?.signers && defaultConfig.signers.length > 0) {
      setSigners(defaultConfig.signers);
    } else if (walletInfo.ethereum.address) {
      setSigners([
        {
          address: walletInfo.ethereum.address,
          name: 'Owner',
          weight: 1,
        }
      ]);
    }
  }, [walletInfo.ethereum.address, defaultConfig]);

  // Create form with default values
  const form = useForm<MultiSigConfig>({
    resolver: zodResolver(multiSigConfigSchema),
    defaultValues: {
      threshold: defaultConfig?.threshold || 2,
      signers: signers,
      timeLimit: defaultConfig?.timeLimit || 24, // 24 hours default
      requireGeolocation: defaultConfig?.requireGeolocation || false,
    },
  });

  // Watch for changes to update parent component
  const watchedValues = form.watch();
  
  useEffect(() => {
    // Only notify parent if we have valid values
    if (signers.length >= 2 && watchedValues.threshold > 0) {
      const currentConfig = {
        ...watchedValues,
        signers: signers,
      };
      onConfigChange?.(currentConfig);
    }
  }, [watchedValues, signers, onConfigChange]);

  // Add a new signer
  const addSigner = () => {
    const newSigner: Signer = {
      address: '',
      name: `Signer ${signers.length + 1}`,
      weight: 1,
    };
    setSigners([...signers, newSigner]);
  };

  // Remove a signer by index
  const removeSigner = (index: number) => {
    if (signers.length <= 2) {
      toast({
        title: "Cannot remove signer",
        description: "At least 2 signers are required for a multi-signature vault",
        variant: "destructive",
      });
      return;
    }
    const newSigners = [...signers];
    newSigners.splice(index, 1);
    setSigners(newSigners);
  };

  // Update a signer's address
  const updateSignerAddress = (index: number, address: string) => {
    const newSigners = [...signers];
    newSigners[index].address = address;
    setSigners(newSigners);
  };

  // Update a signer's name
  const updateSignerName = (index: number, name: string) => {
    const newSigners = [...signers];
    newSigners[index].name = name;
    setSigners(newSigners);
  };

  // Update a signer's weight
  const updateSignerWeight = (index: number, weight: number) => {
    const newSigners = [...signers];
    newSigners[index].weight = weight;
    setSigners(newSigners);
  };

  return (
    <Card className={`${className || ''} border-purple-700/30 bg-black/40`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg text-white">
          <Users className="h-5 w-5 text-purple-500" />
          Multi-Signature Configuration
        </CardTitle>
        <CardDescription>
          Setup trusted parties who must approve vault operations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <div className="space-y-4">
            <div className="grid gap-6 sm:gap-4 grid-cols-1 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="threshold"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm">Approval Threshold</FormLabel>
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:items-center sm:gap-2">
                      <Slider
                        min={1}
                        max={Math.max(signers.length, 2)}
                        step={1}
                        value={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                        className="flex-1"
                      />
                      <div className="w-16 text-center">
                        <div className="rounded-md border border-input bg-background px-2 py-1 text-sm">
                          {field.value}/{signers.length}
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      At least {field.value} out of {signers.length} signers must approve
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="timeLimit"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm">Time Limit (hours)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={720} // 30 days max
                        {...field}
                        value={field.value || ''}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 24)}
                        className="h-9"
                      />
                    </FormControl>
                    <p className="text-xs text-muted-foreground">
                      Signatures must be collected within this time window
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="requireGeolocation"
              render={({ field }) => (
                <FormItem className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0 rounded-lg border border-purple-600/20 p-4 bg-purple-800/10">
                  <div className="space-y-1">
                    <FormLabel className="text-base flex items-center gap-2">
                      <Shield className="h-5 w-5 text-purple-500" />
                      Require Geolocation Verification
                    </FormLabel>
                    <p className="text-xs text-muted-foreground">
                      Signers must verify their location matches predefined safe zones
                    </p>
                  </div>
                  <FormControl>
                    <div className="flex h-8 w-12 items-center justify-center rounded-md bg-purple-900/20 border border-purple-600/20">
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="accent-purple-600 h-5 w-5"
                      />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">Authorized Signers</h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={addSigner}
                  className="gap-1 text-xs border-purple-600/50 hover:bg-purple-600/20"
                >
                  <PlusCircle className="h-3.5 w-3.5" />
                  Add Signer
                </Button>
              </div>
              
              <div className="rounded-md border border-purple-600/20 divide-y divide-purple-600/10 bg-black/20">
                {signers.map((signer, index) => (
                  <div key={index} className="p-3 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-800/40 text-white text-xs font-medium border border-purple-600/30">
                          {index + 1}
                        </div>
                        <span className="text-sm font-medium">{signer.name || `Signer ${index + 1}`}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSigner(index)}
                        className="h-8 text-red-500 hover:text-red-700 hover:bg-red-700/10"
                        disabled={signers.length <= 2}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                      <div className="md:col-span-7">
                        <FormLabel className="text-xs mb-1 block">Wallet Address</FormLabel>
                        <Input
                          placeholder="0x..."
                          value={signer.address}
                          onChange={(e) => updateSignerAddress(index, e.target.value)}
                          className="h-9 text-xs sm:text-sm"
                        />
                      </div>
                      <div className="md:col-span-3">
                        <FormLabel className="text-xs mb-1 block">Name</FormLabel>
                        <Input
                          placeholder="Alice"
                          value={signer.name || ''}
                          onChange={(e) => updateSignerName(index, e.target.value)}
                          className="h-9 text-xs sm:text-sm"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <FormLabel className="text-xs mb-1 block">Weight</FormLabel>
                        <Select
                          value={signer.weight.toString()}
                          onValueChange={(value) => updateSignerWeight(index, parseInt(value))}
                        >
                          <SelectTrigger className="h-9 text-xs sm:text-sm">
                            <SelectValue placeholder="1" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1</SelectItem>
                            <SelectItem value="2">2</SelectItem>
                            <SelectItem value="3">3</SelectItem>
                            <SelectItem value="5">5</SelectItem>
                            <SelectItem value="10">10</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}
